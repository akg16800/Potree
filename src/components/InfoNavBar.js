import React, { useEffect, useState } from "react";
import {
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import { Paper } from "@material-ui/core";
import { styled } from "@mui/material/styles";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { getAllLocations, postEventActivity } from "../utils/api";
import UpdateBox from "./UpdateBox";
import CustomAlert from "./CustomAlert";

const drawerWidth = 400;

const useStyles = makeStyles(() => ({
  top: {
    position: "absolute",
    right: 3,
    top: 3,
    backgroundColor: "black",
    borderRadius: "20px"
  },
  iconscolor: {
    color: "white"
  },
  bottomleft: {
    position: "absolute",
    bottom: 0,
    left: 0,
    margin: "8px",
    background: "#282828",
    // background: "#006666",
    borderRadius: "5px",
    width: "50px",
    height: "50px",
    backgroundPosition: "center",
    zIndex: 1100
  },
  topleft: {
    position: "absolute",
    top: 3,
    margin: "8px",
    display: "flex",
    alignItems: "center",
    gap: "2px",
    color: "white",
    zIndex: 1100
  },
  navlinks: {
    position: "absolute",
    top: 0,
    backgroundColor: "#262626 !important"
  }
}));

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: "center",
  color: theme.palette.text.secondary,
  width: "360px"
}));

