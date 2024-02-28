import React from "react";
import { Typography, Grid } from "@mui/material";
import { ProcedureCategory } from "components/ProcedureCategory";

function DropdownProcedureItem({ option, isValue }) {
  return option ? (
    <div className="w-full p-link flex align-items-center">
      {/* Avatar icon */}
      <ProcedureCategory
        category={option.procedureCategory.title}
        isLabel={false}
      />

      {/* Name and Code */}
      <div className="flex flex-column align mr-3">
        <Typography variant="h5">{option.name}</Typography>
        <Typography variant="body2">{option.code}</Typography>
      </div>

      {/* Price */}
      {!isValue && (
        <div className="flex flex-column align ml-auto">
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
        </div>
      )}
    </div>
  ) : (
    // Placeholder
    <div className="flex flex-column align">
      <span>Tedavi seçiniz...</span>
    </div>
  );
}

export default DropdownProcedureItem;
