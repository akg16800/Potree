import React from "react";
import styled from "styled-components/macro";
import { useEffect } from "react";
import PotreeSidebar from "./PotreeSidebar";
import {
  loadPointCloud,
  PointColorType,
  PointSizeType,
  PointShape,
  Global,
  Group,
} from "potree-core/build/potree.module";

import * as THREE from "three";

const Wrapper = styled.div`
  background-color: black;
  display: flex;
  flex-direction: column;
  height: 675px;
  position: relative;
  top: 0px;
  left: 0px;
`;

// import vanillaJS Potree libs, /!\ would be best with proper ES6 import

const PotreeCore = {
  loadPointCloud,
  PointColorType,
  PointSizeType,
  PointShape,
  Global,
  Group,
};
PotreeCore.Global.workerPath = "/resources/libs/potree";
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(60, 1, 0.1, 10000);

var canvas = document.createElement("canvas");
canvas.style.position = "absolute";
canvas.style.top = "0px";
canvas.style.left = "0px";
canvas.style.width = "100%";
canvas.style.height = "100%";
document.body.appendChild(canvas);

var renderer = new THREE.WebGLRenderer({ canvas: canvas });

var geometry = new THREE.BoxGeometry(1, 1, 1);
var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
var cube = new THREE.Mesh(geometry, material);

var points = new PotreeCore.Group();
points.setPointBudget(10000000);
scene.add(points);
// const Potree = window.Potree;
// const Potree = PotreeCore;
// console.log(PotreeCore);

const PotreeViewer = ({ props }) => {
  const potreeContainer = React.useRef(true);
  const [viewer, setViewer] = React.useState(null);

  const [loaded, setLoaded] = React.useState(false);
  const [url, setUrl] = React.useState(
    "https://digital-twin-assets.s3.ap-south-1.amazonaws.com/lion_takanawa_laz/cloud.js"
  );

  const createViewer = () => {
    if (!viewer) {
      setViewer(new PotreeCore.Viewer(potreeContainer.current));
    }
  };
  const clearViewer = (viewer) => {
    viewer.scene.scenePointCloud.remove(viewer.scene.pointclouds[0]);
    viewer.scene.pointclouds.pop();
    let scene = new PotreeCore.Scene();
    viewer.setScene(scene);
  };

  //   useEffect(() => {
  //     // const viewerElem = potreeContainer.current;
  //     const viewercache = new PotreeCore.Viewer(potreeContainer.current);
  //     setViewer(viewercache);
  //     console.log({ viewercache });

  //     // if (!potreeContainer.current) {
  //     //   setViewer(new PotreeCore.Viewer(potreeContainer.current));
  //     // }

  //     // setViewer(new PotreeCore.Viewer(potreeContainer.current));

  //     //
  //   }, []);

  //   useEffect(() => {
  //     console.log({ viewer });
  //     if (viewer !== "undefined" && viewer !== undefined && viewer !== null) {
  //       setLoaded(true);
  //       run_once(viewer);
  //     }
  //   }, [viewer]);
  //   useEffect(() => {
  //     if (viewer !== "undefined" && viewer !== undefined && viewer !== null) {
  //       clearViewer(viewer);
  //       PotreeCore.loadPointCloud(url).then(
  //         (e) => {
  //           //let scene = viewer.scene;
  //           let pointcloud = e.pointcloud;
  //           let material = pointcloud.material;

  //           material.activeAttributeName = "rgba";
  //           material.minSize = 2;
  //           material.pointSizeType = PotreeCore.PointSizeType.FIXED;

  //           viewer.scene.addPointCloud(pointcloud);

  //           viewer.fitToScreen();

  //           console.log("This is the url", url);
  //         },
  //         (e) => console.err("ERROR: ", e)
  //       );
  //     }

  //     // return () => {
  //     //   second
  //     // }
  //   }, [url]);

  const run_once = (viewer) => {
    viewer.setEDLEnabled(true);
    viewer.setFOV(60);
    viewer.setPointBudget(1 * 1000 * 1000);
    viewer.setClipTask(PotreeCore.ClipTask.SHOW_INSIDE);
    viewer.loadSettingsFromURL();

    viewer.setControls(viewer.orbitControls);

    console.log({ viewer });

    viewer.loadGUI(() => {
      viewer.setLanguage("en");
      document.getElementById("menu_appearance").next().show();
      viewer.toggleSidebar();
    });

    // Load and add point cloud to scene
    // let url = "./lion_takanawa_laz/cloud.js";
    // let url =
    //   "https://digital-twin-assets.s3.ap-south-1.amazonaws.com/vol_total/cloud.js";
    // let url =
    //   "https://digital-twin-assets.s3.ap-south-1.amazonaws.com/lion_takanawa_laz/cloud.js";
    /* ***PUT YOUR POINTCLOUD URL*** HERE */
  };

  PotreeCore.loadPointCloud(url, "lion", function (data) {
    var pointcloud = data.pointcloud;
    points.add(pointcloud);
  });
  return (
    <>
      <Wrapper>
        <div ref={potreeContainer} style={{ height: "100%" }} />
      </Wrapper>
      <PotreeSidebar
        loaded={loaded}
        url={url}
        setUrl={setUrl}
        viewer={viewer}
        setViewer={setViewer}
      />
    </>
  );
};

export default PotreeViewer;
