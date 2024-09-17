import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// material-ui
import { useTheme } from "@mui/material/styles";
import { Box, Toolbar, useMediaQuery } from "@mui/material";

// project import
import navigation from "menu-items";
import Drawer from "./Drawer/Drawer";
import ToggleDrawer from "./ToggleDrawer/ToggleDrawer";
import Breadcrumbs from "components/@extended/Breadcrumbs";

// types
import { openDrawer } from "store/reducers/menu";

// ==============================|| MAIN LAYOUT ||============================== //

const MainLayout = () => {
  const theme = useTheme();
  const matchDownLG = useMediaQuery(theme.breakpoints.down("xl"));
  const matchDownMD = useMediaQuery(theme.breakpoints.down("lg"));

  const dispatch = useDispatch();

  const { drawerOpen } = useSelector((state) => state.menu);

  // drawer toggler
  const [open, setOpen] = useState(drawerOpen);
  const handleDrawerToggle = () => {
    setOpen(!open);
    dispatch(openDrawer({ drawerOpen: !open }));
  };

  // set media wise responsive drawer
  useEffect(() => {
    setOpen(!matchDownLG);
    dispatch(openDrawer({ drawerOpen: !matchDownLG }));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matchDownLG]);

  useEffect(() => {
    if (open !== drawerOpen) setOpen(drawerOpen);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drawerOpen]);

  return (
    <>
      <Box sx={{ display: "flex", width: "100%", height: "100%" }}>
        <ToggleDrawer open={open} handleDrawerToggle={handleDrawerToggle} />
        <Drawer open={open} handleDrawerToggle={handleDrawerToggle} />
        <Box
          component="main"
          sx={{
            width: "100%",
            flexGrow: 1,
            p: { xs: 2, sm: 3 },
            height: "calc(100% - 60px)",
          }}
        >
          {matchDownMD && <Toolbar sx={{ minHeight: "45px" }} />}
          <Breadcrumbs
            navigation={navigation}
            title
            titleBottom
            card={false}
            divider={false}
          />
          <Outlet />
        </Box>
      </Box>
    </>
  );
};

export default MainLayout;
