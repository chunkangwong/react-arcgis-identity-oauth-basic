import { useDispatch, useSelector } from "react-redux";
import "./App.css";
import { signInPortal, signOutPortal } from "./features/portal/portalSlice";
import Gallery from "./Gallery";
import { AppDispatch, RootState } from "./store/store";

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, isSignedIn, username, status, error } = useSelector(
    (state: RootState) => state.portal
  );

  const handleSignIn = async () => {
    dispatch(signInPortal());
  };

  const handleSignOut = () => {
    dispatch(signOutPortal());
  };

  if (status === "loading") {
    return (
      <div style={{ padding: "5px", textAlign: "center" }}>Loading...</div>
    );
  }

  if (error !== "") {
    return <div style={{ padding: "5px", textAlign: "center" }}>{error}</div>;
  }

  return (
    <div className="App">
      {isSignedIn ? (
        <>
          <div style={{ padding: "5px", textAlign: "center" }}>
            Welcome <span style={{ fontWeight: "bold" }}>{username}</span>{" "}
            &nbsp;-&nbsp;
            <span className="action" onClick={handleSignOut}>
              Sign Out
            </span>
          </div>
          <Gallery items={items} />
        </>
      ) : (
        <div style={{ padding: "5px", textAlign: "center" }}>
          <span id="sign-in" className="action" onClick={handleSignIn}>
            Sign In
          </span>{" "}
          and view your ArcGIS Online items.
        </div>
      )}
    </div>
  );
}

export default App;
