// types
import { createSlice } from "@reduxjs/toolkit";

// initial state
const initialState = {
  openItem: ["calendar"],
  openComponent: "buttons",
  drawerOpen: false,
  componentDrawerOpen: true,
  breadcrumbs: [],
};

// ==============================|| SLICE - MENU ||============================== //

const menu = createSlice({
  name: "menu",
  initialState,
  reducers: {
    activeItem(state, action) {
      state.openItem = action.payload.openItem;
    },

    openDrawer(state, action) {
      state.drawerOpen = action.payload.drawerOpen;
    },
    
    setBreadcrumbs(state, action) {
      state.breadcrumbs = action.payload.breadcrumbs;
    },
  },
});

export default menu.reducer;

export const { 
  activeItem, 
  openDrawer,
  setBreadcrumbs,
} = menu.actions;
