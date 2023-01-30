import PropTypes from "prop-types";
import { Link } from "react-router-dom";

// material-ui
import { ButtonBase, Stack, Typography } from "@mui/material";

// project import
import LogoImage from "./LogoImage";
import config from "config/theme.config";

// ==============================|| MAIN LOGO ||============================== //

const Logo = ({ sx, to }) => (
  <ButtonBase
    disableRipple
    component={Link}
    to={!to ? config.defaultPath : to}
    sx={sx}
  >
    <Stack direction="row" spacing={3} alignItems="center">
      <LogoImage />
      <Typography variant="h4">Uygulama İsmi</Typography>
    </Stack>
  </ButtonBase>
);

Logo.propTypes = {
  sx: PropTypes.object,
  to: PropTypes.string,
};

export default Logo;
