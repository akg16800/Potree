import { useCallback, useEffect, useState } from "react";
import { makeStyles } from "@mui/styles";
import Icon from "@material-ui/core/Icon";
// import { Box, Tooltip, Typography } from "@material-ui/core";
import { Button, Box, Tooltip, Typography } from "@mui/material";
import { NearMe } from "@mui/icons-material";
import * as THREE from "three";
import { ObjectLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
import RefreshIcon from "@mui/icons-material/Refresh";
import { IconButton } from "@material-ui/core";
import OpenInFullIcon from "@mui/icons-material/OpenInFull";
import SettingsIcon from "@mui/icons-material/Settings";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import CenterFocusStrongIcon from "@mui/icons-material/CenterFocusStrong";
import CloseFullscreenIcon from "@mui/icons-material/CloseFullscreen";
// import EventTrackingHook from "./hooks/EventTrackingHook";

import DoneIcon from "@mui/icons-material/Done";
import CancelIcon from "@mui/icons-material/Cancel";
import {
  CSS2DObject,
  CSS2DRenderer
} from "three/examples/jsm/renderers/CSS2DRenderer.js";
// import { Tween } from "@tweenjs/tween.js";
import * as TWEEN from "@tweenjs/tween.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import AddLocationAltIcon from "@mui/icons-material/AddLocationAlt";
import NearMeIcon from "@mui/icons-material/NearMe";
import CustomModal from "./AnnotationModal";
import LocationBox from "./LocationBox";
import { postEventActivity } from "../utils/api";

// import material_mtl from "../assets/NH9-6-24-2023-textured_model/odm_textured_model_geo.mtl";
// import object_obj from "../assets/NH9-6-24-2023-textured_model/odm_textured_model_geo.obj";
// import object_glb from "../assets/NH9-6-24-2023-textured_model/object.glb";

// import material_mtl1 from "../assets/esp_model/odm_texturing/odm_textured_model_geo.mtl";
// import object_obj1 from "../assets/esp_model/odm_texturing/odm_textured_model_geo.obj";
// import point_cloud from "../assets/esp_model/entwine_pointcloud/ept.json";

const useStyles = makeStyles(() => ({
  root: {
    position: "absolute",
    top: 0,
    right: 0,
    margin: "8px",
    display: "grid",
    background: "#252525"
    // padding: '10px'
  },
  bottomIcons: {
    position: "absolute",
    bottom: 0,
    right: 0,
    margin: "8px",
    // marginRight:""
    display: "flex",
    alignItems: "center",
    borderRadius: "10px",
    opacity: 0.8
    // background: "#252525",
  },
  middleIcons: {
    bottom: 0,
    position: "absolute",
    margin: "8px",
    // width: "100%",
    // width: window.innerWidth,
    width: "98%",
    // overflow: "hidden",
    display: "flex",
    justifyContent: "center"
  },
  iconRoot: {
    textAlign: "center"
  },
  imageIcon: {
    // display: "flex",
    // height: "inherit",
    // width: "inherit",
    width: "15px"
  },
  iconBtn: {
    " .MuiButtonBase-root MuiIconButton-root": {
      padding: "0px !important"
    },
    ".MuiIconButton-root": {
      padding: "0px !important"
    }
  }
}));

const annotations = [
  {
    title: "Bathroom Sink",
    description: "<p>Bathroom Sink is good for washing your hands</p>",
    camPos: {
      x: 29209.48,
      y: 3189950.63,
      z: 290.76
    },
    // 292913.0, 3189955.66, 295.16
    // 292909.48699951184, 3189950.636001587, 290.76900100702835

    // 292890.09464662883, 3189908.1521291765, 308.9588120437726
    lookAt: {
      x: 292913,
      y: 3189955.66,
      z: 295.16
    },
    descriptionDomElement: {}
  },
  {
    title: "Bath",
    camPos: {
      x: 7.13,
      y: 4.33,
      z: 1.98
    },
    lookAt: {
      x: 8.32,
      y: 2.71,
      z: 1.33
    }
  },
  {
    title: "Radiator",
    description: "Keeps you warm in winter.",
    camPos: {
      x: 7.13,
      y: 1.15,
      z: 0.66
    },
    lookAt: {
      x: 5.78,
      y: 0.89,
      z: 0.68
    },
    descriptionDomElement: {}
  },
  {
    title: "Sky Light",
    camPos: {
      x: 13.05,
      y: 4.35,
      z: 5.06
    },
    lookAt: {
      x: 11,
      y: 2.7,
      z: 3.42
    }
  }
];

export default function PotreeToolbar(props) {
  const {
    loaded,
    viewer,
    setViewer,
    url,
    setUrl,
    Potree,
    setStatusProperties,
    setForceRender,
    forceRender,
    makeFullScreen,
    exitFullScreen,
    fullScreen,
    clearViewer,
    labelRenderer,
    potreeContainer
  } = props;
  // console.log({ viewer, Potree });
  const classes = useStyles();
  const [annotationMarkers, setAnnotationMarkers] = useState([]);

  const [coordinate, setCoordinate] = useState([292953.0, 3189901.0, 0]);

  const measurePoint = useCallback(() => {
    if (loaded && viewer) {
      // Assuming you have a function to handle measurement completion
      // const handleMeasurementComplete = (measurementData) => {
      //   console.log("Measurement Data:", measurementData);
      // };
      console.log("measure.tool", viewer);
      // viewer.measuringTool.clearMarkers();

      // Start the measuring tool
      viewer.measuringTool.startInsertion({
        showDistances: true,
        showAngles: true,
        showCoordinates: true,
        showArea: false,
        closed: true,
        maxMarkers: 1,
        name: "Point"
      });
    }
  }, [loaded, viewer]);

  const measureDistance = useCallback(() => {
    if (loaded && viewer) {
      viewer.measuringTool.startInsertion({
        showDistances: true,
        showArea: false,
        closed: false,
        name: "Distance"
      });
    }
  }, [loaded, viewer]);

  const measureHeight = useCallback(() => {
    if (loaded && viewer) {
      viewer.measuringTool.startInsertion({
        showDistances: true,
        showHeight: true,
        showArea: true,
        closed: false,
        maxMarkers: 2,
        name: "Height"
      });
    }
  }, [loaded, viewer]);

  const measureCrossSection = useCallback(() => {
    if (loaded && viewer) {
      // var g_base = [
      //   [1 / 6, new THREE.Color(0, 0, 1)],
      //   [2 / 6, new THREE.Color(0, 1, 1)],
      //   [3 / 6, new THREE.Color(0, 1, 0)],
      //   [4 / 6, new THREE.Color(1, 1, 0)],
      //   [5 / 6, new THREE.Color(1, 0.64, 0)],
      //   [1, new THREE.Color(1, 0, 0)],
      // ];
      // var gradient = [];
      // for (var i = 0; i < g_base.length * 10; i++) {
      //   var idx = i % g_base.length;
      //   var g = g_base[idx];
      //   var gr = g[0] / 10 + parseInt(i / g_base.length) / 10;
      //   gradient.push([gr, g[1]]);
      // }

      // const profile = viewer.profileTool.startInsertion();
      // viewer.profileWindow.show();
      // viewer.profileWindowController.setProfile(profile);
      viewer.scene.pointclouds.forEach((pointcloud) => {
        if (pointcloud.material.activeAttributeName === "rgba") {
          pointcloud.material.activeAttributeName = "elevation";
          pointcloud.material.gradient = Potree.Gradients.RAINBOW;
          // pointcloud.material.gradient = Potree.Gradients.TURBO;
          // pointcloud.material.gradient = gradient;
          pointcloud.material.elevationRange = [-1, 10];
        } else {
          pointcloud.material.activeAttributeName = "rgba";
        }
      });
    }
  }, [loaded, viewer]);

  const clipHeight = useCallback(() => {
    if (loaded && viewer) {
      // viewer.clipTask = Potree.ClipTask.SHOW_INSIDE;
      // viewer.clipMethod = Potree.ClipMethod.INSIDE_ANY;
      let volume = new Potree.BoxVolume();
      volume.name = "Visible";
      volume.scale.set(178.04, 159.14, 320 - 112);
      // volume.position.set(589877.2, 231374.01, 749.62);
      volume.position.set(coordinate[0], coordinate[1], 290);
      volume.clip = true;
      //volume.visible = false;

      viewer.scene.addVolume(volume);
      viewer.setClipTask(Potree.ClipTask.SHOW_INSIDE);
      // viewer.setClipBoxes([]);
      // viewer.dispatchEvent({ type: "clip_volume_changed" });
    }
  }, [loaded, viewer]);

  const add3DModel = useCallback(() => {
    const addObject = (object, offset) => {
      object.translateX(offset.x);
      object.translateY(offset.y);

      viewer.scene.scene.add(object);

      // this.modelReference = object;
      // this.setPointCloudsVisible(false);

      // this.setState({
      //   initializingModel: false,
      // });
    };
    // viewer.scene.scene.add(THREE.Mesh());
    console.log("add3DModel");

    if (loaded && viewer) {
      console.log("add3DModel");

      let manager = new THREE.LoadingManager();
      manager.onProgress = function (item, loaded, total) {
        console.log(item, loaded, total);
        console.log("add3DModel");
      };

      let onProgress = function (xhr) {
        if (xhr.lengthComputable) {
          let percentComplete = (xhr.loaded / xhr.total) * 100;
          if (Math.round(percentComplete, 2) === 100) {
            setStatusProperties((prev) => ({
              ...prev,
              downloading: false,
              progress: Math.round(percentComplete, 2)
            }));
            // addLighting();
          } else {
            setStatusProperties((prev) => ({
              ...prev,
              downloading: true,
              progress: Math.round(percentComplete, 2)
            }));
          }

          console.log(Math.round(percentComplete, 2) + "% downloaded");
        }
      };
      let onError = function (xhr) {};
      viewer.renderer.localClippingEnabled = true;

      let mtlLoader = new MTLLoader();
      var resourcePath =
        "https://digital-twin-assets.s3.ap-south-1.amazonaws.com/obj_scan/";
      var resourcePath1 =
        "https://digital-twin-assets.s3.ap-south-1.amazonaws.com/esp_model/odm_texturing/";

      mtlLoader.setResourcePath(resourcePath1);
      var normal = new THREE.Vector3(0, 0, -1);
      var constant = -normal.dot(
        new THREE.Vector3(coordinate[0], coordinate[1], 290)
      );

      var localPlane = new THREE.Plane(normal, constant);
      // localPlane.applyMatrix4(viewer.scene.scene.matrixWorld);

      var localPlane2 = new THREE.Plane(
        new THREE.Vector3(0, -1, 0),
        coordinate[1]
      );
      var localPlanes = [localPlane2];

      mtlLoader.load(
        "https://digital-twin-assets.s3.ap-south-1.amazonaws.com/esp_model/odm_texturing/odm_textured_model.mtl",
        (materials) => {
          materials.preload();
          console.log(materials);

          // materials.alphaTest = 0.5;

          let objLoader = new OBJLoader(manager);
          objLoader.setMaterials(materials);
          objLoader.load(
            // object_obj1,
            "https://digital-twin-assets.s3.ap-south-1.amazonaws.com/esp_model/odm_texturing/odm_textured_model_geo.obj",
            (object) => {
              object.traverse(function (child) {
                if (child instanceof THREE.Mesh) {
                  console.log(child, "child");
                  // Apply clipping planes to each mesh's material
                  if (Array.isArray(child.material)) {
                    for (let i = 0; i < child.material.length; i++) {
                      // child.material[i].clippingPlanes = [localPlane2];
                      child.material[i].clipShadows = true;
                      // Other properties like side, transparent, etc. can also be set here if needed
                    }
                  } else {
                    // If it's not an array, just apply it directly
                    child.material.clippingPlanes = [localPlane2];
                    child.material.clipShadows = true;
                    // Other properties like side, transparent, etc. can also be set here if needed
                  }
                  // child.material.clippingPlanes = localPlanes;
                  // child.material.clipShadows = true;
                }
              });
              object.position.set(coordinate[0], coordinate[1], coordinate[2]);

              object.scale.multiplyScalar(1);
              object.castShadow = true;
              viewer.scene.scene.add(object);

              console.log(object, "object");
              console.log(viewer, "viewer");
            },
            onProgress,
            onError
          );
        }
      );
    }
  }, [loaded, viewer]);
  const getCurrentDateTime = () => {
    const now = new Date();

    const day = String(now.getDate()).padStart(2, "0");
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    return `${day} ${month} ${year} ${hours}:${minutes}:${seconds}`;
  };

  const eventPosting = (eventId) => {
    let eventDetails = {};
    if (eventId == "new_annotation-01") {
      eventDetails = {
        eventName: "New Annotation Making",
        time: getCurrentDateTime(),
        description: "For new Annotation making",
        location: localStorage.getItem("latitude")
          ? [
              localStorage.getItem("latitude"),
              localStorage.getItem("longitude")
            ]
          : null
      };
    } else if (eventId == "questions-02") {
      eventDetails = {
        eventName: "Asking questions",
        time: getCurrentDateTime(),
        description:
          "User has some questions which he wants to clear off by asking",
        location: localStorage.getItem("latitude")
          ? [
              localStorage.getItem("latitude"),
              localStorage.getItem("longitude")
            ]
          : null
      };
    } else if (eventId == "settings-03") {
      eventDetails = {
        eventName: "Settings",
        time: getCurrentDateTime(),
        description: "user wants to see the settings",
        location: localStorage.getItem("latitude")
          ? [
              localStorage.getItem("latitude"),
              localStorage.getItem("longitude")
            ]
          : null
      };
    } else if (eventId == "fullScreen-04") {
      eventDetails = {
        eventName: "Full Screen",
        time: getCurrentDateTime(),
        description: "User toggled the full Screen view or minimized View",
        location: localStorage.getItem("latitude")
          ? [
              localStorage.getItem("latitude"),
              localStorage.getItem("longitude")
            ]
          : null
      };
    } else if (eventId == "reload-08") {
      eventDetails = {
        eventName: "Reload Model",
        time: getCurrentDateTime(),
        description:
          "Its getting reloaded on first time or to change the model from viewer",
        location: localStorage.getItem("latitude")
          ? [
              localStorage.getItem("latitude"),
              localStorage.getItem("longitude")
            ]
          : null
      };
    }

    console.log("event.Details is", eventDetails);
    postEventActivity(eventId, eventDetails);
  };

  const addAnnotationButton = useCallback(() => {
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

    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.font = "32px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("1", x, y);
    if (loaded && viewer) {
      // const numberTexture = new THREE.CanvasTexture(
      //   document.querySelector("#number")
      // );
      // new THREE.TextureLoader().load("./img/circle.png"),
      let annotationSpriteMaterial = new THREE.SpriteMaterial({
        // map: numberTexture,
        map: new THREE.TextureLoader().load("./img/circle.png"),
        depthTest: false,
        depthWrite: false,
        sizeAttenuation: false
      });
      let a = 0;
      const annotationSprite = new THREE.Sprite(annotationSpriteMaterial);
      annotationSprite.scale.set(0.066, 0.066, 0.066);
      annotationSprite.addEventListener("", function () {
        console.log("anno.button pressed");
      });
      let positionPoint = new THREE.Vector3(292913.0, 3189955.66, 295.16);
      // annotationSprite.position.set(
      //   positionPoint.x,
      //   positionPoint.y,
      //   positionPoint.z
      // );
      annotationSprite.position.copy(annotations[a].lookAt);
      annotationSprite.name = "Annotation";
      annotationSprite.userData.id = a;
      annotationSprite.renderOrder = 1;
      // annotationMarkers.push(annotationSprite);
      setAnnotationMarkers(annotationSprite);

      viewer.scene.scene.add(annotationSprite);

      const annotationDiv = document.createElement("div");
      annotationDiv.className = "annotationLabel";
      annotationDiv.innerHTML = `<p>Annotation</p>`;
      // const button = document.createElement("button");
      // button.textContent = "Click me";
      // button.addEventListener("click", function () {
      //   // btnClick(annotations[a]);
      //   console.log("btn.anno is pressed");
      // });

      // // Append the button to the annotationDiv
      // annotationDiv.appendChild(button);
      const annotationLabel = new CSS2DObject(annotationDiv);
      annotationLabel.position.copy(annotations[a].lookAt);

      const annotationDescription = document.createElement("div");
      annotationDescription.className = "annotationDescription";
      annotationDescription.innerHTML = `<p>Click on the annotation </p>`;
      // annotationDescription.addEventListener("click", function () {
      //   btnClick(annotations[a]);
      // });
      annotationDiv.appendChild(annotationDescription);
      annotationDescription.style.display = "block";
      // annotationDescription.onclick()
      viewer.scene.scene.add(annotationLabel);

      // annotationDiv.addEventListener("mouseenter", () => {
      //   annotationDescription.style.display = "block";
      // });
      // annotationDiv.addEventListener("mouseleave", () => {
      //   annotationDescription.style.display = "none";
      // });
    }
  }, [loaded, viewer]);

  const btnClick = (e) => {
    console.error("btn.clicked", e);
  };

  const addLighting = useCallback(() => {
    // const loadGltf = (url, cb) => {
    //   if (!this.gltfLoader) this.gltfLoader = new GLTFLoader();
    //   if (!this.dracoLoader) {
    //     this.dracoLoader = new DRACOLoader();
    //     this.dracoLoader.setDecoderPath("/static/app/js/vendor/draco/");
    //     this.gltfLoader.setDRACOLoader(this.dracoLoader);
    //   }

    //   // Load a glTF resource
    //   this.gltfLoader.load(
    //     url,
    //     (gltf) => {
    //       cb(null, gltf);
    //     },
    //     (xhr) => {
    //       // called while loading is progressing
    //     },
    //     (error) => {
    //       cb(error);
    //     }
    //   );
    // };
    if (loaded && viewer) {
      var ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
      var directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      var pointLight = new THREE.PointLight(0xffffff, 0.8);

      ambientLight.position.set(coordinate[0], coordinate[1], 0);
      directionalLight.position.set(coordinate[0], coordinate[1], 99999999999);
      directionalLight.target.position.set(
        coordinate[0],
        coordinate[1],
        coordinate[2]
      );

      pointLight.position.set(coordinate[0], coordinate[1], 320);

      viewer.scene.scene.add(ambientLight);
      viewer.scene.scene.add(directionalLight);
      viewer.scene.scene.add(directionalLight.target);
      viewer.scene.scene.add(pointLight);
    }
  }, [loaded, viewer]);

  const addCube_Plane = useCallback(() => {
    // viewer.scene.scene.add(THREE.Mesh());
    console.log("add3DModel");
    if (loaded && viewer) {
      viewer.renderer.localClippingEnabled = true;
      const geometry = new THREE.PlaneGeometry(100, 100);
      const boxGeometry = new THREE.BoxGeometry(10, 10, 10);
      const edgesGeometry = new THREE.EdgesGeometry(boxGeometry);
      const boxmaterial = new THREE.LineBasicMaterial();
      const wireframe = new THREE.LineSegments(edgesGeometry, boxmaterial);

      var height = 200;
      var clipping_height = height + 1;

      var localPlane2 = new THREE.Plane(
        new THREE.Vector3(0, -1, 0),
        coordinate[1]
      );
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshBasicMaterial({
        color: 0x0000ff,
        side: THREE.DoubleSide
      });
      const finitePlane = new THREE.Mesh(planeGeometry, planeMaterial);

      // Position it at the same height as the clipping plane
      finitePlane.position.set(coordinate[0], coordinate[1], clipping_height);
      viewer.scene.scene.add(finitePlane);

      var localPlanes = [localPlane2];

      const material = new THREE.MeshBasicMaterial({
        color: 0xff2b2b,
        side: THREE.DoubleSide,
        clippingPlanes: localPlanes,
        clipShadows: true
      });
      const planeMesh = new THREE.Mesh(geometry, material);
      planeMesh.position.set(coordinate[0], coordinate[1], height);
      // planeMesh.rotation.x = Math.PI / 2; // Rotate to face up
      // plane.geometry.center();
      wireframe.position.set(coordinate[0], coordinate[1], height);
      viewer.scene.scene.add(planeMesh);
      viewer.scene.scene.add(wireframe);

      // Optionally, add a PlaneHelper to visualize the clipping plane
      const helper = new THREE.PlaneHelper(localPlane2, 10000, 0xff0000);
      viewer.scene.scene.add(helper);

      const directional2 = new THREE.DirectionalLight(0xffffff, 1.0);
      directional2.position.set(293312.7751053024, 3190545.2699114326, 10);
      directional2.lookAt(293312.7751053024, 3190545.2699114326, 0);

      const ambient = new THREE.AmbientLight(0x555555);

      viewer.scene.scene.add(directional2);
      viewer.scene.scene.add(ambient);

      // const directional3 = new THREE.DirectionalLight(0xffffff, 1.0);
      // directional3.position.set(292504.5715631746, 3189737.0663693049, 10);
      // directional3.lookAt(292504.5715631746, 3189737.0663693049, 0);
      // viewer.scene.scene.add(directional3);
    }
  }, [loaded, viewer]);

  const visiblePointCloud = useCallback(() => {
    if (loaded && viewer) {
      viewer.setEDLEnabled(true);

      // Using opacity we can still perform measurements
      viewer.setEDLOpacity(!viewer.edlOpacity);
    }
  }, [loaded, viewer]);

  const orbitControls = useCallback(() => {
    if (loaded && viewer) {
      viewer.setControls(viewer.orbitControls);
      viewer.scene.view.lookAt(0, 0, 0);
    }
  }, [loaded, viewer]);

  const measureCircle = useCallback(() => {
    if (loaded && viewer) {
      viewer.measuringTool.startInsertion({
        showDistances: false,
        showHeight: false,
        showArea: false,
        showCircle: true,
        showEdges: false,
        closed: false,
        maxMarkers: 3,
        name: "Circle"
      });
    }
  }, [loaded, viewer]);

  const measureAngle = useCallback(() => {
    if (loaded && viewer) {
      viewer.measuringTool.startInsertion({
        showDistances: false,
        showAngles: true,
        closed: true,
        name: "angle"
      });
    }
  }, [loaded, viewer]);

  const measureArea = useCallback(() => {
    if (loaded && viewer) {
      viewer.measuringTool.startInsertion({
        showArea: true,
        closed: true,
        name: "area"
      });
    }
  }, [loaded, viewer]);

  const polygon = useCallback(() => {
    if (loaded && viewer) {
      viewer.measuringTool.startInsertion({
        showArea: true,
        closed: true,
        minMarkers: 4,
        name: "polygon"
      });
    }
  }, [loaded, viewer]);

  const urlChange = (e) => {
    // if (
    //   url ===
    //   "https://digital-twin-assets.s3.ap-south-1.amazonaws.com/IITD/metadata.json"
    // ) {
    //   setUrl(
    //     // "https://digital-twin-assets.s3.ap-south-1.amazonaws.com/dalpatpur_large2/metadata.json"
    //     // "https://digital-twin-assets.s3.ap-south-1.amazonaws.com/warehouse/metadata.json"
    //     // "https://digital-twin-assets.s3.ap-south-1.amazonaws.com/esp_model/entwine_pointcloud/ept.json"
    //     "https://digital-twin-assets.s3.ap-south-1.amazonaws.com/IITD/metadata.json"
    //   );
    // } else {
    //   setUrl(
    //     "https://digital-twin-assets.s3.ap-south-1.amazonaws.com/IITD/metadata.json"
    //   );
    // }
    // clearViewer(viewer);
    // setUrl(
    //   "https://digital-twin-assets.s3.ap-south-1.amazonaws.com/IITD/metadata.jsonn"
    // );
  };

  const [target, setTarget] = useState(false);
  const [showModal, setModal] = useState(false);
  const [positions, setPositions] = useState({
    cameraPos: null,
    pivotPos: null
  });

  const handleClose = () => {
    setModal(false);
  };

  const handleDoubleClick = () => {
    console.log("eventListner.doubleClick");
    setModal(true);
  };

  return (
    // <ButtonGroup className={classes.root} variant="contained" color="default">
    //     <Button onClick={measurePoint}>
    //         <Icon className={classes.iconRoot}>
    //             <img
    //                 className={classes.imageIcon}
    //                 src="./icons/point.svg"
    //                 alt="point"
    //             />
    //         </Icon>
    //     </Button>
    //     <Button onClick={measureDistance}>
    //         <Icon className={classes.iconRoot}>
    //             <img
    //                 className={classes.imageIcon}
    //                 src="./icons/distance.svg"
    //                 alt="distance"
    //             />
    //         </Icon>
    //     </Button>
    //     <Button onClick={measureHeight}>
    //         <Icon className={classes.iconRoot}>
    //             <img
    //                 className={classes.imageIcon}
    //                 src="./icons/height.svg"
    //                 alt="height"
    //             />
    //         </Icon>
    //     </Button>
    //     <Button onClick={measureCrossSection}>
    //         <Icon className={classes.iconRoot}>
    //             <img
    //                 className={classes.imageIcon}
    //                 src="./icons/profile.svg"
    //                 alt="profile"
    //             />
    //         </Icon>
    //     </Button>
    //     <Button onClick={orbitControls}>
    //         <Icon className={classes.iconRoot}>
    //             <img
    //                 className={classes.imageIcon}
    //                 src="./icons/orbit_controls.svg"
    //                 alt="orbit_controls"
    //             />
    //         </Icon>
    //     </Button>
    //     <Button onClick={urlChange}>
    //         <Icon className={classes.iconRoot}>
    //             <img
    //                 className={classes.imageIcon}
    //                 src="./icons/assign.svg"
    //                 alt="orbit_controls"
    //             />
    //         </Icon>
    //     </Button>
    // </ButtonGroup>
    <>
      {/* <Typography style={{position: 'absolute',top: '0px',left: '0px',color: '#fff'}}>Potree</Typography> */}
      <Box className={classes.middleIcons}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            background: "#252525",
            marginRight: "5px",
            borderRadius: "2rem"
          }}
        >
          <Button
            onClick={() => {
              urlChange();
              eventPosting("reload-08");
            }}
          >
            <Tooltip title="Reload 3D View" placement="top">
              <IconButton
                sx={{
                  padding: "0px !important"
                }}
              >
                <RefreshIcon sx={{ color: "#fff" }} />
              </IconButton>
            </Tooltip>
          </Button>
        </Box>
      </Box>

      {showModal && (
        <>
          <Box
            sx={{
              position: "absolute",
              display: "flex",
              width: "100%",
              top: "8px",
              justifyContent: "center"
              // left: "0px"
            }}
          >
            <Box
              sx={{
                background: "#202020",
                opacity: 0.8,
                color: "#fff",
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #DCDCDC",
                display: "flex",
                width: "30%",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: "bold", fontSize: "15px" }}
              >
                Please Double Tap to Select the Target and adjust Camera
              </Typography>
              {/* <Box>
              <IconButton
                className={classes.iconBtn}
                sx={{ padding: "0px !important" }}
                onClick={() => {
                  // let position = viewer.scene.view.position
                  //   .toArray()
                  //   .join(", ");
                  // let pivot_point = viewer.scene.view
                  //   .getPivot()
                  //   .toArray()
                  //   .join(", ");

                  let position = viewer.scene.view.position;

                  let pivot_point = viewer.scene.view.getPivot();

                  setPositions({
                    cameraPos: position,
                    pivotPos: pivot_point
                  });
                  console.log("selected.targets", position, " ", pivot_point);
                  setModal(true);
                  setTarget(false);
                }}
              >
                <DoneIcon
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.20)";
                    // e.currentTarget.style.background = "#FFF"; // Change background color on hover
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    // e.currentTarget.style.background = "#DCDCDC"; // Revert background color on mouse leave
                  }}
                  sx={{
                    cursor: "pointer",
                    padding: "2px",
                    marginRight: "10px",
                    background: "green",
                    borderRadius: "4px",
                    color: "#fff"
                  }}
                />
              </IconButton>
              <IconButton
                className={classes.iconBtn}
                sx={{ padding: "0px !important" }}
                onClick={() => setTarget(false)}
              >
                <CancelIcon
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.20)";
                    // e.currentTarget.style.background = "#FFF"; // Change background color on hover
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    // e.currentTarget.style.background = "#DCDCDC"; // Revert background color on mouse leave
                  }}
                  sx={{
                    cursor: "pointer",
                    background: "#f55b27",
                    padding: "2px",
                    opacity: 1,
                    borderRadius: "4px",
                    color: "#fff"
                  }}
                />
              </IconButton>
            </Box> */}
            </Box>
          </Box>
          <Box
            sx={{
              position: "absolute",
              top: "8px",
              right: "0px",
              opacity: 0.95,
              background: "#fff",
              margin: "2px",
              border: "0.4px solid #fff",
              borderRadius: "8px",
              width: "20%",
              zIndex: 15
            }}
          >
            <LocationBox viewer={viewer} handleClose={handleClose} />
          </Box>
        </>
      )}

      <Box className={classes.bottomIcons}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            background: "#252525",
            marginRight: "5px",
            borderRadius: "10rem",
            color: "#fff",
            padding: "0.15rem",
            "@media (max-width: 600px)": {
              flexDirection: "column",
              width: "35px"
            }
          }}
        >
          <Button
            id="new_annotation-01"
            disabled={viewer != null && loaded ? false : true}
            onClick={() => {
              eventPosting("new_annotation-01");
              if (viewer != null && loaded) {
                setModal(true);
              }
            }}
          >
            <Tooltip title="Add annotation" placement="top">
              <AddLocationAltIcon sx={{ color: "#fff" }} />
            </Tooltip>
          </Button>
          <Button
            id="questions-02"
            onClick={() => {
              eventPosting("questions-02");

              measureHeight();
            }}
          >
            <Tooltip title="Help and Questions" placement="top">
              <QuestionMarkIcon sx={{ color: "#fff" }} />
            </Tooltip>
          </Button>
          <Button
            id="settings-03"
            onClick={() => {
              eventPosting("settings-03");
            }}
          >
            <Tooltip title="Setting" placement="top">
              <SettingsIcon sx={{ color: "#fff" }} />
            </Tooltip>
          </Button>
          {/* <Button onClick={() => setForceRender(!forceRender)}>
            <Tooltip title="Center Focus" placement="top">
              <CenterFocusStrongIcon sx={{ color: "#fff" }} />
            </Tooltip>
          </Button> */}

          <Button
            id="fullScreen-04"
            onClick={() => {
              eventPosting("fullScreen-04");
              !fullScreen ? makeFullScreen() : exitFullScreen();
            }}
          >
            <Tooltip title="Full Screen" placement="top">
              {/* <Typography style={{ color: "#fff" }}>=</Typography> */}
              {fullScreen ? (
                <CloseFullscreenIcon sx={{ color: "#fff" }} />
              ) : (
                <OpenInFullIcon sx={{ color: "#fff" }} />
              )}
            </Tooltip>
          </Button>
        </Box>
      </Box>
    </>
  );
}
