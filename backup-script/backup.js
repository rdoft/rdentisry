const fs = require("fs");
const path = require("path");
const cron = require("node-cron");
const util = require("util");
const { exec } = require("child_process");
const execAsync = util.promisify(exec);
require("dotenv").config();

const SERVER = process.env.SERVER;
const DB = process.env.DB;
const LOG_SRC = process.env.LOG_SRC;
const DB_HOST = process.env.DB_HOST;
const DB_DB = process.env.DB_DB;
const DB_PORT = process.env.DB_PORT;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;

// Backup paths and names
const DB_PATH = "/backup/db";
const LOG_PATH = "/backup/logs";
const BACKUP_NAME = new Date().toISOString().replace(/[:.]/g, "-");

// Retention policies
const DB_RETAIN_DAYS = 7;
const DB_RETAIN_WEEKS = 4;
const DB_RETAIN_MONTHS = 6;
const LOG_RETAIN_WEEKS = 14;

// Backup the database
const backupDb = async (type) => {
  const temp = `/tmp/${BACKUP_NAME}.sql`;
  const dest = path.join(DB_PATH, type, `${BACKUP_NAME}.sql`);

  try {
    // Dump the database to a temporary file inside the Docker container
    await execAsync(
      `docker exec ${DB} sh -c "PGPASSWORD=${DB_PASSWORD} pg_dump -h ${DB_HOST} -p ${DB_PORT} -U ${DB_USER} -d ${DB_DB} -F c > ${temp}"`
    );

    // Copy the dumped database file from the Docker container to the local machine
    await execAsync(`docker cp ${DB}:${temp} ${dest}`);

    // Remove the temporary file from the Docker container
    await execAsync(`docker exec ${DB} rm ${temp}`);

    console.log(`Database backup completed: ${dest}`);
  } catch (err) {
    console.error(`Database backup failed: ${err}`);
  }
};

// Backup logs
const backupLogs = async () => {
  const temp = `/tmp/${BACKUP_NAME}.tar.gz`;
  const dest = path.join(LOG_PATH, `${BACKUP_NAME}.tar.gz`);

  try {
    // Archive the logs inside the Docker container
    await execAsync(`docker exec ${SERVER} tar -czf ${temp} -C ${LOG_SRC} .`);
    // Copy the archived logs from the Docker container to the local machine
    await execAsync(`docker cp ${SERVER}:${temp} ${dest}`);
    // Clear the contents of the log files inside the Docker container
    await execAsync(
      `docker exec ${SERVER} sh -c 'find ${LOG_SRC} -type f -exec truncate -s 0 {} +'`
    );
    // Remove the archive from the Docker container
    await execAsync(`docker exec ${SERVER} rm ${temp}`);

    console.log(`Log backup completed: ${dest}`);
  } catch (err) {
    console.error(`Log backup failed: ${err}`);
  }
};

// Rotate old backups
const rotateBackups = (backupPath, retainDays) => {
  const now = Date.now();

  fs.readdir(backupPath, (err, files) => {
    if (err) {
      console.error(`Rotate backup failed, ${backupPath}: ${err}`);
      return;
    }

    files.forEach((file) => {
      const filePath = path.join(backupPath, file);

      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error(`Rotate backup failed, ${filePath}: ${err}`);
          return;
        }

        if (now - stats.mtimeMs > retainDays * 24 * 60 * 60 * 1000) {
          fs.unlink(filePath, (err) => {
            if (err) {
              console.error(`Rotate backup failed, ${filePath}: ${err}`);
            } else {
              console.log(`Rotate backup completed: ${filePath}`);
            }
          });
        }
      });
    });
  });
};

// Main backup routine
const backup = (type) => {
  // Create necessary directories if they don't exist
  const dirs = [
    path.join(DB_PATH, "daily"),
    path.join(DB_PATH, "weekly"),
    path.join(DB_PATH, "monthly"),
    LOG_PATH,
  ];
  dirs.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  // Backup the database (daily, weekly, monthly)
  backupDb(type);
  // Backup logs weekly
  if (type === "weekly") {
    backupLogs();
  }

  // Rotate old backups
  rotateBackups(path.join(DB_PATH, "daily"), DB_RETAIN_DAYS);
  rotateBackups(path.join(DB_PATH, "weekly"), DB_RETAIN_WEEKS * 7);
  rotateBackups(path.join(DB_PATH, "monthly"), DB_RETAIN_MONTHS * 30);
  rotateBackups(LOG_PATH, LOG_RETAIN_WEEKS * 7);
};

// Run backup ---------------------------------------------------------------
// Schedule daily backup at 24:00 (midnight)
cron.schedule("0 0 * * *", () => {
  console.log("Running daily backup...");
  backup("daily");
});

// Schedule weekly backup every Friday at 24:00 (midnight)
cron.schedule("0 0 * * 5", () => {
  console.log("Running weekly backup...");
  backup("weekly");
});

// Schedule monthly backup on the 14th of every month at 24:00 (midnight)
cron.schedule("0 0 14 * *", () => {
  console.log("Running monthly backup...");
  backup("monthly");
});
