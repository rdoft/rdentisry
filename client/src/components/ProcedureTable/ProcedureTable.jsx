import React, { useRef, useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Typography } from "@mui/material";
import { DataTable, Column, ConfirmDialog } from "primereact";
import { BaseProcedureDialog } from "components/Dialog";
import { DialogFooter } from "components/DialogFooter";
import { Delete } from "components/Button";
import { useLoading } from "context/LoadingProvider";
import { LoadingController } from "components/Loadable";
import { SkeletonDataTable } from "components/Skeleton";
import { SubscriptionController } from "components/Subscription";
import PriceColumn from "./PriceColumn";
import CategoryColumn from "./CategoryColumn";
import NameColumn from "./NameColumn";
import ProcedureTableToolbar from "./ProcedureTableToolbar";

// services
import { ProcedureService, ProcedureCategoryService } from "services";

function ProcedureTable() {
  const { startLoading, stopLoading } = useLoading();

  // Set the default valeus
  const dt = useRef(null);
  const [categories, setCategories] = useState(null);
  const [procedure, setProcedure] = useState(null);
  const [procedures, setProcedures] = useState(null);
  const [selectedProcedures, setSelectedProcedures] = useState(null);
  const [rowIndex, setRowIndex] = useState(null);
  const [globalFilter, setGlobalFilter] = useState(null);
  const [dialogs, setDialogs] = useState({
    procedure: false,
    deleteProcedure: false,
    deleteProcedures: false,
  });

  // Set the page on loading
  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    startLoading("ProcedureTable");
    // Get the list of the procedures
    ProcedureService.getProcedures(null, { signal })
      .then((res) => {
        setProcedures(res.data);
      })
      .catch((error) => {
        error.message && toast.error(error.message);
      })
      .finally(() => stopLoading("ProcedureTable"));

    // Get the list of the procedure categories
    ProcedureCategoryService.getProcedureCategories({ signal })
      .then((res) => {
        setCategories([...res.data, { id: null, title: null }]);
      })
      .catch((error) => {
        error.message && toast.error(error.message);
      });

    return () => {
      controller.abort();
    };
  }, [startLoading, stopLoading]);

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
      error.message && toast.error(error.message);
    }
  };

  // Save the procedure
  const saveProcedure = async (procedure) => {
    try {
      startLoading("save");
      // Update or create the procedure
      if (procedure.id) {
        await ProcedureService.updateProcedure(procedure);
      } else {
        await ProcedureService.saveProcedure(procedure);
      }

      // Get and set the updated list of procedures
      await getProcedures();
    } catch (error) {
      error.message && toast.error(error.message);
    } finally {
      stopLoading("save");
    }
  };

  // Delete the procedure
  const deleteProcedure = async () => {
    let _selectedProcedures;

    try {
      startLoading("delete");
      await ProcedureService.deleteProcedure(procedure.id);

      _selectedProcedures = selectedProcedures
        ? selectedProcedures.filter((item) => item.id !== procedure.id)
        : null;
      // Set the updated list of procedures and the selected procedures
      await getProcedures();
      setSelectedProcedures(_selectedProcedures);
      setProcedure(null);
    } catch (error) {
      error.message && toast.error(error.message);
    } finally {
      stopLoading("delete");
    }

    hideDeleteProcedureDialog();
  };

  // Delete the selected procedures
  const deleteProcedures = async () => {
    let selectedIds;

    // Get IDs of the selected procedures
    selectedIds = selectedProcedures.map((item) => item.id);

    try {
      startLoading("delete");
      // Delete the procedures
      await ProcedureService.deleteProcedures(selectedIds);

      // Get and set the updated list of procedures
      await getProcedures();
      setSelectedProcedures(null);
    } catch (error) {
      error.message && toast.error(error.message);
    } finally {
      stopLoading("delete");
    }

    hideDeleteProceduresDialog();
  };

  // HANDLERS -----------------------------------------------------------------
  // Show add procedure dialog
  const showProcedureDialog = () => {
    setDialogs({ ...dialogs, procedure: true });
  };

  // Hide add procedure dialog
  const hideProcedureDialog = () => {
    setDialogs({ ...dialogs, procedure: false });
  };

  // Show confirm delete procedures dialog
  const showDeleteProceduresDialog = () => {
    setDialogs({ ...dialogs, deleteProcedures: true });
  };

  // Hide confirm delete procedures dialog
  const hideDeleteProceduresDialog = () => {
    setDialogs({ ...dialogs, deleteProcedures: false });
  };

  // onDelete handler for confirm delete procedures dialog
  const handleDeleteProceduresConfirm = () => {
    deleteProcedures(selectedProcedures);
  };

  // Show confirm delete procedure dialog
  const showDeleteProcedureDialog = (procedure) => {
    setProcedure(procedure);
    setDialogs({ ...dialogs, deleteProcedure: true });
  };

  // Hide confirm delete procedure dialog
  const hideDeleteProcedureDialog = () => {
    setDialogs({ ...dialogs, deleteProcedure: false });
  };

  // onDelete handler for confirm delete procedure dialog
  const handleDeleteProcedureConfirm = () => {
    deleteProcedure();
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
  const deleteProcedureDialog = (
    <ConfirmDialog
      visible={dialogs.deleteProcedure}
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

  const deleteProceduresDialog = (
    <ConfirmDialog
      visible={dialogs.deleteProcedures}
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
        <LoadingController
          name="ProcedureTable"
          skeleton={<SkeletonDataTable />}
        >
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
            filterLocale="tr-TR"
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
                  <SubscriptionController>
                    <Delete
                      onClick={() => showDeleteProcedureDialog(procedure)}
                    />
                  </SubscriptionController>
                ) : null
              }
              style={{ width: "8rem" }}
            ></Column>
          </DataTable>
        </LoadingController>
      </div>

      {/* Add procedure dialog */}
      {dialogs.procedure && (
        <BaseProcedureDialog
          onHide={hideProcedureDialog}
          onSubmit={saveProcedure}
          categories={categories}
        />
      )}

      {/* Confirm delete procedure dialog */}
      {deleteProcedureDialog}

      {/* Confirm delete procedures dialog */}
      {deleteProceduresDialog}
    </div>
  );
}

export default ProcedureTable;
