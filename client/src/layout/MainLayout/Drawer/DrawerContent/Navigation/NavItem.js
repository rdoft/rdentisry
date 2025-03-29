import PropTypes from "prop-types";
import { forwardRef } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

// material-ui
import { useTheme } from "@mui/material/styles";
import {
  Avatar,
  Chip,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";

// ==============================|| NAVIGATION - LIST ITEM ||============================== //

const NavItem = ({ item, level }) => {
  const theme = useTheme();
  const menu = useSelector((state) => state.menu);
  const { drawerOpen, openItem } = menu;

  let itemTarget = "_self";
  if (item.target) {
    itemTarget = "_blank";
  }

  let listItemProps = {
    component: forwardRef((props, ref) => (
      <Link ref={ref} {...props} to={item.url} target={itemTarget} />
    )),
  };
  if (item?.external) {
    listItemProps = { component: "a", href: item.url, target: itemTarget };
  }

  const isSelected = openItem.findIndex((id) => id === item.id) > -1;

  return (
    <ListItemButton
      {...listItemProps}
      disabled={item.disabled}
      selected={isSelected}
      sx={{
        zIndex: 1201,
        pl: drawerOpen ? level * 3 : 1.5,
        py: !drawerOpen && level === 1 ? 1.25 : 1,
        ...(drawerOpen && {
          "&:hover": {
            bgcolor: theme.palette.background.secondary,
            borderRadius: "10px",
          },
          "&.Mui-selected": {
            bgcolor: theme.palette.background.secondary,
            borderRight: `2px solid ${theme.palette.text.secondary}`,
            borderRadius: "10px",
            color: theme.palette.text.secondary,
            "&:hover": {
              color: theme.palette.text.secondary,
              bgcolor: theme.palette.background.secondary,
            },
          },
        }),
        ...(!drawerOpen && {
          "&:hover": {
            bgcolor: "transparent",
          },
          "&.Mui-selected": {
            "&:hover": {
              bgcolor: "transparent",
            },
            bgcolor: "transparent",
          },
        }),
      }}
    >
      <ListItemIcon
        sx={{
          minWidth: 28,
          color: isSelected
            ? theme.palette.text.secondary
            : theme.palette.text.primary,
          ...(!drawerOpen && {
            borderRadius: 1.5,
            width: 36,
            height: 36,
            alignItems: "center",
            justifyContent: "center",
            "&:hover": {
              bgcolor: "secondary.lighter",
            },
          }),
          ...(!drawerOpen &&
            isSelected && {
              bgcolor: theme.palette.background.secondary,
              "&:hover": {
                bgcolor: theme.palette.background.secondary,
              },
            }),
        }}
      >
        <i className={item.icon} style={{ 
          fontSize: "20px", 
          display: "flex", 
          justifyContent: "center", 
          alignItems: "center" 
        }}></i>
      </ListItemIcon>

      {(drawerOpen || (!drawerOpen && level !== 1)) && (
        <ListItemText
          primary={
            <Typography
              variant="h6"
              sx={{
                color: isSelected
                  ? theme.palette.text.secondary
                  : theme.palette.text.primary,
                paddingLeft: "10px",
                fontWeight: isSelected ? 'bold' : 'normal',
              }}
            >
              {item.title}
            </Typography>
          }
        />
      )}
      {(drawerOpen || (!drawerOpen && level !== 1)) && item.chip && (
        <Chip
          color={item.chip.color}
          variant={item.chip.variant}
          size={item.chip.size}
          label={item.chip.label}
          avatar={item.chip.avatar && <Avatar>{item.chip.avatar}</Avatar>}
        />
      )}
    </ListItemButton>
  );
};

NavItem.propTypes = {
  item: PropTypes.object,
  level: PropTypes.number,
};

export default NavItem;
