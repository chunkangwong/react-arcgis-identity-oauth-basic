import PortalItem from "@arcgis/core/portal/PortalItem";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PortalState {
  isSignedIn: boolean;
  username: string;
  items: PortalItem[];
}

const initialState: PortalState = {
  isSignedIn: false,
  username: "",
  items: [],
};

const portalSlice = createSlice({
  name: "portal",
  initialState,
  reducers: {
    setIsSignedIn: (state, action: PayloadAction<boolean>) => {
      state.isSignedIn = action.payload;
    },
    setUsername: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
    },
    setItems: (state, action: PayloadAction<PortalItem[]>) => {
      state.items = action.payload;
    },
  },
});

export const { setIsSignedIn, setUsername, setItems } = portalSlice.actions;

export default portalSlice.reducer;
