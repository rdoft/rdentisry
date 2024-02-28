import React from "react";
import { ProcedureCategory } from "components/ProcedureCategory";

function DropdownProcedureCategoryItem({ option }) {
  return <ProcedureCategory category={option?.title} />;
}

export default DropdownProcedureCategoryItem;
