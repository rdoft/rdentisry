import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { PatientService } from "services/index";
import { toast } from "react-hot-toast";
import CustomizedTabs from "components/CustomizedTabs";
import InfoCard from "./components/InfoCard";

const tabNames = ["Tümü", "Randevular", "Ödemeler", "Notlar", "Dokümanlar"];
const contentArray = ["Tümü", "Randevular", "Ödemeler", "Notlar", "Dokümanlar"];

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
        height: "100%",
        gap: "10px",
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "30%",
          height: "100%",
          gap: "10px",
        }}
      >
        <InfoCard patient={patient} />
        <div
          style={{
            height: "100%",
            width: "100%",
            border: "1px solid black",
            borderRadius: "5px",
            padding: "10px",
          }}
        ></div>
      </div>
      <div
        style={{
          height: "100%",
          width: "70%",
          border: "1px solid black",
          borderRadius: "5px",
          padding: "10px",
        }}
      >
        <CustomizedTabs tabNames={tabNames} contentArray={contentArray} />
      </div>
    </div>
  );
};

export default PatientPage;
