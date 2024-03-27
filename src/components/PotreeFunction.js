import React, { useCallback, useLayoutEffect, useRef, useState } from "react";
import styled from "styled-components/macro";
import { useEffect } from "react";
import PotreeSidebar from "./PotreeSidebar";
import Split from "react-split";
import { makeStyles } from "@mui/styles";
import * as THREE from "three";
// import { CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer.js";
import { debounce } from "lodash";
import * as TWEEN from "@tweenjs/tween.js";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  CSS2DObject,
  CSS2DRenderer
} from "three/examples/jsm/renderers/CSS2DRenderer.js";
// import { Html } from "@react-three/fiber";
// import { useGLTF, useAnimations } from "@react-three/drei";

// import { Html } from "@react-three/drei";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  LinearProgress,
  Modal,
  Radio,
  RadioGroup,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  Paper,
  Tooltip,
  FormHelperText,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress
} from "@mui/material";
import InfoNavBar from "./InfoNavBar";
import { getAllLocations } from "../utils/api";
// import material_mtl1 from "../assets/esp_model/odm_texturing/odm_textured_model_geo.mtl";
// import object_obj1 from "../assets/esp_model/odm_texturing/odm_textured_model_geo.obj";
// import point_cloud from "../assets/esp_model/entwine_pointcloud/ept.json";
// import { PLYLoader } from "/potree_libs/three.js/loaders/PLYLoader.js";
// import { OBJLoader } from "/potree_libs/three.js/loaders/OBJLoader.js";
// import * as THREE from "/potree_libs/three.js/build/three.module.js";

const useStyles = makeStyles(() => ({
  split: {
    position: "relative",
    display: "flex",
    flexDirection: "row",
    height: "100%",
    "& > .gutter": {
      backgroundColor: "#eee",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "50%"
    },
    "& > .gutter.gutter-horizontal": {
      cursor: "col-resize",
      background: "#252525"
      //   background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAeCAYAAADkftS9AAAAIklEQVQoU2M4c+bMfxAGAgYYmwGrIIiDjrELjpo5aiZeMwF+yNnOs5KSvgAAAABJRU5ErkJggg==");
    }
    // width: '70%'
  },
  slideFullScreen: {
    width: "100%",
    position: "absolute"
    // height: "calc(100vh - 68px)",
  },
  normal: {
    position: "relative"
  }
}));

const Wrapper = styled.div`
  background-color: black;
  display: flex;
  flex-direction: column;
  height: 675px;
  position: relative;
  top: 0px;
  left: 0px;
  // width: 300px;
`;

// import vanillaJS Potree libs, /!\ would be best with proper ES6 import

const CustomProgressBar = (props) => {
  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Box sx={{ width: "100%", mr: 1 }}>
          {props.statusProperties.progress > 0 ? (
            <LinearProgress
              variant="determinate"
              value={Math.round(props.statusProperties.progress)}
            />
          ) : (
            <LinearProgress />
          )}
        </Box>
        <Box sx={{ minWidth: 35 }}>
          <Typography
            variant="body2"
            sx={{
              color: "#fff"
            }}
          >{`${Math.round(props.statusProperties.progress)}%`}</Typography>
        </Box>
      </Box>
      {/* <LinearProgress variant="determinate" /> */}
    </Box>
  );
};

