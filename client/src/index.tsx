import * as firebase from "firebase";
import * as React from "react";
import { runWithAdal } from "react-adal";
import * as ReactDOM from "react-dom";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
<<<<<<< HEAD
// import App from "./App";
import { authContext } from "./auth";
import "./index.css";
import registerServiceWorker from "./registerServiceWorker";
// import Card from "./components/Card";
=======
import "../node_modules/bootstrap/dist/js/bootstrap.min.js";
import "../node_modules/jquery/dist/jquery.min.js";
import "../node_modules/popper.js/dist/popper.min.js";
import { authContext } from "./auth";
import "./index.css";
import registerServiceWorker from "./registerServiceWorker";
>>>>>>> f9ad6f2e10e0d17b3056e39e4d808dd744f65f07
import { BrowserRouter } from "react-router-dom";
import App from "./App";

const DO_NOT_LOGIN = true;

const config = {
  apiKey: "AIzaSyB81vFRc7Kk8uiEU3MlnUKUmHD-x4KgjeE",
  authDomain: "finalfrontierapp-77.firebaseapp.com",
  databaseURL: "https://finalfrontierapp-77.firebaseio.com",
  messagingSenderId: "392104679550",
  projectId: "finalfrontierapp-77",
  storageBucket: "finalfrontierapp-77.appspot.com"
};
firebase.initializeApp(config);

runWithAdal(
  authContext,
  () => {
    ReactDOM.render(
      <BrowserRouter>
        <App />
      </BrowserRouter>,
      document.getElementById("root") as HTMLElement
    );
    registerServiceWorker();
  },
  DO_NOT_LOGIN
);
