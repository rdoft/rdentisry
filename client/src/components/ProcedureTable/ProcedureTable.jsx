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
import ActionGroup from "components/ActionGroup/ActionGroup";

// services
import { ProcedureService, ProcedureCategoryService } from "services";

function ProcedureTable({}) {
  const navigate = useNavigate();
  const dt = useRef(null);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [rowIndex, setRowIndex] = useState(null);
  const [categories, setCategories] = useState(null);
  const [procedure, setProcedure] = useState(null);
  const [procedures, setProcedures] = useState(null);
  const [selectedProcedures, setSelectedProcedures] = useState(null);
  const [procedureDialog, setProcedureDialog] = useState(false);
  const [deleteProcedureDialog, setDeleteProcedureDialog] = useState(false);
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

  // Delete the procedure
  const deleteProcedure = async () => {
    let _selectedProcedures;

    try {
      await ProcedureService.deleteProcedure(procedure.id);

      _selectedProcedures = selectedProcedures
        ? selectedProcedures.filter((item) => item.id !== procedure.id)
        : null;
      // Set the updated list of procedures and the selected procedures
      getProcedures();
      setSelectedProcedures(_selectedProcedures);
      setProcedure(null);
    } catch (error) {
      const { code, message } = errorHandler(error);
      code === 401 ? navigate(`/login`) : toast.error(message);
    }
  };

  // Delete the selected procedures
  const deleteProcedures = async () => {
    let selectedIds;

    // Get IDs of the selected procedures
    selectedIds = selectedProcedures.map((item) => item.id);

    try {
      // Delete the procedures
      await ProcedureService.deleteProcedures(selectedIds);

      if (selectedIds.length > 1) {
        toast.success("Seçili tedaviler başarıyla silindi");
      } else {
        toast.success("Seçili tedavi başarıyla silindi");
      }

      // Get and set the updated list of procedures
      getProcedures();
      setSelectedProcedures(null);
    } catch (error) {
      const { code, message } = errorHandler(error);
      code === 401 ? navigate(`/login`) : toast.error(message);
    }
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

  // onDelete handler for confirm delete procedures dialog
  const handleDeleteProceduresConfirm = () => {
    deleteProcedures(selectedProcedures);
    hideDeleteProceduresDialog();
  };

  // Show confirm delete procedure dialog
  const showDeleteProcedureDialog = (procedure) => {
    setProcedure({ ...procedure });
    setDeleteProcedureDialog(true);
  };

  // Hide confirm delete procedure dialog
  const hideDeleteProcedureDialog = () => {
    setDeleteProcedureDialog(false);
  };

  // onDelete handler for confirm delete procedure dialog
  const handleDeleteProcedureConfirm = () => {
    deleteProcedure();
    hideDeleteProcedureDialog();
  };

  // onInput handler for search
  const handleInputSearch = (event) => {
    setTimeout(() => setGlobalFilter(event.target.value), 400);
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

  // TEMPLATES -----------------------------------------------------------------
  const deleteProcedureDialogTemplate = (
    <ConfirmDialog
      visible={deleteProcedureDialog}
      onHide={hideDeleteProcedureDialog}
      message=<Typography variant="body1">
        <strong>{procedure?.name}</strong> tedavisini silmek istediğinize emin
        misiniz?
      </Typography>
      header="Tedavi Sil"
      footer=<DialogFooter
        onHide={hideDeleteProcedureDialog}
        onDelete={handleDeleteProcedureConfirm}
      />
    />
  );

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
          onRowMouseEnter={handleRowMouseEnter}
          onRowMouseLeave={handleRowMouseLeave}
          selectionMode="checkbox"
          responsiveLayout="scroll"
          dataKey="id"
          paginator
          rows={10}
          rowHover={true}
          sortField="code"
          size="small"
          dragSelection={true}
          currentPageReportTemplate="({totalRecords} tedavi)"
          emptyMessage="Hiçbir sonuç bulunamadı"
        >
          {/* Checkbox */}
          <Column
            selectionMode="multiple"
            headerStyle={{ width: "3rem" }}
            bodyStyle={{ height: "4.5rem" }}
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
          {/* Procedure action buttons */}
          <Column
            body={(procedure) =>
              procedure.id === rowIndex ? (
                <ActionGroup
                  onClickDelete={() => showDeleteProcedureDialog(procedure)}
                />
              ) : null
            }
            style={{ width: "8rem" }}
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

      {/* Confirm delete procedure dialog */}
      {deleteProcedureDialogTemplate}

      {/* Confirm delete procedures dialog */}
      {deleteProceduresDialogTemplate}
    </div>
  );
}

export default ProcedureTable;
