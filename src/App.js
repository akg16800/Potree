import PotreeSidebar from "./components/PotreeSidebar";
import PotreeFunction from "./components/PotreeFunction";
// import Potreenpm from "./components/Potree_npm";
import React, { useLayoutEffect } from "react";
import styled from "styled-components/macro";
import { useEffect } from "react";
import "./App.css";
import Viewer from "./components/3d-viewer-component";

const appendScript = (scriptId, scriptToAppend) => {
  if (document.getElementById(scriptId)) {
    return;
  }
  const script = document.createElement("script");
  script.id = scriptId;
  script.src = scriptToAppend;
  script.async = true;
  document.head.appendChild(script);
};

function App(scrollCheck = true, keyboardCheck = true) {
  // useLayoutEffect(() => {
  //   appendScript("jquery", "./potree_libs/jquery/jquery-3.1.1.min.js");
  //   appendScript("jquery-ui", "./potree_libs/jquery-ui/jquery-ui.min.js");
  //   appendScript("spectrum", "./potree_libs/spectrum/spectrum.js");
  //   appendScript("BinaryHeap", "./potree_libs/other/BinaryHeap.js");
  //   appendScript("tween_min", "./potree_libs/tween/tween.min.js");
  //   appendScript("d3", "./potree_libs/d3/d3.js");
  //   appendScript("ol", "./potree_libs/openlayers3/ol.js");
  //   appendScript("jstree", "./potree_libs/jstree/jstree.js");
  //   appendScript("laslaz", "./potree_libs/plasio/js/laslaz.js");
  //   appendScript("potree", "./potree_libs/potree/potree.js");
  //   appendScript("proj4", "./potree_libs/proj4/proj4.js");

  //   // return () => {
  //   //   second

  //   // }
  // }, []);

  const handleWheel = (e) => {
    // if (scrollCheck && e.ctrlKey) {
    //   e.preventDefault();
    // }
    e.preventDefault();
  };
  const generateRandomId = () => {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const randomLetters = Array.from({ length: 3 }, () =>
      alphabet.charAt(Math.floor(Math.random() * alphabet.length))
    ); // Generate 3 random alphabet characters
    const randomNumber = Math.floor(1000 + Math.random() * 9000); // Generate a random number between 1000 and 9999
    return `random-${randomLetters.join("")}${randomNumber}`;
  };
  useEffect(() => {
    if (localStorage.length <= 0) {
      let obj = {
        username: generateRandomId(),
        email: "anonymous@gmail.com",
        phone: "not found",
        city: "Not found"
      };
      localStorage.setItem("mytime", Date.now());
      if (!localStorage.getItem("info")) {
        localStorage.setItem("info", JSON.stringify(obj));
      }
    } else {
      const keys = Object.keys(localStorage);

      // Map through the keys and get their corresponding values
      const items = keys.map((key) => {
        return {
          key: key,
          value: localStorage.getItem(key)
        };
      });

      // Set the state with the array of items
      // setLocalStorageItems(items);

      // Log the localStorage items
      document.addEventListener("wheel", handleWheel);
      console.log("localStorage items:", items);
    }
  }, []);
  return (
    <>
      <Viewer />
    </>
  );
}

export default App;
