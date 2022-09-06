import PortalItem from "@arcgis/core/portal/PortalItem";
import esriId from "@arcgis/core/identity/IdentityManager";
import OAuthInfo from "@arcgis/core/identity/OAuthInfo";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const info = new OAuthInfo({
  appId: "3AbgO0Bn7DVIMpYA",
  flowType: "auto",
  popup: false,
});
esriId.registerOAuthInfos([info]);

interface PortalState {
  isSignedIn: boolean;
  username: string;
  items: PortalItem[];
  info: OAuthInfo;
}

const initialState: PortalState = {
  isSignedIn: false,
  username: "",
  items: [],
  info: info,
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