// const annotations = [
//   {
//     title: "Bathroom Sink",
//     description: "<p>Bathroom Sink is good for washing your hands</p>",
//     camPos: {
//       x: 29209.48,
//       y: 3189950.63,
//       z: 290.76
//     },
//     // 292913.0, 3189955.66, 295.16
//     // 292909.48699951184, 3189950.636001587, 290.76900100702835
//     lookAt: {
//       x: 292913,
//       y: 3189955.66,
//       z: 295.16
//     },
//     descriptionDomElement: {}
//   },
//   {
//     title: "Bath",
//     camPos: {
//       x: 7.13,
//       y: 4.33,
//       z: 1.98
//     },
//     lookAt: {
//       x: 8.32,
//       y: 2.71,
//       z: 1.33
//     }
//   },
//   {
//     title: "Radiator",
//     description: "Keeps you warm in winter.",
//     camPos: {
//       x: 7.13,
//       y: 1.15,
//       z: 0.66
//     },
//     lookAt: {
//       x: 5.78,
//       y: 0.89,
//       z: 0.68
//     },
//     descriptionDomElement: {}
//   },
//   {
//     title: "Sky Light",
//     camPos: {
//       x: 13.05,
//       y: 4.35,
//       z: 5.06
//     },
//     lookAt: {
//       x: 11,
//       y: 2.7,
//       z: 3.42
//     }
//   }
// ];

let idArray = [];

