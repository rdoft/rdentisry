import React from "react";
import { Button } from "primereact";

function ActionGroup({ onClickEdit, onClickDelete, onClickAdd, label }) {
  return (
    <React.Fragment>
      {onClickAdd && (
        <Button
          text
          outlined
          size="small"
          icon="pi pi-plus"
          severity="secondary"
          label={label}
          onClick={onClickAdd}
        />
      )}
      {onClickEdit && (
        <Button
          text
          outlined
          size="small"
          severity="secondary"
          icon="pi pi-pencil"
          onClick={onClickEdit}
        />
      )}
      {onClickDelete && (
        <Button
          text
          outlined
          size="small"
          severity="danger"
          icon="pi pi-trash"
          onClick={onClickDelete}
        />
      )}
    </React.Fragment>
  );
}

export default ActionGroup;
