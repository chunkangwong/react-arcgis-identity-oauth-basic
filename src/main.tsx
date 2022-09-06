import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App";
import { fetchSignInStatus } from "./features/portal/portalSlice";
import "./index.css";
import store from "./store/store";

async function main() {
  store.dispatch(fetchSignInStatus());

  ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>
  );
}

main();
