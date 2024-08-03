import PropTypes from "prop-types";
import { useSelector } from "react-redux";

import { Link } from "react-router-dom";
import { ButtonBase, Stack } from "@mui/material";
import LogoImage from "./LogoImage";
import LogoImageMini from "./LogoImageMini";

import config from "config/theme.config";

const Logo = ({ sx, to }) => {
  const { drawerOpen } = useSelector((state) => state.menu);

  return (
    <ButtonBase
      disableRipple
      component={Link}
      to={!to ? config.defaultPath : to}
      sx={sx}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        {drawerOpen ? <LogoImage /> : <LogoImageMini />}
      </Stack>
    </ButtonBase>
  );
};

Logo.propTypes = {
  sx: PropTypes.object,
  to: PropTypes.string,
};

export default Logo;
