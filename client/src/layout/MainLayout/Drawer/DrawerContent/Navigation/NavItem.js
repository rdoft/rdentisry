import PropTypes from "prop-types";
import { forwardRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

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

// project import
import { activeItem } from "store/reducers/menu";

// ==============================|| NAVIGATION - LIST ITEM ||============================== //

const NavItem = ({ item, level }) => {
  const location = useLocation();
  const theme = useTheme();
  const dispatch = useDispatch();
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

  const itemHandler = (id) => {
    dispatch(activeItem({ openItem: [id] }));
  };

  const isSelected = openItem.findIndex((id) => id === item.id) > -1;
  const itemIcon = isSelected ? item.iconActive : item.iconPassive;

  // active menu item on page load
  useEffect(() => {
    if (document.location.pathname === "/") {
      dispatch(activeItem({ openItem: ["calendar"] }));
    } else {
      const currentIndex = document.location.pathname
        .toString()
        .split("/")
        .findIndex((id) => id === item.id);
      if (currentIndex > -1) {
        dispatch(activeItem({ openItem: [item.id] }));
      }
    }
    // eslint-disable-next-line
  }, [location]);

  return (
    <ListItemButton
      {...listItemProps}
      disabled={item.disabled}
      onClick={() => itemHandler(item.id)}
      selected={isSelected}
      sx={{
        zIndex: 1201,
        pl: drawerOpen ? `${level * 28}px` : 1.5,
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
      {itemIcon && (
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
          {itemIcon}
        </ListItemIcon>
      )}
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
