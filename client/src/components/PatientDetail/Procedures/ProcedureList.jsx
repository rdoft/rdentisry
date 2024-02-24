import React from "react";
import { DataScroller, Fieldset, ScrollPanel } from "primereact";
import ProcedureCard from "./ProcedureCard";

function ProcedureList({
  patient,
  selectedTooth,
  procedures,
  onSubmit,
  onDelete,
}) {
  // TEMPLATES ----------------------------------------------------------------
  const procedureTemplate = (procedure) => {
    if (!procedure) {
      return;
    }

    return (
      <ProcedureCard
        procedure={{ ...procedure, patient }}
        onSubmit={onSubmit}
        onDelete={onDelete}
      />
    );
  };

  return (
    <ScrollPanel style={{ width: "100%", height: "23vw" }}>
      {selectedTooth ? (
        <DataScroller
          value={procedures[selectedTooth]}
          itemTemplate={procedureTemplate}
          rows={1000}
        ></DataScroller>
      ) : (
        Object.entries(procedures).map(([tooth, items]) => (
          <Fieldset
            key={tooth}
            className="mb-2"
            legend={tooth == 0 ? `Genel` : `Diş ${tooth}`}
            toggleable
            style={{ fontSize: "smaller" }}
          >
            <DataScroller
              value={items}
              itemTemplate={procedureTemplate}
              rows={1000}
            ></DataScroller>
          </Fieldset>
        ))
      )}
    </ScrollPanel>
  );
}

export default ProcedureList;
