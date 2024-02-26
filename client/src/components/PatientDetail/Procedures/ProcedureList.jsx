import React from "react";
import { DataScroller, Fieldset, ScrollPanel } from "primereact";
import { CardTitle } from "components/cards";
import NotFoundText from "components/NotFoundText";
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
        procedures[selectedTooth] ? (
          <DataScroller
            value={procedures[selectedTooth]}
            itemTemplate={procedureTemplate}
            rows={1000}
          ></DataScroller>
        ) : (
          <NotFoundText text="Tedavi yok" p={3} />
        )
      ) : Object.keys(procedures).length > 0 ? (
        Object.entries(procedures).map(([tooth, items]) => (
          <>
            <CardTitle key={tooth}>
              {tooth === "0" ? `Genel` : `Diş ${tooth}`}
            </CardTitle>
            <Fieldset
              key={tooth}
              className="mb-2"
              style={{ fontSize: "smaller" }}
            >
              <DataScroller
                value={items}
                itemTemplate={procedureTemplate}
                rows={1000}
              ></DataScroller>
            </Fieldset>
          </>
        ))
      ) : (
        <NotFoundText text="Tedavi yok" p={3} />
      )}
    </ScrollPanel>
  );
}

export default ProcedureList;
