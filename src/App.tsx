import esriId from "@arcgis/core/identity/IdentityManager";
import OAuthInfo from "@arcgis/core/identity/OAuthInfo";
import Portal from "@arcgis/core/portal/Portal";
import PortalItem from "@arcgis/core/portal/PortalItem";
import PortalQueryParams from "@arcgis/core/portal/PortalQueryParams";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import "./App.css";
import Gallery from "./Gallery";
import { AppDispatch, RootState } from "./store/store";
import {
  setIsSignedIn,
  setUsername,
  setItems,
} from "./features/portal/portalSlice";

const info = new OAuthInfo({
  appId: "3AbgO0Bn7DVIMpYA",
  flowType: "auto",
  popup: false,
});
esriId.registerOAuthInfos([info]);

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, isSignedIn, username } = useSelector(
    (state: RootState) => state.portal
  );

  React.useEffect(() => {
    esriId
      .checkSignInStatus(info.portalUrl + "/sharing")
      .then(async () => {
        await displayItems();
        dispatch(setIsSignedIn(true));
      })
      .catch(() => {
        dispatch(setIsSignedIn(false));
      });
  }, []);

  async function displayItems() {
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
    dispatch(setItems(res.results));
    dispatch(setUsername(portal.user.username));
  }

  const handleSignIn = async () => {
    await esriId.getCredential(info.portalUrl + "/sharing");
  };

  const handleSignOut = () => {
    esriId.destroyCredentials();
    window.location.reload();
  };

  return (
    <div className="App">
      {isSignedIn ? (
        <>
          <div style={{ padding: "5px", textAlign: "center" }}>
            Welcome <span style={{ fontWeight: "bold" }}>{username}</span>{" "}
            &nbsp;-&nbsp;
            <span
              style={{
                color: "blue",
                cursor: "pointer",
                textDecoration: "underline",
              }}
              onClick={handleSignOut}
            >
              Sign Out
            </span>
          </div>
          <Gallery items={items} />
        </>
      ) : (
        <div style={{ padding: "5px", textAlign: "center" }}>
          <span
            id="sign-in"
            style={{
              color: "blue",
              cursor: "pointer",
              textDecoration: "underline",
            }}
            onClick={handleSignIn}
          >
            Sign In
          </span>{" "}
          and view your ArcGIS Online items.
        </div>
      )}
    </div>
  );
}

export default App;
