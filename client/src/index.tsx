import * as firebase from "firebase";
import * as React from "react";
import { runWithAdal } from "react-adal";
import * as ReactDOM from "react-dom";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
// import App from "./App";
import { authContext } from "./auth";
import "./index.css";
import registerServiceWorker from "./registerServiceWorker";
import CardContainer from "./components/CardContainer";

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
    ReactDOM.render(<CardContainer />, document.getElementById(
      "root"
    ) as HTMLElement);
    registerServiceWorker();
  },
  DO_NOT_LOGIN
);
