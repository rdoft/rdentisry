import React from "react";
import { Tag } from "primereact";

function StatusColumn({ procedure, onSubmit }) {
  // HANDLERS -----------------------------------------------------------------
  // onChangeStatus handler
  const handleChange = () => {
    onSubmit({
      ...procedure,
      isComplete: !procedure.isComplete,
    });
  };

  return (
    <Tag
      value={procedure.isComplete ? "Tamamlandı" : "Bekleniyor"}
      style={
        procedure.isComplete
          ? { backgroundColor: "#DFFCF0", color: "#22A069", cursor: "pointer" }
          : { backgroundColor: "#E8F0FF", color: "#1E7AFC", cursor: "pointer" }
      }
      onClick={handleChange}
    />
  );
}

export default StatusColumn;
