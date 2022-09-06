import esriId from "@arcgis/core/identity/IdentityManager";
import OAuthInfo from "@arcgis/core/identity/OAuthInfo";
import Portal from "@arcgis/core/portal/Portal";
import PortalItem from "@arcgis/core/portal/PortalItem";
import PortalQueryParams from "@arcgis/core/portal/PortalQueryParams";
import * as React from "react";
import "./App.css";
import Gallery from "./Gallery";

const info = new OAuthInfo({
  appId: "3AbgO0Bn7DVIMpYA",
  flowType: "auto",
  popup: false,
});
esriId.registerOAuthInfos([info]);

function App() {
  const [isSignedIn, setIsSignedIn] = React.useState(false);
  const [items, setItems] = React.useState<PortalItem[]>([]);
  const [username, setUsername] = React.useState("");

  React.useEffect(() => {
    esriId
      .checkSignInStatus(info.portalUrl + "/sharing")
      .then(async () => {
        await displayItems();
        setIsSignedIn(true);
      })
      .catch(() => {
        setIsSignedIn(false);
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
    setItems(res.results);
    setUsername(portal.user.username);
  }

  const handleSignIn = async () => {
    await esriId.getCredential(info.portalUrl + "/sharing");
  };

  const handleSignOut = () => {
    setIsSignedIn(false);
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
