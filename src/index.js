import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import Extension from "./components/Extension";
import store from "./store.js";
// import registerServiceWorker from "./registerServiceWorker";

const Pjax = require("pjax");
let GlobalPjax;

const containerId = "mercury-sidebar";

const createExtensionContainer = () => {
  const anchor = document.createElement("div");
  anchor.id = containerId;
  document.body.insertBefore(anchor, document.body.childNodes[0]);
};

const renderExtension = () => {
  ReactDOM.render(
    <Provider store={store}>
      <Extension />
    </Provider>,
    document.getElementById(containerId)
  );
};

const setupPjax = () => {
  // Trigger pjax setup whenever the files tree DOM changes
  // Select the node that will be observed for mutations
  var targetNode = document.querySelector(".tree-container");
  // Options for the observer (which mutations to observe)
  var config = { childList: true, subtree: true };
  // Callback function to execute when mutations are observed
  var callback = function(mutationsList) {
    GlobalPjax = new Pjax({
      elements: "a", // default is "a[href], form[action]"
      selectors: ["#js-repo-pjax-container"],
      disablePjaxHeader: true,
      cacheBust: false,
      currentUrlFullReload: false
    });
  };
  // Create an observer instance linked to the callback function
  var observer = new MutationObserver(callback);
  // Start observing the target node for configured mutations
  observer.observe(targetNode, config);
};

// Content script setup -- on injection
// registerServiceWorker();
createExtensionContainer();
renderExtension();

// Wait for 3 seconds, and then setup pjax
setTimeout(() => {
  setupPjax();
}, 3000);
