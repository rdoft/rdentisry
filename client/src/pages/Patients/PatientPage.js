import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PatientService } from "services/index";
import { toast } from "react-hot-toast";
import Line from "components/Line";

const PatientPage = () => {
  const [patient, setPatient] = useState(null);
  const query = useParams();

  const { id } = query;

  useEffect(() => {
    (async () => {
      try {
        const response = await PatientService.getPatient(id);

        setPatient(response.data);
      } catch (error) {
        toast.error(error.response.data.message);
      }
    })();
  }, [id]);

  return (
    <div
      style={{
        display: "flex",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "5px", width: '100%' }}>
            <Line minWidth={'400px'} title={'İsim'} data={`${patient?.name} ${patient?.surname}`} />
            <Line minWidth={'400px'} title={'TC No'} data={patient?.idNumber} />
            <Line minWidth={'400px'} title={'Telefon'} data={patient?.phone} />
            <Line minWidth={'400px'} title={'Doğum Yılı'} data={patient?.birthYear} />
        </div>
      </div>
    </div>
  );
};

export default PatientPage;
