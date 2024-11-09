import React, { cloneElement } from "react";
import { Badge, Tooltip, Avatar } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useSubscription } from "context/SubscriptionProvider";

// assets
import { PremiumIcon } from "assets/images/icons";

const SubscriptionController = ({ type, children }) => {
  const theme = useTheme();
  const { limits, isSubscribed, showDialog } = useSubscription();
  const exceeded = limits[type] <= 0;

  // HANDLERS ------------------------------------------------------------------
  const handleClick = (event) => {
    if (exceeded || !isSubscribed) {
      showDialog();
    } else if (children.props.onClick) {
      children.props.onClick(event);
    } else {
      return;
    }
  };

  return (
    <Badge
      badgeContent={
        exceeded ? (
          <Tooltip
            arrow
            title="Üyelik limitlerinize ulaştınız, daha fazla erişim için planınızı yükseltin."
            PopperProps={{
              disablePortal: true,
              style: {
                width: "250px",
              },
            }}
          >
            <Avatar
              src={PremiumIcon}
              sx={{
                width: "1.1rem",
                height: "1.1rem",
                padding: "0.15rem",
                backgroundColor: `${theme.palette.text.primary}80`,
              }}
            />
          </Tooltip>
        ) : null
      }
      sx={{
        "& .MuiBadge-badge": {
          right: 12,
          top: 6,
        },
      }}
    >
      {cloneElement(children, {
        onClick: handleClick,
      })}
    </Badge>
  );
};

export default SubscriptionController;
