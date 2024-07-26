import React, { useRef, useState } from "react";
import { DataTable, Column, ConfirmDialog } from "primereact";
import { Grid, Typography } from "@mui/material";
import { Delete } from "components/Button";
import { DialogFooter } from "components/DialogFooter";
import { ProcedureCategory } from "components/ProcedureCategory";
import { Tooth } from "components/Button";
import NotFoundText from "components/Text/NotFoundText";
import PriceColumn from "../PriceColumn";
import StatusColumn from "../StatusColumn";
import ProcedureListHeader from "./ProcedureListHeader";

// assets
import "assets/styles/PatientDetail/ProceduresTab.css";

function ProcedureList({
  patient,
  procedures,
  selectedProcedures,
  setSelectedProcedures,
  onSubmit,
  onDelete,
  onUpdated,
}) {
  const dt = useRef(null);
  const [procedure, setProcedure] = useState(null);
  const [rowIndex, setRowIndex] = useState(null);
  const [isDelete, setIsDelete] = useState(false);

  // FUNCTIONS ----------------------------------------------------------------
  // Combine duplicate rows
  const combinedProcedures = procedures.reduce((acc, curr) => {
    const existingProcedure = acc.find(
      (item) =>
        item.procedure.id === curr.procedure.id &&
        item.visit.id === curr.visit.id &&
        item.price === curr.price &&
        ((item.completedDate && curr.completedDate) ||
          (!item.completedDate && !curr.completedDate))
      // && !item.toothNumber.includes(curr.toothNumber) // This line is for unique tooth numbers
    );
    if (existingProcedure) {
      if (Array.isArray(existingProcedure.toothNumber)) {
        existingProcedure.toothNumber = [
          ...existingProcedure.toothNumber,
          curr.toothNumber,
        ];
        existingProcedure.ids = [...existingProcedure.ids, curr.id];
      } else {
        existingProcedure.toothNumber = [
          existingProcedure.toothNumber,
          curr.toothNumber,
        ];
        existingProcedure.ids = [existingProcedure.id, curr.id];
      }
    } else {
      acc.push({ ...curr, toothNumber: [curr.toothNumber], ids: [curr.id] });
    }
    return acc;
  }, []);

  // Calculate the total price of the visit
  const calcVisitTotal = (visitId) => {
    let total = 0;

    for (let procedure of procedures) {
      if (procedure.visit.id === visitId) {
        total += procedure.price;
      }
    }
    return total;
  };

  // HANDLERS -----------------------------------------------------------------
  // onSubmit handler for each procedure
  const handleSubmit = (procedure) => {
    const updatedProcedures = [];
    // Find the procedures that will be updated and update them
    for (let i = 0; i < procedure.ids.length; i++) {
      const found = procedures.find((item) => item.id === procedure.ids[i]);
      updatedProcedures.push({
        ...found,
        price: procedure.price,
        completedDate: procedure.completedDate,
      });
    }

    onSubmit(updatedProcedures);
  };

  // onDelete handler
  const handleDelete = (procedure) => {
    setProcedure(procedure);
    setIsDelete(true);
  };

  // onConfirmDelete handler
  const handleDeleteConfirm = () => {
    const deletedProcedures = [];
    // Find the procedures that will be deleted and delete them
    for (let i = 0; i < procedure.ids.length; i++) {
      const found = procedures.find((item) => item.id === procedure.ids[i]);
      deletedProcedures.push({
        ...found,
      });
    }

    onDelete(deletedProcedures);
    setIsDelete(false);
  };

  // onHideDelete handler
  const handleDeleteHide = () => {
    setIsDelete(false);
  };

  // onSelectedChange handler
  const handleChangeSelection = (event) => {
    setSelectedProcedures(event.value);
  };

  // onRowMouseEnter handler for display buttons
  const handleRowMouseEnter = (event) => {
    setRowIndex(event.data.id);
  };

  // onRowMouseLeave handler for hide buttons
  const handleRowMouseLeave = () => {
    setRowIndex(null);
  };

  const isRowSelectable = (event) =>
    event.data.visit.approvedDate ? false : true;

  // TEMPLATES ----------------------------------------------------------------
  // Delete confirm dialog
  const deleteDialog = (
    <ConfirmDialog
      visible={isDelete}
      onHide={handleDeleteHide}
      message=<Typography variant="body1">
        <strong>
          {procedure?.procedure.name.length > 40
            ? `${procedure?.procedure.name.substring(0, 40)}...`
            : procedure?.procedure.name}
        </strong>{" "}
        tedavisini silmek istediğinize emin misiniz?
      </Typography>
      header="Tedavi Sil"
      footer=<DialogFooter
        onHide={handleDeleteHide}
        onDelete={handleDeleteConfirm}
      />
    />
  );

  const header = (procedure) => {
    return (
      <Grid
        container
        style={{
          padding: "0.75rem 0.2rem",
        }}
      >
        <ProcedureListHeader
          initVisit={{
            ...procedure.visit,
          }}
          total={calcVisitTotal(procedure.visit.id)}
          patient={patient}
          onUpdated={onUpdated}
          setSelectedProcedures={setSelectedProcedures}
        />
      </Grid>
    );
  };

  const name = (procedure) => {
    return (
      <div className="flex align-items-center gap-2">
        <ProcedureCategory
          category={procedure.procedure.procedureCategory?.title}
          isLabel={false}
        />
        <span>{procedure.procedure.name}</span>
      </div>
    );
  };

  const teeth = (procedure) => {
    const occurrenceTracker = {};
    return (
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {procedure.toothNumber.sort().map((num) => {
          occurrenceTracker[num] = (occurrenceTracker[num] || 0) + 1;
          const uniqueKey = `${num}-${occurrenceTracker[num]}`;

          return (
            <Tooth key={uniqueKey} number={num} style={{ margin: "0.1rem" }} />
          );
        })}
      </div>
    );
  };

  return procedures?.length > 0 ? (
    <>
      <DataTable
        ref={dt}
        value={combinedProcedures}
        selection={selectedProcedures}
        onSelectionChange={handleChangeSelection}
        onRowMouseEnter={handleRowMouseEnter}
        onRowMouseLeave={handleRowMouseLeave}
        isDataSelectable={isRowSelectable}
        selectionMode="checkbox"
        responsiveLayout="scroll"
        dataKey="id"
        rowGroupMode="subheader"
        groupRowsBy="visit.id"
        sortField="visit.id"
        sortMode="single"
        sortOrder={-1}
        scrollable
        size="small"
        rowGroupHeaderTemplate={header}
        emptyMessage="Hiçbir işlem bulunamadı"
      >
        {/* Checkbox */}
        <Column
          selectionMode="multiple"
          bodyStyle={{ width: "2rem" }}
          exportable={false}
        ></Column>
        {/* Tooth Number */}
        <Column
          field="toothNumber"
          header="Dişler"
          style={{ maxWidth: "11rem" }}
          body={teeth}
        ></Column>
        {/* Status */}
        <Column
          field="status"
          header="Durum"
          style={{ width: "8rem" }}
          body={(procedure) => (
            <StatusColumn procedure={procedure} onSubmit={handleSubmit} />
          )}
        ></Column>
        {/* Name and Category */}
        <Column field="procedure.name" header="İşlem" body={name}></Column>
        {/* Price */}
        <Column
          field="price"
          header="Ücret"
          style={{ width: "12rem", minWidth: "12rem" }}
          body={(procedure) => (
            <PriceColumn procedure={procedure} onSubmit={handleSubmit} />
          )}
        ></Column>
        {/* Procedure action buttons */}
        <Column
          body={(procedure) =>
            procedure.id === rowIndex && !procedure.visit.approvedDate ? (
              <Delete onClick={() => handleDelete(procedure)} />
            ) : null
          }
          style={{ width: "4rem" }}
        ></Column>
      </DataTable>

      {/* Confirm delete procedure dialog */}
      {deleteDialog}
    </>
  ) : (
    <NotFoundText text="Tedavi yok" style={{ backgroundColor: "#F5F5F5" }} />
  );
}

export default ProcedureList;
