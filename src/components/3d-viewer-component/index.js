import { Grid, Box } from "@mui/material";
import React, { useEffect, useLayoutEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import Split from "react-split";
import { useRef } from "react";
import PotreeViewer from "../PotreeFunction";
import { makeStyles } from "@mui/styles";
import image from "../../assets/3D-view.png";
import SampleOne from "../../UI/Navbar";

const useStyles = makeStyles((theme) => ({
  slide1: {
    position: "relative",
    "& .slick-slide": {
      height: "auto"
    }
  },
  slide2: {
    position: "relative",
    "& .slick-slide": {
      height: "auto"
    }
  },
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
    }
  },
  // active: {
  //     opacity: "1",
  // },
  // notActive: {
  //     opacity: "0.5",
  // },
  slideFullScreen: {
    width: "100%",
    position: "absolute"
  },
  normal: {
    position: "relative"
  }
}));

const NextArrow = ({ onClick }) => {
  return (
    <Box
      onClick={onClick}
      sx={{
        color: "#fff",
        position: "absolute",
        zIndex: "100",
        top: "43%",
        right: "0px"
      }}
    >
      <ArrowForwardIosIcon />
    </Box>
  );
};
const PrevArrow = ({ onClick }) => {
  return (
    <Box
      onClick={onClick}
      sx={{
        color: "#fff",
        position: "absolute",
        zIndex: "100",
        top: "43%",
        left: "0px"
      }}
    >
      <ArrowBackIosIcon />
    </Box>
  );
};

const Viewer = ({ props }) => {
  const classes = useStyles();
  const [index, setIndex] = useState(0);
  const [fullScreen, setFullScreen] = useState(false);

  const [nav1, setNav1] = useState(null);
  const [nav2, setNav2] = useState(null);
  const [open, setOpen] = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [isImageGalleryOpened, setImageGalleryOpened] = useState(false);
  const [images, setImages] = useState([]);
  const [load, setLoad] = useState(false);

  const reff = useRef(null);

  const handleClose = () => setOpen(false);
  const handleClick = () => {};
  const [isSidePanelOpened, setSidePanelOpened] = useState(true);
  const [activeComponent, setActiveComponent] = useState(0);

  // useEffect(() => {
  //   if (!THREE) {
  //     var THREEcache = window.THREE;
  //     console.log(THREEcache);
  //     setTHREE(THREEcache);
  //     console.log("THREE", THREE);
  //   }

  //   if (!Potree) {
  //     var Potreecache = window.Potree;
  //     console.log(Potreecache);
  //     setPotree(Potreecache);
  //     console.log("Potree", Potree);
  //     // setUrl(
  //     //   "https://digital-twin-assets.s3.ap-south-1.amazonaws.com/IITD/metadata.json"
  //     // );
  //   }
  // });

  useLayoutEffect(() => {
    const handleMessage = (event) => {
      // Handle messages received from the iframe
      console.log("called");
      console.log("Received message from parent-child:", event.data);

      if (
        event.origin != "http://localhost:3001" &&
        event.origin != "https://www.tryst-iitd.org/"
      ) {
        return;
      }

      try {
        let parsedData;
        if (event.data) {
          parsedData = JSON.parse(event?.data);

          Object.keys(parsedData).forEach((key) => {
            try {
              const parsedItem = JSON.parse(parsedData[key]);
              if (parsedItem && parsedItem.username) {
                localStorage.setItem(key, parsedData[key]);
              } else {
                // Handle case where parsedItem doesn't have a username
              }
            } catch (error) {
              console.error("Error parsing item:", error);
            }
          });
        }
      } catch (error) {
        console.error("Error parsing localStorage data:", error);
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      // Cleanup event listener when component unmounts
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            console.log("Coordinates are", position.coords);
            localStorage.setItem("latitude", latitude);
            localStorage.setItem("longitude", longitude);
          },
          (error) => {
            console.log("Error getting location", error);
          }
        );
      } else {
        console.log("Geolocation is not supported by this browser.");
      }
    };

    getLocation();
  }, []);

  return (
    <>
      <PotreeViewer />
      {/* <PotreeViewer
        setPotree={setPotree}
        setTHREE={setTHREE}
        Potree={Potree}
        THREE={THREE}
      /> */}

      {/* <Split
        sizes={[60, 40]}
        // minSize={100}
        expandToMin={false}
        gutterSize={10}
        gutterAlign="center"
        snapOffset={30}
        dragInterval={1}
        direction="horizontal"
        cursor="col-resize"
        className={classes.split}
        // gutterSize={12}
        // minSize={0}
      >
        <PotreeViewer />
        <PotreeViewer />
      </Split> */}
    </>
  );
};

export default Viewer;
