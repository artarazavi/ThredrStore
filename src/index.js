import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import * as firebase from 'firebase';
import '../node_modules/font-awesome/css/font-awesome.min.css';
import { Route, NavLink, HashRouter } from 'react-router-dom';
import vision from "react-cloud-vision-api";

var config = {
    apiKey: "AIzaSyDDgFI3pfRvE1q9JseHhGyBF_eECihi8pY",
    authDomain: "thredrstore.firebaseapp.com",
    databaseURL: "https://thredrstore.firebaseio.com",
    projectId: "thredrstore",
    storageBucket: "thredrstore.appspot.com",
    messagingSenderId: "214583805234"
};
firebase.initializeApp(config);

vision.init({ auth: 'AIzaSyBPcmNnZ0B35pE_nKAiamTyyJEpD0aP5bI' });

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();