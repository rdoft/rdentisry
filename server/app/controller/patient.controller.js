const db = require("../models");
const Patient = db.patient;

// Get patient list
exports.getPatients = async (req, res) => {
  let patients;
  
  try {
    // Find patient list
    patients = await Patient.findAll();
    
    res.status(200).send(patients);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
};
