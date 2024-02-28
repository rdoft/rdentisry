import React, { useState } from "react";
import { Divider, ConfirmDialog } from "primereact";
import { Grid, Typography } from "@mui/material";
import { ProcedureCategory } from "components/ProcedureCategory";
import { DialogFooter } from "components/DialogFooter";
import { Delete } from "components/Button";
import PriceColumn from "./PriceColumn";
import StatusColumn from "./StatusColumn";

function ProcedureCard({ procedure, onDelete, onSubmit }) {
  const [isHover, setIsHover] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  // HANDLERS -----------------------------------------------------------------
  // onMouseEnter handler for display buttons
  const handleMouseEnter = () => {
    setIsHover(true);
  };

  // onMouseLeave handler for hide buttons
  const handleMouseLeave = () => {
    setIsHover(false);
  };

  // onDelete handler
  const handleDelete = () => {
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

  // TEMPLATES -----------------------------------------------------------------
  // Delete confirm dialog
  const deleteDialog = (
    <ConfirmDialog
      visible={isDelete}
      onHide={handleDeleteHide}
      message=<Typography variant="body1">
        <strong>
          {procedure.procedure.name.length > 40
            ? `${procedure.procedure.name.substring(0, 40)}...`
            : procedure.procedure.name}
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

  return (
    <>
      {/* Card */}
      <Grid
        container
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        sx={{ minHeight: "4rem" }}
        alignItems="center"
      >
        {/* Name */}
        <Grid item xs={7} lg={6} pr={3}>
          <Typography variant="h5" fontWeight="light">
            {procedure.procedure.name}
          </Typography>
        </Grid>

        {/* Category */}
        <Grid item lg={1} display={{ xs: "none", lg: "block" }}>
          <ProcedureCategory
            category={procedure.procedure.procedureCategory.title}
            isLabel={false}
          />
        </Grid>

        {/* Price */}
        <Grid item xs={isEdit ? 4 : 2} lg={isEdit ? 4 : 2} m={isEdit ? 2 : 0}>
          <PriceColumn
            procedure={procedure}
            onSubmit={onSubmit}
            isEdit={isEdit}
            setIsEdit={setIsEdit}
          />
        </Grid>

        {!isEdit && (
          <>
            {/* Status */}
            <Grid container item xs={2} justifyContent="end">
              <StatusColumn procedure={procedure} onSubmit={onSubmit} />
            </Grid>

            {/* Delete button */}
            {(isHover || window.matchMedia("(hover: none)").matches) && (
              <Grid container item xs={1} justifyContent="end">
                <Delete onClick={handleDelete} />
              </Grid>
            )}
          </>
        )}
      </Grid>

      {/* Divider */}
      <Grid container>
        <Grid item xs={12}>
          <Divider style={{ margin: 0 }} />
        </Grid>
      </Grid>

      {/* Confirm delete dialog */}
      {deleteDialog}
    </>
  );
}

export default ProcedureCard;
