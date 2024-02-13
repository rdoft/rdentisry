import React from "react";
import { Typography, Grid } from "@mui/material";
import { ProcedureCategory } from "components/ProcedureCategory";

function DropdownProcedureItem({ option, isValue }) {
  if (!option) {
    return (
      // Placeholder
      <div className="flex flex-column align">
        <span>Tedavi seçiniz...</span>
      </div>
    );
  }

  // TEMPLATE -----------------------------------------------------------------
  // Set category of the procedure
  const category = (
    <ProcedureCategory
      category={option.procedureCategory.title}
      isLabel={false}
    />
  );

  // Set name of procedure
  const name = <Typography variant="h5">{option.name}</Typography>;

  // Set code of procedure
  const code = <Typography variant="body2">{option.code}</Typography>;

  // Set price of procedure
  const price = (
    <Grid>
      <Typography variant="caption" fontWeight="light">
        ₺{" "}
      </Typography>
      <Typography variant="caption" fontWeight="bolder">
        {option.price.toLocaleString("tr-TR", {
          style: "decimal",
          maximumFractionDigits: 2,
        })}
      </Typography>
    </Grid>
  );

  return (
    <div className="w-full p-link flex align-items-center">
      {/* Avatar icon */}
      {category}
      {/* Option info */}
      <div className="flex flex-column align mr-3">
        {name}
        {code}
      </div>
      {!isValue && (
        <div className="flex flex-column align ml-auto">{price}</div>
      )}
    </div>
  );
}

export default DropdownProcedureItem;
