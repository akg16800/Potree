import React from "react";
import ReactDOM from "react-dom";
// import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

// const root= createRoot(document.getElementById('root'))

console.log(window, "window.index");

window.renderPotree = (containerId, history) => {
  ReactDOM.render(
    <App history={history} />,
    document.getElementById(containerId)
  );
};

window.unmountPotree = (containerId) => {
  if (!document.getElementById(containerId)) {
    ReactDOM.unmountComponentAtNode(
      document.getElementById("micro-frontend-script-Potree")
    );
  } else {
    ReactDOM.unmountComponentAtNode(
      document.getElementById("Potree-container")
    );
  }
  // ReactDOM.unmountComponentAtNode(document.getElementById(containerId));
};

if (!document.getElementById("micro-frontend-script-Potree")) {
  ReactDOM.render(<App />, document.getElementById("root"));
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
