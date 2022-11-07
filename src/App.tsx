import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./App.css";
import {
  fetchSignInStatus,
  signInPortal,
  signOutPortal,
} from "./features/portal/portalSlice";
import Gallery from "./Gallery";
import { AppDispatch, RootState } from "./store/store";

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, isSignedIn, username, status, error } = useSelector(
    (state: RootState) => state.portal
  );

  useEffect(() => {
    dispatch(fetchSignInStatus());
  }, []);

  useEffect(() => {
    dispatch(signInPortal());
  }, [isSignedIn]);

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
      {isSignedIn && (
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
      )}
    </div>
  );
}

export default App;
