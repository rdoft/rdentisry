import PropTypes from "prop-types";
import { useSelector } from "react-redux";

// material-ui
import { Box, List, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

// project import
import NavItem from "./NavItem";

// ==============================|| NAVIGATION - LIST GROUP ||============================== //

const NavGroup = ({ item }) => {
  const theme = useTheme();

  const menu = useSelector((state) => state.menu);
  const { drawerOpen } = menu;

  const navCollapse = item.children?.map((menuItem) => {
    switch (menuItem.type) {
      case "collapse":
        return (
          <Typography
            key={menuItem.id}
            variant="caption"
            color="error"
            sx={{ p: 2.5 }}
          >
            collapse - only available in paid version
          </Typography>
        );
      case "item":
        return <NavItem key={menuItem.id} item={menuItem} level={1} />;
      default:
        return (
          <Typography
            key={menuItem.id}
            variant="h6"
            color="error"
            align="center"
          >
            Fix - Group Collapse or Items
          </Typography>
        );
    }
  });

  return (
    <List
      subheader={
        item.title &&
        drawerOpen && (
          <Box sx={{ pl: 3, mb: 1.5 }}>
            <Typography
              variant="subtitle2"
              color={theme.palette.text.primary}
              style={{ opacity: "0.5" }}
            >
              {item.title}
            </Typography>
            {/* only available in paid version */}
          </Box>
        )
      }
      sx={{ mb: drawerOpen ? 1.5 : 0, py: 0, zIndex: 0 }}
    >
      {navCollapse}
    </List>
  );
};

NavGroup.propTypes = {
  item: PropTypes.object,
};

export default NavGroup;
