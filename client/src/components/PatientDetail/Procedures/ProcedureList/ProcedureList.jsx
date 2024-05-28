import React, { useRef, useState } from "react";
import { DataTable, Column, ConfirmDialog } from "primereact";
import { Grid, Typography } from "@mui/material";
import { Delete } from "components/Button";
import { DialogFooter } from "components/DialogFooter";
import { ProcedureCategory } from "components/ProcedureCategory";
import PriceColumn from "../PriceColumn";
import StatusColumn from "../StatusColumn";
import ProcedureListHeader from "./ProcedureListHeader";

// assets
import "assets/styles/PatientDetail/ProceduresTab.css";

function ProcedureList({
  patient,
  procedures,
  selectedTooth,
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
        item.invoice.id === curr.invoice.id &&
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

  // Calculate the total price of the invoice
  const calcInvoiceTotal = (invoiceId) => {
    let total = 0;

    for (let procedure of procedures) {
      if (procedure.invoice.id === invoiceId) {
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
        patient: patient,
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
    onDelete(procedure);
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
        className="invoice-header"
        style={{
          padding: "0.75rem 0.2rem",
        }}
      >
        <ProcedureListHeader
          initInvoice={{
            ...procedure.invoice,
          }}
          total={calcInvoiceTotal(procedure.invoice.id)}
          patient={patient}
          onUpdated={onUpdated}
        />
      </Grid>
    );
  };

  const name = (procedure) => {
    return (
      <div className="flex align-items-center gap-2">
        <ProcedureCategory
          category={procedure.procedure.procedureCategory.title}
          isLabel={false}
        />
        <span>{procedure.procedure.name}</span>
      </div>
    );
  };

  return (
    <>
      <DataTable
        ref={dt}
        value={combinedProcedures}
        selection={selectedProcedures}
        onSelectionChange={handleChangeSelection}
        onRowMouseEnter={handleRowMouseEnter}
        onRowMouseLeave={handleRowMouseLeave}
        selectionMode="checkbox"
        responsiveLayout="scroll"
        dataKey="id"
        rowGroupMode="subheader"
        groupRowsBy="invoice.id"
        sortField="invoice.id"
        sortMode="single"
        sortOrder={-1}
        scrollable
        size="small"
        // scrollHeight="50vh"
        rowGroupHeaderTemplate={header}
        emptyMessage="Hiçbir işlem bulunamadı"
      >
        {/* Checkbox */}
        <Column selectionMode="multiple" exportable={false}></Column>
        {/* Tooth Number */}
        <Column
          field="toothNumber"
          header="Dişler"
          style={{ width: "8rem" }}
          body={(procedure) => procedure.toothNumber.join(", ")}
        ></Column>
        {/* Status */}
        <Column
          field="status"
          header="Durum"
          style={{ width: "10rem" }}
          body={(procedure) => (
            <StatusColumn procedure={procedure} onSubmit={handleSubmit} />
          )}
        ></Column>
        {/* Name and Category */}
        <Column
          field="procedure.name"
          header="İşlem"
          style={{ minWidth: "25rem" }}
          body={(procedure) => name(procedure)}
        ></Column>
        {/* Price */}
        <Column
          field="price"
          header="Ücret"
          style={{ width: "15rem", minWidth: "15rem" }}
          body={(procedure) => (
            <PriceColumn procedure={procedure} onSubmit={handleSubmit} />
          )}
        ></Column>
        {/* Procedure action buttons */}
        <Column
          body={(procedure) =>
            procedure.id === rowIndex ? (
              <Delete onClick={() => handleDelete(procedure)} />
            ) : null
          }
          style={{ width: "4rem" }}
        ></Column>
      </DataTable>

      {/* Confirm delete procedure dialog */}
      {deleteDialog}
    </>
  );
}

export default ProcedureList;
