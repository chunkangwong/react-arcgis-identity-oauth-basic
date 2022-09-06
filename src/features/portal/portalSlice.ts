import esriId from "@arcgis/core/identity/IdentityManager";
import OAuthInfo from "@arcgis/core/identity/OAuthInfo";
import Portal from "@arcgis/core/portal/Portal";
import PortalItem from "@arcgis/core/portal/PortalItem";
import PortalQueryParams from "@arcgis/core/portal/PortalQueryParams";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

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

export const fetchSignInStatus = createAsyncThunk(
  "posts/fetchSignInStatus",
  async () => {
    await esriId.checkSignInStatus(info.portalUrl + "/sharing");
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
      isSignedIn: true,
    };
  }
);

export const signInPortal = createAsyncThunk(
  "posts/signInPortal",
  async (info: OAuthInfo) => {
    await esriId.getCredential(info.portalUrl + "/sharing");
  }
);

const portalSlice = createSlice({
  name: "portal",
  initialState,
  reducers: {
    signOutPortal: () => {
      esriId.destroyCredentials();
      window.location.reload();
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchSignInStatus.pending, (state) => {
        return {
          ...state,
          status: "loading",
        };
      })
      .addCase(fetchSignInStatus.fulfilled, (state, action) => {
        return {
          ...state,
          status: "succeeded",
          ...action.payload,
        };
      })
      .addCase(fetchSignInStatus.rejected, (state) => {
        return {
          ...state,
          status: "failed",
          items: [],
          username: "",
          isSignedIn: false,
        };
      })
      .addCase(signInPortal.pending, (state) => {
        return {
          ...state,
          status: "loading",
        };
      })
      .addCase(signInPortal.fulfilled, (state) => {
        return {
          ...state,
          status: "succeeded",
        };
      })
      .addCase(signInPortal.rejected, (state) => {
        return {
          ...state,
          status: "failed",
        };
      });
  },
});

export const { signOutPortal } = portalSlice.actions;

export default portalSlice.reducer;
