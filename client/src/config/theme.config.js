// ==============================|| THEME CONFIG  ||============================== //

const config = {
  defaultPath: "/",
  fontFamily: `'Public Sans', sans-serif`,
  i18n: "en",
  miniDrawer: false,
  container: true,
  mode: "light",
  presetColor: "default",
  themeDirection: "ltr",
  drawer: {
    width: 280,
    miniWidth: 280 / 3,
  },
  // z-index values for consistent layering
  zIndex: {
    appBar: 1100,
    drawer: 1200,
    modal: 1300,
    dialog: 1400,
    tooltip: 1500
  }
};

export default config;