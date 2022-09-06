import esriId from "@arcgis/core/identity/IdentityManager";
import { useSelector } from "react-redux";
import "./App.css";
import Gallery from "./Gallery";
import { RootState } from "./store/store";

function App() {
  const { items, isSignedIn, username, info, status, error } = useSelector(
    (state: RootState) => state.portal
  );

  const handleSignIn = async () => {
    await esriId.getCredential(info.portalUrl + "/sharing");
  };

  const handleSignOut = () => {
    esriId.destroyCredentials();
    window.location.reload();
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (error !== "") {
    return <div>{error}</div>;
  }

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
