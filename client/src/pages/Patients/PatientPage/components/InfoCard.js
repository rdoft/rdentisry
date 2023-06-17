import Line from "components/Line";

const InfoCard = ({ patient }) => {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "5px",
          width: "100%%",
          border: "1px solid black",
          borderRadius: "5px",
          padding: "10px",
        }}
      >
        <Line title={"İsim"} data={`${patient?.name} ${patient?.surname}`} />
        <Line title={"TC No"} data={patient?.idNumber} />
        <Line title={"Telefon"} data={patient?.phone} />
        <Line title={"Doğum Yılı"} data={patient?.birthYear} />
        <div
          style={{
            width: "100%",
            display: "flex",
            gap: "10px",
            marginTop: "20px",
          }}
        >
          <div
            style={{
              width: "100%",
              border: "1px solid black",
              borderRadius: "5px",
              padding: "10px",
            }}
          >
            <Line title={"Toplam"} />
          </div>
          <div
            style={{
              width: "100%",
              border: "1px solid black",
              borderRadius: "5px",
              padding: "10px",
            }}
          >
            <Line title={"Ödenen"} />
          </div>
          <div
            style={{
              width: "100%",
              border: "1px solid black",
              borderRadius: "5px",
              padding: "10px",
            }}
          >
            <Line title={"Kalan"} />
          </div>
        </div>
      </div>
    );
  };

  export default InfoCard