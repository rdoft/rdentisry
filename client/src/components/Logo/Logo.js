import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { ButtonBase, Stack } from "@mui/material";
import LogoImage from "./LogoImage";

import config from "config/theme.config";

const Logo = ({ sx, to }) => (
  <ButtonBase
    disableRipple
    component={Link}
    to={!to ? config.defaultPath : to}
    sx={sx}
  >
    <Stack direction="row" spacing={2} alignItems="center">
      <LogoImage />
    </Stack>
  </ButtonBase>
);

Logo.propTypes = {
  sx: PropTypes.object,
  to: PropTypes.string,
};

export default Logo;
