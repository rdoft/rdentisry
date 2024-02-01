import React from "react";
import { Button } from "primereact";

function ActionGroup({
  label,
  onClickEdit,
  onClickDelete,
  onClickAdd,
  onClickMore,
  custom,
}) {
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
          icon="pi pi-pencil"
          severity="secondary"
          onClick={onClickEdit}
        />
      )}
      {onClickDelete && (
        <Button
          text
          outlined
          size="small"
          icon="pi pi-trash"
          severity="danger"
          onClick={onClickDelete}
        />
      )}
      {onClickMore && (
        <Button
          className="bg-bluegray-50 hover:bg-bluegray-100 border-0 text-bluegray-900"
          size="small"
          icon="pi pi-ellipsis-h"
          severity="secondary"
          onClick={onClickMore}
        />
      )}
      {custom && custom}
    </React.Fragment>
  );
}

export default ActionGroup;
