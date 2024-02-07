import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { errorHandler } from "utils/errorHandler";
import { DataTable, Column, ConfirmDialog } from "primereact";
import { Typography } from "@mui/material";
import PriceColumn from "components/ProcedureTable/PriceColumn";
import CategoryColumn from "components/ProcedureTable/CategoryColumn";
import NameColumn from "components/ProcedureTable/NameColumn";
import ProcedureTableToolbar from "components/ProcedureTable/ProcedureTableToolbar";
import DialogFooter from "components/DialogFooter/DialogFooter";

// services
import { ProcedureService, ProcedureCategoryService } from "services";

function ProcedureTable({}) {
  const navigate = useNavigate();
  const dt = useRef(null);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [categories, setCategories] = useState(null);
  const [procedures, setProcedures] = useState(null);
  const [selectedProcedures, setSelectedProcedures] = useState(null);
  const [procedureDialog, setProcedureDialog] = useState(false);
  const [deleteProceduresDialog, setDeleteProceduresDialog] = useState(false);

  // Set the page on loading
  useEffect(() => {
    getProcedures();
    getProcedureCategories();
  }, []);

  // SERVICES ---------------------------------------------------------
  // Get the list of the procedures
  const getProcedures = async () => {
    let response;
    let procedures;

    try {
      response = await ProcedureService.getProcedures();
      procedures = response.data;

      setProcedures(procedures);
    } catch (error) {
      const { code, message } = errorHandler(error);
      code === 401 ? navigate(`/login`) : toast.error(message);
    }
  };

  // Save the procedure
  const saveProcedure = async (procedure) => {
    try {
      // Update or create the procedure
      if (procedure.id) {
        await ProcedureService.updateProcedure(procedure);
      } else {
        await ProcedureService.saveProcedure(procedure);
      }

      // Get and set the updated list of procedures
      getProcedures();
    } catch (error) {
      const { code, message } = errorHandler(error);
      code === 401 ? navigate(`/login`) : toast.error(message);
    }
  };

  // Get the list of the procedure categories
  const getProcedureCategories = async () => {
    let response;
    let categories;

    try {
      response = await ProcedureCategoryService.getProcedureCategories();
      categories = response.data;

      // Add the default category and set the list of categories
      categories = [...categories, { id: null, title: null }];
      setCategories(categories);
    } catch (error) {
      const { code, message } = errorHandler(error);
      code === 401 ? navigate(`/login`) : toast.error(message);
    }
  };

  // Delete the selected procedures
  const deleteProcedures = async () => {
    // TODO: Implement deleteProcedures
  };

  // HANDLERS -----------------------------------------------------------------
  // Show add procedure dialog
  const showProcedureDialog = () => {
    setProcedureDialog(true);
  };

  // Hide add procedure dialog
  const hideProcedureDialog = () => {
    setProcedureDialog(false);
  };

  // Show confirm delete procedures dialog
  const showDeleteProceduresDialog = () => {
    setDeleteProceduresDialog(true);
  };

  // Hide confirm delete procedures dialog
  const hideDeleteProceduresDialog = () => {
    setDeleteProceduresDialog(false);
  };

  // onInput handler for search
  const handleInputSearch = (event) => {
    setTimeout(() => setGlobalFilter(event.target.value), 400);
  };

  // onSelectedChange handler
  const handleChangeSelection = (event) => {
    setSelectedProcedures(event.value);
  };

  // onDelete handler for confirm delete procedures dialog
  const handleDeleteProceduresConfirm = () => {
    deleteProcedures(selectedProcedures);
    hideDeleteProceduresDialog();
  };

  // TEMPLATES -----------------------------------------------------------------
  const deleteProceduresDialogTemplate = (
    <ConfirmDialog
      visible={deleteProceduresDialog}
      onHide={hideDeleteProceduresDialog}
      message=<Typography variant="body1">
        <strong>{selectedProcedures?.length || 0}</strong> adet tedaviyi silmek
        istediğinize emin misiniz?
      </Typography>
      header="Tedavileri Sil"
      footer=<DialogFooter
        onHide={hideDeleteProceduresDialog}
        onDelete={handleDeleteProceduresConfirm}
      />
    />
  );

  return (
    <div className="datatable-crud">
      <div className="card">
        {/* Procedure table toolbar */}
        <ProcedureTableToolbar
          visibleDelete={selectedProcedures?.length ? true : false}
          onClickAdd={showProcedureDialog}
          onClickDelete={showDeleteProceduresDialog}
          onInput={handleInputSearch}
        />

        <DataTable
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
          ref={dt}
          value={procedures}
          globalFilter={globalFilter}
          selection={selectedProcedures}
          onSelectionChange={handleChangeSelection}
          selectionMode="checkbox"
          responsiveLayout="scroll"
          dataKey="id"
          paginator
          rows={10}
          currentPageReportTemplate="({totalRecords} tedavi)"
          rowHover={true}
          sortField="code"
          size="small"
          dragSelection={true}
        >
          {/* Checkbox */}
          <Column
            selectionMode="multiple"
            headerStyle={{ width: "3rem" }}
            exportable={false}
          ></Column>
          {/* Code */}
          <Column
            header="Kod"
            field="code"
            sortable
            style={{ width: "12rem" }}
          ></Column>
          {/* Name */}
          <Column
            header="Ad"
            field="name"
            sortable
            body={(procedure) => (
              <NameColumn procedure={procedure} onSubmit={saveProcedure} />
            )}
          ></Column>
          {/* Price */}
          <Column
            header="Fiyat"
            style={{ width: "18rem" }}
            sortable
            field="price"
            body={(procedure) => (
              <PriceColumn procedure={procedure} onSubmit={saveProcedure} />
            )}
          ></Column>
          {/* Category */}
          <Column
            header="Kategori"
            style={{ width: "16rem" }}
            sortable
            field="procedureCategory.title"
            body={(procedure) => (
              <CategoryColumn
                procedure={procedure}
                categories={categories}
                onSubmit={saveProcedure}
              />
            )}
          ></Column>
        </DataTable>
      </div>

      {/* Add procedure dialog */}
      {procedureDialog &&
        {
          /* <ProcedureDialog
          onHide={hideProcedureDialog}
          onSubmit={saveProcedure}
          categories={categories}
        /> */
        }}

      {/* Confirm delete procedures dialog */}
      {deleteProceduresDialogTemplate}
    </div>
  );
}

export default ProcedureTable;