const NavBar = (props) => {
  const { gotoAnnotation } = props;
  const classes = useStyles();
  const [openNavlinks, setOpenNavlinks] = useState(false);
  const [locations, setLocations] = useState([]);
  const [editBox, setEditBox] = useState(false);
  const [selectedAnnotation, setSelectedAnnotation] = useState({
    index: null,
    data: null
  });
  const [showAlert, setAlert] = useState({
    show: false,
    data: null,
    index: null
  });

  const handleNav = () => {
    setOpenNavlinks((prev) => !prev);
  };

  const getLocations = async () => {
    try {
      const res = await getAllLocations();
      console.log("fetched locations ", res);
      if (res) {
        setLocations(res.data);
      }
    } catch (e) {
      console.log("error in fetching the locations", e);
    }
  };

  const handleClose = () => {
    setEditBox(false);
    setOpenNavlinks(true);
  };
  const handleAlertClose = () => {
    setAlert((prevState) => ({
      ...prevState, // Keep all existing properties
      show: false // Update only the index property
    }));
  };
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
    if (eventId == "placeList-05") {
      eventDetails = {
        eventName: "Selecting Place from List",
        time: getCurrentDateTime(),
        description:
          "From List Item selecting the place and then navigating to that selected place",
        location: localStorage.getItem("latitude")
          ? [
              localStorage.getItem("latitude"),
              localStorage.getItem("longitude")
            ]
          : null
      };
    } else if (eventId == "mainLogo-06") {
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
    }
    // else if (eventId == "settings-03") {
    //   eventDetails = {
    //     eventName: "Settings",
    //     time: getCurrentDateTime(),
    //     description: "user wants to see the settings",
    //     location: localStorage.getItem("latitude")
    //       ? [
    //           localStorage.getItem("latitude"),
    //           localStorage.getItem("longitude")
    //         ]
    //       : null
    //   };
    // } else if (eventId == "fullScreen-04") {
    //   eventDetails = {
    //     eventName: "Full Screen",
    //     time: getCurrentDateTime(),
    //     description: "User toggled the full Screen view or minimized View",
    //     location: localStorage.getItem("latitude")
    //       ? [
    //           localStorage.getItem("latitude"),
    //           localStorage.getItem("longitude")
    //         ]
    //       : null
    //   };
    // }

    console.log("event.Details is", eventDetails);
    postEventActivity(eventId, eventDetails);
  };

  useEffect(() => {
    getLocations();
  }, []);

  return (
    <>
      <Box className={classes.top}>
        <IconButton
          color="black"
          onClick={() => {
            getLocations();
            handleNav();
          }}
        >
          <MenuIcon className={classes.iconscolor} />
        </IconButton>
      </Box>
      <Box
        className={classes.navlinks}
        sx={{
          display: "block",
          position: "fixed",
          top: 0,
          right: openNavlinks ? 0 : "-400px",
          height: "100vh",
          width: "400px",
          opacity: openNavlinks ? 1 : 0,
          transition: "right 0.3s ease-in-out, opacity 0.3s ease-in-out",
          backgroundColor: "#262626", // Background color added
          zIndex: 1120, // Z-index added
          "@media (max-width: 600px)": {
            width: "300px"
          }
        }}
      >
        <IconButton onClick={() => setOpenNavlinks(false)}>
          <CloseIcon className={classes.iconscolor} />
        </IconButton>
        <Box sx={{ margin: "1.6rem" }}>
          <List>
            {locations && locations.length > 0 ? (
              locations.map((location, index) => (
                <ListItem
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.05)";
                    e.currentTarget.style.background = "#FFF"; // Change background color on hover
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.background = "#DCDCDC"; // Revert background color on mouse leave
                  }}
                  sx={{
                    background: "#DCDCDC",
                    marginBottom: "10px",
                    borderRadius: "8px !important"
                  }}
                  // button
                  key={index}
                >
                  <ListItemIcon
                    onClick={() => {
                      gotoAnnotation(location);
                      setOpenNavlinks(false);
                      eventPosting("placeList-05");
                    }}
                  >
                    <LocationOnIcon />
                  </ListItemIcon>
                  <ListItemText
                    onClick={() => {
                      gotoAnnotation(location);
                      setOpenNavlinks(false);
                      eventPosting("placeList-05");
                    }}
                    primary={location.name}
                  />
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <IconButton
                      onClick={() => {
                        setEditBox(true);
                        // setSelectedAnnotation((prevState) => ({
                        //   ...prevState, // Keep all existing properties
                        //   index: newIndex // Update only the index property
                        // }));
                        setSelectedAnnotation({
                          index: index,
                          data: location
                        });
                        setOpenNavlinks(false);
                        // setSelectedAnnotation(())
                      }}
                      aria-label="edit"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        setAlert((prevState) => ({
                          ...prevState, // Keep all existing properties
                          show: true,
                          data: location,
                          index: index
                        }));
                      }}
                      aria-label="delete"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </ListItem>
              ))
            ) : (
              <Box>No Marked Locations are present</Box>
            )}
          </List>
        </Box>
      </Box>

      {editBox && (
        <Box
          sx={{
            position: "absolute",
            top: "8px",
            right: "0px",
            background: "#fff",
            padding: "1rem",
            borderRadius: "0.7rem",
            zIndex: 15,
            border: "1px solid #000"
          }}
        >
          <UpdateBox
            annotation={selectedAnnotation}
            handleClose={handleClose}
            locations={locations}
            setLocations={setLocations}
          />
        </Box>
      )}
      <CustomAlert
        showAlert={showAlert}
        handleClose={handleAlertClose}
        setLocations={setLocations}
      />
      <Box className={classes.topleft}>
        <img
          src="./icons/iit.png"
          alt="img"
          style={{ width: "50px", borderRadius: "5px", marginRight: "1rem" }}
        />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center"
            // alignItems: "center"
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: "bold", fontSize: "1.2rem", lineHeight: "0.85" }}
          >
            IIT Delhi 3D Map View{" "}
          </Typography>
          <Typography variant="subtitle1" sx={{ fontSize: "0.8rem" }}>
            by Vecros Team
          </Typography>
        </Box>
      </Box>
      <Box className={classes.bottomleft}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            width: "100%"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.40)";
            // e.currentTarget.style.background = "#FFF"; // Change background color on hover
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            // e.currentTarget.style.background = "#DCDCDC"; // Revert background color on mouse leave
          }}
          onClick={() => {
            eventPosting("mainLogo-06");
          }}
        >
          <img
            src="./icons/vcs_logo.png"
            alt="img"
            style={{
              width: "35px",
              height: "35px",
              objectFit: "contain"
            }}
          />
        </Box>
      </Box>
    </>
  );
};

export default NavBar;
