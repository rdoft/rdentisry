// material-ui
import { styled } from "@mui/material/styles";
import LinearProgress from "@mui/material/LinearProgress";

// assets
import { useTheme } from "@mui/material/styles";

// loader style
const LoaderWrapper = styled("div")(({ theme }) => ({
  position: "fixed",
  top: 0,
  left: 0,
  zIndex: 2001,
  width: "100%",
  "& > * + *": {
    marginTop: theme.spacing(2),
  },
}));

// ==============================|| Loader ||============================== //

const Loader = () => {
  const theme = useTheme();
  return (
    <LoaderWrapper>
      <LinearProgress
        sx={{
          backgroundColor: theme.palette.background.secondary,
          "& .MuiLinearProgress-bar": {
            backgroundColor: theme.palette.text.secondary,
          },
        }}
      />
    </LoaderWrapper>
  );
};

export default Loader;
