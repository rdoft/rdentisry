import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PatientService } from "services/index";

const PatientPage = () => {
  const [patient, setPatient] = useState(null);
  const query = useParams();

  const { id } = query;

  useEffect(() => {
    (async () => {
      const response = await PatientService.getPatient(id);

      setPatient(response);
    })();
  }, [id]);

  console.log(patient)

  return <div>PatientPage</div>;
};

export default PatientPage;