const PotreeViewer = (props) => {
  // const { setPotree, setTHREE, Potree, THREE } = props;

  const classes = useStyles();
  const [Potree, setPotree] = useState(null);
  const [THREE, setTHREE] = useState(null);
  const [forceRender, setForceRender] = useState(false);
  const [containerHeight, setContainerHeight] = useState(window.innerHeight);
  const [fullScreen, setFullScreen] = useState(false);
  const [cameraState, setCameraState] = useState(null);
  const [labelRenderer, setLabelRenderer] = useState(null);
  const [annotations, setAnnotations] = useState([]);

  console.log(window, "WINDOW");
  console.log("window.PLYLoader", window.THREE);
  console.log("Potree", window.THREE);

  console.log("Potree.window", window.Potree);

  console.log(window, props);

  const potreeContainer = React.useRef(true);
  const divContainer = useRef(null);
  const [viewer, setViewer] = React.useState(null);

  const [loaded, setLoaded] = React.useState(false);
  const [url, setUrl] = React.useState();

  const createViewer = () => {
    if (!viewer) {
      setViewer(new Potree.Viewer(potreeContainer.current));
    }
  };
  const clearViewer = (viewer) => {
    console.log("viewer.remove", viewer.scene);
    viewer.scene.scenePointCloud.remove(viewer.scene.pointclouds[0]);
    viewer.scene.pointclouds.pop();
    // viewer.scene.scene.remove(viewer.scene.scene.children);
    let scene = new Potree.Scene();
    viewer.setScene(scene);
    viewer.scene.scene.children.pop();
    removeAnnotationElement();

    // for (var i = viewer.scene.scene.children.length - 1; i >= 0; i--) {
    //   let obj = viewer.scene.scene.children[i];

    //   console.log("scene.obj", obj);
    //   viewer.scene.scene.remove(obj);
    // }

    viewer.removeEventListener("update", updateViewerCallback);
  };

  useEffect(() => {
    if (!THREE) {
      var THREEcache = window.THREE;
      console.log(THREEcache);
      setTHREE(THREEcache);
      console.log("THREE", THREE);
    }

    if (!Potree) {
      var Potreecache = window.Potree;
      console.log(Potreecache);
      setPotree(Potreecache);
      console.log("Potree", Potree);
      // setUrl(
      //   "https://digital-twin-assets.s3.ap-south-1.amazonaws.com/IITD/metadata.json"
      // );
    }
  });

  const updateViewerCallback = () => {
    if (viewer !== "undefined" && viewer !== undefined && viewer !== null) {
      labelRenderer &&
        labelRenderer.render(
          viewer.scene.scene,
          viewer.scene.getActiveCamera()
        );
    }
  };

  const gotoAnnotation2 = (a) => {
    if (viewer != null && loaded) {
      console.log("id.array", idArray);
      console.log("is.annotation", annotations);
      // Define the target and pivot positions
      // const target = new THREE.Vector3(
      //   292890.09464662883,
      //   3189908.1521291765,
      //   308.9588120437726
      // );
      // const pivot = new THREE.Vector3(
      //   292894.32679684495,
      //   3189968.5962035204,
      //   263.7615424088028
      // );
      console.log("goto.viewer", viewer, " ", annotations.length);
      const target = JSON.parse(a.cameraPos);
      const pivot = JSON.parse(a.pivotPos);
      console.log("view.annotation is", a);
      annotations.forEach((val, i) => {
        let elem = document.getElementById(val.locationID);
        console.log("goto.elem", elem);
        if (elem) {
          elem.style.display = "none";
        }
      });

      const myElement = document.getElementById(a.locationID);

      console.log("goto.element", myElement);

      if (myElement) {
        // Change the CSS style of the element
        myElement.style.display = "block";

        // You can change any other CSS property as needed
      }

      const duration = 1000;
      // 1 second

      // Create a new TWEEN animation
      new TWEEN.Tween(viewer.scene.view.position)
        .to({ x: target.x, y: target.y, z: target.z }, duration)
        .easing(TWEEN.Easing.Cubic.InOut) // You can choose a different easing function if needed
        .onUpdate(() => {
          // Update the camera position during the animation
          viewer.scene.view.lookAt(pivot); // Ensure camera looks at the pivot point
        })
        .start(); // Start the animation

      // Start the animation loop
      function animate() {
        requestAnimationFrame(animate);
        TWEEN.update();
      }
      animate();
    }
  };

  const removeAnnotationElement = () => {
    annotations.forEach((val, i) => {
      let elem = document.getElementById(`parent-${val.locationID}`);
      console.log("goto.elem", elem);
      if (elem) {
        elem.remove();
      }
    });
  };

  const gotoAnnotation3 = useCallback(
    (a) => {
      // var a = annotations[index];
      console.log("goto.annotation", a, " ", annotations);
      if (viewer != null && loaded) {
        // Define the target and pivot positions
        // const target = new THREE.Vector3(
        //   292890.09464662883,
        //   3189908.1521291765,
        //   308.9588120437726
        // );
        // const pivot = new THREE.Vector3(
        //   292894.32679684495,
        //   3189968.5962035204,
        //   263.7615424088028
        // );
        console.log("goto.viewer", viewer, " ", annotations.length);
        const target = JSON.parse(a.cameraPos);
        const pivot = JSON.parse(a.pivotPos);
        console.log("view.annotation is", a);

        const myElement = document.getElementById(a.locationID);

        console.log("goto.element", myElement);
        console.log("goto.element", pivot);

        // if (myElement) {
        //   // Change the CSS style of the element
        //   myElement.style.display = "block";
        // }
        // Define the duration of the animation in milliseconds
        const duration = 1000;
        // 1 second

        // Create a new TWEEN animation
        if (cameraState !== null) {
          console.log("cameraState", cameraState);
          new TWEEN.Tween(cameraState.position)
            .to({ x: target.x, y: target.y, z: target.z }, duration)
            .easing(TWEEN.Easing.Cubic.InOut) // You can choose a different easing function if needed
            // .onUpdate(() => {
            //   // Update the camera position during the animation
            //   viewer.scene.view.lookAt(pivot); // Ensure camera looks at the pivot point
            // })
            .start(); // Start the animation
          new TWEEN.Tween(cameraState.pivot_point)
            .to(
              {
                x: pivot.x,
                y: pivot.y,
                z: pivot.z
              },
              duration
            )
            .easing(TWEEN.Easing.Cubic.Out)
            .start();
        } else {
          new TWEEN.Tween(viewer.scene.view.position)
            .to({ x: target.x, y: target.y, z: target.z }, duration)
            .easing(TWEEN.Easing.Cubic.InOut) // You can choose a different easing function if needed
            .onUpdate(() => {
              // Update the camera position during the animation
              viewer.scene.view.lookAt(pivot); // Ensure camera looks at the pivot point
            })
            .start(); // Start the animation
          // new TWEEN.Tween(viewer.scene.view.getPivot())
          //   .to(
          //     {
          //       x: pivot.x,
          //       y: pivot.y,
          //       z: pivot.z,
          //     },
          //     duration
          //   )
          //   .easing(TWEEN.Easing.Cubic.Out)
          //   .start();
        }

        // Start the animation loop
        function animate() {
          requestAnimationFrame(animate);
          TWEEN.update();
        }
        animate();
        // viewer.scene.view.lookAt(pivot);
      }
    },
    [viewer, loaded]
  );

  const addAnnotationButton = useCallback(
    (data) => {
      if (data != null && data.length > 0) {
        console.log("data", data);
        data.map((annotation, index) => {
          const canvas = document.getElementById("number");
          const ctx = canvas.getContext("2d");
          const x = 32;
          const y = 32;
          const radius = 30;
          const startAngle = 0;
          const endAngle = Math.PI * 2;

          ctx.fillStyle = "rgb(0, 0, 0)";
          ctx.beginPath();
          ctx.arc(x, y, radius, startAngle, endAngle);
          ctx.fill();

          ctx.strokeStyle = "rgb(255, 255, 255)";
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(x, y, radius, startAngle, endAngle);
          ctx.stroke();

          // ctx.fillStyle = "rgb(255, 255, 255)";
          ctx.fillStyle = "#000";
          ctx.font = "32px sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(index + 5, x, y);

          if (viewer) {
            const numberTexture = new THREE.CanvasTexture(
              document.querySelector("#number")
            );

            let annotationSpriteMaterial = new THREE.SpriteMaterial({
              map: numberTexture,
              // map: new THREE.TextureLoader().load("./img/circle.png"),
              depthTest: false,
              depthWrite: false,
              sizeAttenuation: false
            });

            const annotationSprite = new THREE.Sprite(annotationSpriteMaterial);
            annotationSprite.scale.set(0.066, 0.066, 0.066);

            annotationSprite.position.copy(JSON.parse(annotation.pivotPos));
            annotationSprite.name = "Annotation";
            // annotationSprite.userData.id = index + 1;
            annotationSprite.renderOrder = 1;

            // viewer.scene.scene.add(annotationSprite);

            const annotationDiv = document.createElement("div");
            annotationDiv.className = "annotationLabel";
            annotationDiv.id = `parent-${annotation.locationID}`;

            // annotationDiv.innerHTML = annotation.name;
            const onAnnotationClick = (event) => {
              console.log("Annotation clicked!", index, event);

              const elem = document.getElementById(annotation.locationID);
              console.log("click.elem", elem);

              if (elem != null) {
                elem.style.display =
                  elem.style.display === "none" ? "block" : "none";
              }
              gotoAnnotation2(annotation);
            };
            annotationDiv.innerHTML = index + 1;
            annotationDiv.addEventListener("click", onAnnotationClick);

            const annotationLabel = new CSS2DObject(annotationDiv);
            annotationLabel.position.copy(JSON.parse(annotation.pivotPos));

            const annotationDescription = document.createElement("div");
            annotationDescription.id = annotation.locationID;
            annotationDescription.className = "annotationDescription";
            annotationDescription.innerHTML = annotation.details;
            annotationDescription.style.display = "block";

            // const annoDesc = new CSS2DObject(annotationDescription);
            // annoDesc.position.copy(JSON.parse(annotation.pivotPos));

            annotationDiv.appendChild(annotationDescription);

            // viewer.scene.scene.add(annoDesc);
            viewer.scene.scene.add(annotationLabel);
          }
        });
      }
    },
    [loaded, viewer]
  );

  const getLocations = async () => {
    try {
      const res = await getAllLocations();
      console.log("fetched locations ", res);
      if (res) {
        setAnnotations(res.data);
        addAnnotationButton(res.data);
        res.data.forEach((val) => idArray.push(val.locationID));
      }
    } catch (e) {
      console.log("error in fetching the locations", e);
    }
  };

  const loadPCD = () => {
    window.Potree.loadPointCloud(url).then(
      (e) => {
        console.log("reached here", Potree);
        //let scene = viewer.scene;
        // let sceneSG = new Potree.Scene();
        let pointcloud = e.pointcloud;

        let material = pointcloud.material;

        material.activeAttributeName = "rgba";
        material.minSize = 2;
        material.pointSizeType = window.Potree.PointSizeType.FIXED;
        // pointcloud.position.set(292953.0, 3189901.0, 0);

        viewer.scene.addPointCloud(pointcloud);
        viewer.scene.view.position.set(
          714271.7360946385,
          3159965.0401465287,
          1041.280504619379
        );
        viewer.scene.view.lookAt(
          new THREE.Vector3(
            714292.5432325694,
            3159404.8444326725,
            201.40827129646675
          )
        );

        // sceneSG.addPointCloud(pointcloud);
        // sceneSG.view.position.set(
        //   714292.5432325694,
        //   3159404.8444326725,
        //   201.40827129646675
        // );
        // sceneSG.view.lookAt(
        //   new THREE.Vector3(
        //     714357.8192373302,
        //     3159915.5634305365,
        //     414.2782739819542
        //   )
        // );
        // viewer.setScene(sceneSG);
        viewer.renderer.localClippingEnabled = true;

        viewer.fitToScreen();
        // addAnnotationButton();

        console.log("This is the url", url);

        // viewer.setScene(sceneSG);
        // let aAbout1 = new Potree.Annotation({
        //   position: [292913.0, 3189955.66, 295.16],
        //   title: "Abcd annotation",
        //   cameraPosition: [590105.53, 231541.63, 782.05],
        //   cameraTarget: [292913.0, 3189955.66, 295.16],

        //   description: `<ul><li>Click on the annotation label to move a predefined view.</li>
        // 	<li>Click on the icon to execute the specified action.</li>
        // 	In this case, the action will bring you to another scene and point cloud.</ul>`
        // });

        // sceneSG.annotations.add(aAbout1);
        // updateCameraPosition();

        // viewer.scene.scene.add(sceneSG.annotations.add(aAbout1));
      },
      (e) => console.error("PCD.error ", e) // Corrected typo from "console.err" to "console.error"
    );
  };

  useEffect(() => {
    // const viewerElem = potreeContainer.current;

    if (Potree !== "undefined" && Potree !== undefined && Potree !== null) {
      const labelRendererInit = new CSS2DRenderer();
      // labelRendererInit.setSize("100%", "100%");

      labelRendererInit.setSize(window.innerWidth, window.innerHeight);
      labelRendererInit.domElement.style.position = "absolute";
      labelRendererInit.domElement.style.top = "0px";

      potreeContainer.current.appendChild(labelRendererInit.domElement); // Append it to your potree container or wherever appropriate
      setLabelRenderer(labelRendererInit);

      const viewercache = new Potree.Viewer(potreeContainer.current);
      setViewer(viewercache);
      console.log(viewercache, "viewer");
    } else {
      console.log("this.window", window);
      // const viewercache = new window.Potree.Viewer(potreeContainer.current);
      // setViewer(viewercache);
      // console.log(viewercache, "viewer");
      // var Potreecache = window.window.Potree.Viewer;
      // const viewercache = new Potreecache.Viewer(potreeContainer.current);
      // setViewer(viewercache);
    }

    // if (!potreeContainer.current) {
    //   setViewer(new Potree.Viewer(potreeContainer.current));
    // }

    // setViewer(new Potree.Viewer(potreeContainer.current));

    //
  }, [Potree]);

  useEffect(() => {
    console.log({ viewer });
    if (viewer !== "undefined" && viewer !== undefined && viewer !== null) {
      setLoaded(true);
      setUrl(
        "https://digital-twin-assets.s3.ap-south-1.amazonaws.com/IITD/metadata.json"
      );
      run_once(viewer);
    }
  }, [viewer]);
  useEffect(() => {
    console.log("changed.url", window.Potree);
    if (viewer !== "undefined" && viewer !== undefined && viewer !== null) {
      clearViewer(viewer);
      getLocations();
      Potree.loadPointCloud(url).then(
        (e) => {
          console.log("reached here", Potree);
          //let scene = viewer.scene;
          // let sceneSG = new Potree.Scene();
          let pointcloud = e.pointcloud;

          let material = pointcloud.material;

          material.activeAttributeName = "rgba";
          material.minSize = 2;
          material.pointSizeType = Potree.PointSizeType.FIXED;
          // pointcloud.position.set(292953.0, 3189901.0, 0);

          viewer.scene.addPointCloud(pointcloud);
          viewer.scene.view.position.set(
            714271.7360946385,
            3159965.0401465287,
            1041.280504619379
          );
          viewer.scene.view.lookAt(
            new THREE.Vector3(
              714292.5432325694,
              3159404.8444326725,
              201.40827129646675
            )
          );

          // sceneSG.addPointCloud(pointcloud);
          // sceneSG.view.position.set(
          //   714292.5432325694,
          //   3159404.8444326725,
          //   201.40827129646675
          // );
          // sceneSG.view.lookAt(
          //   new THREE.Vector3(
          //     714357.8192373302,
          //     3159915.5634305365,
          //     414.2782739819542
          //   )
          // );
          // viewer.setScene(sceneSG);
          viewer.renderer.localClippingEnabled = true;

          viewer.fitToScreen();
          // addAnnotationButton();

          console.log("This is the url", url);

          // viewer.setScene(sceneSG);
          // let aAbout1 = new Potree.Annotation({
          //   position: [292913.0, 3189955.66, 295.16],
          //   title: "Abcd annotation",
          //   cameraPosition: [590105.53, 231541.63, 782.05],
          //   cameraTarget: [292913.0, 3189955.66, 295.16],

          //   description: `<ul><li>Click on the annotation label to move a predefined view.</li>
          // 	<li>Click on the icon to execute the specified action.</li>
          // 	In this case, the action will bring you to another scene and point cloud.</ul>`
          // });

          // sceneSG.annotations.add(aAbout1);
          // updateCameraPosition();

          // viewer.scene.scene.add(sceneSG.annotations.add(aAbout1));
        },
        (e) => console.error("PCD.error ", e) // Corrected typo from "console.err" to "console.error"
      );
      viewer.addEventListener("update", updateViewerCallback);
      // viewer.addEventListener();
    }

    // return () => {
    //   second
    // }
  }, [url]);

  const run_once = (viewer) => {
    viewer.setEDLEnabled(true);
    viewer.setFOV(60);
    viewer.setPointBudget(1 * 1000 * 1000);
    viewer.setClipTask(Potree.ClipTask.SHOW_INSIDE);
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
  const [statusProperties, setStatusProperties] = useState({
    position: "",
    rotation: "",
    camera: "",
    pointSize: "",
    pointCount: "",
    visiblePoints: "",
    progress: 0,
    downloading: false,
    message: ""
  });

  const ForceRender = () => {
    setForceRender((prev) => !prev);
  };

  const makeFullScreen = () => {
    setFullScreen(true);
    console.log("full Screen is called");
    if (
      potreeContainer != undefined &&
      potreeContainer !== null &&
      divContainer != null
    ) {
      const element = divContainer.current;
      if (element && element.requestFullscreen) {
        element.requestFullscreen();
      } else if (element && element.mozRequestFullScreen) {
        /* Firefox */
        element.mozRequestFullScreen();
      } else if (element && element.webkitRequestFullscreen) {
        /* Chrome, Safari and Opera */
        element.webkitRequestFullscreen();
      } else if (element && element.msRequestFullscreen) {
        /* IE/Edge */
        element.msRequestFullscreen();
      }
    }
  };

  const exitFullScreen = () => {
    console.log("Exit fullscreen is called");
    setFullScreen(false);
    if (
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement
    ) {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        /* Firefox */
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        /* Chrome, Safari and Opera */
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        /* IE/Edge */
        document.msExitFullscreen();
      }
    } else {
      console.log("Document is not in fullscreen mode");
    }
  };

  const handleResize = () => {
    console.log("viewer.resize", viewer);
    // if (viewer != null) {
    //   console.log("resize.called");

    //   clearViewer();
    // }
    // removeAnnotationElement();
    setContainerHeight(window.innerHeight);
    // removeAnnotationElement();

    // clearViewer();

    // addAnnotationButton();
  };

  useEffect(() => {
    // const handleResize = () => {
    //   if (viewer != null) {
    //     console.log("resize.called");

    //     clearViewer();
    //   }
    //   setContainerHeight(window.innerHeight);
    //   // removeAnnotationElement();

    //   // clearViewer();

    //   // addAnnotationButton();
    // };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <div
        ref={divContainer}
        style={{
          background: "#000",
          display: "flex",
          flexDirection: "column",
          height: containerHeight,
          position: "relative",
          top: "0px",
          overflow: "hidden",
          left: "0px"
        }}
      >
        <Box
          id="potreeBox"
          ref={potreeContainer}
          style={{ height: "100%", width: "100%" }}
        >
          {" "}
        </Box>
        <canvas id="number" width="64" height="64"></canvas>
        {cameraState !== null ? (
          <Box>
            <Typography
              variant="subtitle2"
              sx={{
                color: "white",
                position: "absolute",
                top: "10px",
                left: "10px",
                zIndex: "100",
                fontWeight: "bold"
              }}
            >
              {/* let position = viewer.scene.view.position.toArray().join(", ");
      let pivot_point = viewer.scene.view.getPivot().toArray().join(", "); */}
              position: {cameraState.position}
              {/* position:{viewer.scene.view.position.toArray().join(",")} */}
            </Typography>
            <Typography
              variant="subtitle2"
              sx={{
                color: "white",
                position: "absolute",
                top: "30px",
                left: "10px",
                zIndex: "100",
                fontWeight: "bold"
              }}
            >
              pivot_point: {cameraState.pivot_point}
              {/* pivot_point:{viewer.scene.view.getPivot().toArray().join(",")} */}
            </Typography>
          </Box>
        ) : null}

        <PotreeSidebar
          loaded={loaded}
          url={url}
          setUrl={setUrl}
          setForceRender={setForceRender}
          forceRender={forceRender}
          viewer={viewer}
          setViewer={setViewer}
          clearViewer={clearViewer}
          Potree={Potree}
          setStatusProperties={setStatusProperties}
          makeFullScreen={makeFullScreen}
          fullScreen={fullScreen}
          exitFullScreen={exitFullScreen}
          labelRenderer={labelRenderer}
          potreeContainer={potreeContainer}
        />
        <Box
          sx={{
            // position: "absolute",
            // top: 10,
            // left: 0,

            // width: "100%",

            zIndex: 5
          }}
        >
          <InfoNavBar gotoAnnotation={gotoAnnotation2} />
        </Box>

        {statusProperties.downloading ? (
          <Box
            sx={{
              position: "absolute",
              top: "0px",
              left: "0px",
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              backgroundColor: "rgba(0,0,0,0.5)",
              zIndex: "100"
            }}
          >
            <Typography
              sx={{
                color: "#fff",
                fontSize: "24px !important"
              }}
            >
              Downloading Model from Cloud
            </Typography>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                width: "50%",
                borderRadius: "10px"
              }}
            >
              <CustomProgressBar statusProperties={statusProperties} />
            </Box>
          </Box>
        ) : null}
      </div>
    </>
  );
};

export default PotreeViewer;
