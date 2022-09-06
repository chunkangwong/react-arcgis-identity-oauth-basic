import PortalItem from "@arcgis/core/portal/PortalItem";
import esriId from "@arcgis/core/identity/IdentityManager";
import OAuthInfo from "@arcgis/core/identity/OAuthInfo";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import Portal from "@arcgis/core/portal/Portal";
import PortalQueryParams from "@arcgis/core/portal/PortalQueryParams";

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
  status: string;
  error: string;
}

const initialState: PortalState = {
  isSignedIn: false,
  username: "",
  items: [],
  info: info,
  status: "idle",
  error: "",
};

export const fetchPortalItems = createAsyncThunk(
  "posts/fetchPortalItems",
  async () => {
    const portal = new Portal();
    portal.authMode = "immediate";
    await portal.load();
    const queryParams = new PortalQueryParams({
      query: "owner:" + portal.user.username,
      sortField: "num-views",
      sortOrder: "desc",
      num: 20,
    });

    const res = await portal.queryItems(queryParams);
    return {
      items: res.results,
      username: portal.user.username,
    };
  }
);

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
  extraReducers(builder) {
    builder
      .addCase(fetchPortalItems.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(fetchPortalItems.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.items;
        state.username = action.payload.username;
      })
      .addCase(fetchPortalItems.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "";
      });
  },
});

export const { setIsSignedIn, setUsername, setItems } = portalSlice.actions;

export default portalSlice.reducer;
