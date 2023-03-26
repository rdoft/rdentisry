import React from "react";
import { Button } from "primereact";

function ActionGroup({ onClickEdit, onClickDelete, onClickAdd, label }) {
  return (
    <React.Fragment>
      {onClickAdd && (
        <Button
          text
          outlined
          size="sm"
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
          size="sm"
          icon="pi pi-pencil"
          severity="secondary"
          onClick={onClickEdit}
        />
      )}
      {onClickDelete && (
        <Button
          text
          outlined
          size="sm"
          icon="pi pi-trash"
          severity="danger"
          onClick={onClickDelete}
        />
      )}
    </React.Fragment>
  );
}

export default ActionGroup;
