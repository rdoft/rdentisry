import React from "react";
import { Tag, Divider } from "primereact";
import { Grid, Tooltip, Typography } from "@mui/material";
import { CircleProgress } from "components/Progress";

// assets
import { useTheme } from "@mui/material/styles";

function StatusBadge({ procedures, ...props }) {
  const theme = useTheme();

  let inProgress = null;
  let completed = null;
  let categories = {};

  if (procedures) {
    inProgress = procedures.filter((procedure) => !procedure.completedDate);
    completed = procedures.filter((procedure) => procedure.completedDate);

    // Group procedures by category and calculate counts
    categories = procedures.reduce((acc, procedure) => {
      const isCompleted = procedure.completedDate !== null;
      const category = procedure.procedure.procedureCategory || {
        id: "other",
        title: "Diğer",
      };

      if (!acc[category.id]) {
        acc[category.id] = {
          title: category.title,
          completed: 0,
          total: 0,
          progress: 0,
        };
      }

      acc[category.id].total += 1;
      if (isCompleted) {
        acc[category.id].completed += 1;
        acc[category.id].progress =
          (acc[category.id].completed / acc[category.id].total) * 100;
      }

      return acc;
    }, {});
  }

  // TEMPLATES ----------------------------------------------------------------
  // Category tooltip
  const tooltip = (
    <Grid container>
      {Object.keys(categories).map((key) => {
        const category = categories[key];

        return (
          <Grid item xs key={category.title} mx={1} p={1} textAlign="center">
            <Typography
              variant="h5"
              color={theme.palette.text.primary}
              paddingBottom={1}
            >
              {category.title}
            </Typography>

            <CircleProgress
              completed={category.completed}
              total={category.total}
              style={{
                color: theme.palette.text.secondary,
                bgColor: theme.palette.grey[300],
              }}
            />
          </Grid>
        );
      })}

      <Divider />

      <Grid container item xs={12}>
        <Grid item xs={6} px={1}>
          <Tag
            value="Bekleniyor"
            style={{
              backgroundColor: theme.palette.background.info,
              color: theme.palette.text.info,
            }}
          />
          {inProgress?.map((procedure) => (
            <Typography
              key={procedure.id}
              variant="body2"
              color={theme.palette.text.primary}
              my={1}
            >
              <strong>•</strong> {procedure.procedure.name}
            </Typography>
          ))}
        </Grid>
        <Grid item xs={6} px={1}>
          <Tag
            value="Tamamlandı"
            style={{
              backgroundColor: theme.palette.background.success,
              color: theme.palette.text.success,
            }}
          />
          {completed?.map((procedure) => (
            <Typography
              key={procedure.id}
              variant="body2"
              color={theme.palette.text.primary}
              my={1}
            >
              <strong>
                • {new Date(procedure.completedDate).toLocaleDateString()}
              </strong>{" "}
              - {procedure.procedure.name}
            </Typography>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );

  return (
    procedures && (
      <Tooltip
        title={tooltip}
        placement={props.tooltipReverse ? "top" : "bottom"}
        arrow
        componentsProps={{
          tooltip: {
            sx: {
              backgroundColor: theme.palette.background.primary,
              color: theme.palette.text.primary,
              maxWidth: 500,
            },
          },
        }}
        sx={{ cursor: "pointer" }}
      >
        <Grid container justifyContent="center">
          <CircleProgress
            completed={completed.length}
            total={procedures.length}
            style={{
              color: theme.palette.text.secondary,
              bgColor: theme.palette.background.secondary,
            }}
          />
        </Grid>
      </Tooltip>
    )
  );
}

export default StatusBadge;
