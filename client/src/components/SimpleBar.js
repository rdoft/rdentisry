import PropTypes from "prop-types";
import { alpha, styled } from "@mui/material/styles";
import SimpleBar from "simplebar-react";
import { BrowserView, MobileView } from "react-device-detect";

// root style
const RootStyle = styled(BrowserView)({
  flexGrow: 1,
  height: "100%",
  overflow: "hidden",
});

// Mobile root style
const MobileRootStyle = styled(MobileView)({
  flexGrow: 1,
  height: "100%",
  overflow: "hidden",
});

// scroll bar wrapper
const SimpleBarStyle = styled(SimpleBar)(({ theme }) => ({
  maxHeight: "100%",
  "& .simplebar-scrollbar": {
    "&:before": {
      backgroundColor: alpha(theme.palette.grey[500], 0.48),
    },
    "&.simplebar-visible:before": {
      opacity: 1,
    },
  },
  "& .simplebar-track.simplebar-vertical": {
    width: 10,
  },
  "& .simplebar-track.simplebar-horizontal .simplebar-scrollbar": {
    height: 6,
  },
  "& .simplebar-mask": {
    zIndex: "inherit",
  },
}));

// Mobile scrollbar with hidden scrollbar but still scrollable content
const MobileBarStyle = styled(SimpleBar)(({ theme }) => ({
  maxHeight: "100%",
  "& .simplebar-scrollbar": {
    display: "none !important",
  },
  "& .simplebar-track.simplebar-vertical": {
    width: 0,
  },
  "& .simplebar-track.simplebar-horizontal": {
    height: 0,
  },
  "& .simplebar-mask": {
    zIndex: "inherit",
  },
}));

// ==============================|| SIMPLE SCROLL BAR  ||============================== //

export default function SimpleBarScroll({ children, sx, ...other }) {
  return (
    <>
      <RootStyle>
        <SimpleBarStyle timeout={500} clickOnTrack={false} sx={sx} {...other}>
          {children}
        </SimpleBarStyle>
      </RootStyle>
      <MobileRootStyle>
        <MobileBarStyle
          timeout={500}
          clickOnTrack={false}
          sx={{
            ...sx,
          }}
          {...other}
        >
          {children}
        </MobileBarStyle>
      </MobileRootStyle>
    </>
  );
}

SimpleBarScroll.propTypes = {
  children: PropTypes.node,
  sx: PropTypes.object,
};
