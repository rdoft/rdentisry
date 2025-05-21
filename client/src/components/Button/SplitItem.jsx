import React, { useRef, useState } from "react";
import { Grid, Tooltip } from "@mui/material";
import { Menu } from "primereact/menu";
import BaseButton from "./BaseButton";

function SplitItem({
  label,
  options,
  onClick,
  tooltip,
  severity = "primary",
  ...props
}) {
  const menu = useRef(null);
  const [showMenu, setShowMenu] = useState(false);

  const handleMainClick = (e) => {
    onClick && onClick(e);
  };

  const handleToggleMenu = (e) => {
    e.stopPropagation();
    menu.current.toggle(e);
    setShowMenu(!showMenu);
  };

  return (
    <Tooltip title={tooltip} placement="bottom" enterDelay={500}>
      <Grid
        item
        xs="auto"
        style={{ display: "inline-flex", alignItems: "center" }}
      >
        <BaseButton
          icon="pi pi-plus"
          label={label}
          onClick={handleMainClick}
          variant="outlined"
          severity={severity}
          disabled={props?.disabled}
          {...props}
        />
        <BaseButton
          icon="pi pi-chevron-down"
          onClick={handleToggleMenu}
          variant="text"
          size="small"
          severity={severity}
          disabled={props?.disabled}
        />
        <Menu
          model={options}
          popup
          ref={menu}
          onHide={() => setShowMenu(false)}
        />
      </Grid>
    </Tooltip>
  );
}

export default SplitItem;
