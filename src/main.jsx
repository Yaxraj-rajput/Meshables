import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { UserProvider } from "./Context/UserProvider.jsx";
import { Buffer } from "buffer"; // Import Buffer from the buffer package

window.Buffer = Buffer; // Make Buffer available globally

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <UserProvider>
      <App />
    </UserProvider>
  </React.StrictMode>
);
