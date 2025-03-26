import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Typography, Box } from "@mui/material";
import MuiBreadcrumbs from "@mui/material/Breadcrumbs";
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { useSelector } from "react-redux";

const Breadcrumbs = ({ sx }) => {
  const { breadcrumbs } = useSelector((state) => state.menu);

  if (!breadcrumbs.length) return null;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', ...sx }}>
      <MuiBreadcrumbs 
        aria-label="breadcrumb" 
        separator={<NavigateNextIcon fontSize="small" sx={{ color: 'text.primary' }} />}
        sx={{
          '& .MuiBreadcrumbs-separator': { mx: 0.5 },
          '& .MuiSvgIcon-fontSizeSmall': { fontSize: '0.8rem' }
        }}
      >
        {breadcrumbs.map((breadcrumb, index) => {
          const isLast = index === breadcrumbs.length - 1;
          
          return isLast ? (
            <Typography 
              key={index}
              variant="caption" 
              color="text.primary"
              sx={{ fontWeight: 500, fontSize: '0.85rem' }}
            >
              {breadcrumb.title}
            </Typography>
          ) : (
            <Typography
              key={index}
              component={Link}
              to={breadcrumb.url}
              variant="caption"
              color="text.primary"
              sx={{
                textDecoration: "none",
                fontWeight: 400,
                fontSize: "0.85rem",
                "&:hover": { color: "text.secondary" },
              }}
            >
              {breadcrumb.title}
            </Typography>
          );
        })}
      </MuiBreadcrumbs>
    </Box>
  );
};

Breadcrumbs.propTypes = {
  sx: PropTypes.object
};

export default Breadcrumbs;
