// material-ui
import { createTheme } from "@mui/material/styles";

// third-party
import { presetPalettes } from "@ant-design/colors";

// project import
import ThemeOption from "./theme";

// ==============================|| DEFAULT THEME - PALETTE  ||============================== //

const Palette = (mode) => {
  const colors = presetPalettes;

  const greyPrimary = [
    "#ffffff",
    "#fafafa",
    "#f5f5f5",
    "#f0f0f0",
    "#d9d9d9",
    "#bfbfbf",
    "#8c8c8c",
    "#595959",
    "#262626",
    "#141414",
    "#000000",
  ];
  const greyAscent = ["#fafafa", "#bfbfbf", "#434343", "#1f1f1f"];
  const greyConstant = ["#fafafb", "#e6ebf1"];

  colors.grey = [...greyPrimary, ...greyAscent, ...greyConstant];

  const paletteColor = ThemeOption(colors);

  return createTheme({
    palette: {
      mode,
      common: {
        black: "#000",
        white: "#fff",
      },
      ...paletteColor,
      action: {
        disabled: paletteColor.grey[300],
      },
      divider: paletteColor.grey[200],
      background: {
        primary: "#f5f5f5",
        secondary: "#eff2fd",
        event: "#f8f5ff",
        success: "#dff6ec",
        error: "#ffd2cb",
        warning: "#fffadd",
        info: "#e8f0ff",
        today: "#ebeff4",

        paper: paletteColor.grey[0],
        default: paletteColor.grey.A50,
      },
      text: {
        primary: "#21273d",
        primaryDark: "#1a1f30",
        secondary: "#143CF7",
        secondaryDark: "#0f2dc4",
        event: "#6d40d3",
        eventDark: "#5633a9",
        eventBorder: "#b092ef",
        eventBorderDark: "#8d74bf",
        success: "#22a06a",
        successDark: "#1b8054",
        error: "#ef4444",
        errorDark: "#be3636",
        warning: "#a44800",
        warningDark: "#833a00",
        info: "#1e7afc",
        infoDark: "#1862c9",
      },
    },
  });
};

export default Palette;
