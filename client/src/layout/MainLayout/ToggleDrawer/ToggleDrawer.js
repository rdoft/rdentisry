import { useTheme } from "@mui/material/styles";
import { IconButton, useMediaQuery } from "@mui/material";

const ToggleDrawer = ({ open, handleDrawerToggle }) => {
  const theme = useTheme();
  const matchDownMD = useMediaQuery(theme.breakpoints.down("lg"));

  return (
    <IconButton
      disableRipple
      aria-label="open drawer"
      onClick={handleDrawerToggle}
      sx={{
        zIndex: 2000,
        position: "fixed",
        left: open ? "180px" : matchDownMD ? "15px" : "50px",
        top: "30px",
        padding: 1,
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.common.white,
        border: `1px solid`,
        borderColor: theme.palette.divider,
        borderRadius: "50%",
        "&:hover": {
          backgroundColor: theme.palette.text.secondary,
          color: theme.palette.common.white,
        },
        transition: theme.transitions.create(["left"], {
          easing: theme.transitions.easing.easeIn,
          duration: theme.transitions.duration.shortest,
        }),
      }}
    >
      {open ? (
        <i className="pi pi-angle-left" style={{ fontSize: "1rem" }} />
      ) : !matchDownMD ? (
        <i className="pi pi-angle-right" style={{ fontSize: "1rem" }} />
      ) : (
        <i className="pi pi-bars" style={{ fontSize: "1rem" }} />
      )}
    </IconButton>
  );
};

export default ToggleDrawer;
