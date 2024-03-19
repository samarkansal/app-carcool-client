import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.css";
import App from "./App.jsx";
import "./index.css";

console.log(import.meta.env.VITE_GOOGLE_MAP_API_KEY);

document.addEventListener("DOMContentLoaded", () => {
  const script = document.createElement("script");
  script.src = `https://maps.googleapis.com/maps/api/js?key=${
    import.meta.env.VITE_GOOGLE_MAP_API_KEY
  }&libraries=places`;
  script.async = true;
  document.body.appendChild(script);
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
