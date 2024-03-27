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
import { getAllLocations } from "../utils/api";

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
    borderRadius: "5px",
    width: "50px",
    height: "50px",
    backgroundPosition: "center"
  },
  topleft: {
    position: "absolute",
    top: 3,
    margin: "8px",
    display: "flex",
    gap: "2px",
    color: "white"
  },
  navlinks: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth,
    backgroundColor: "#262626"
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

const NavBar = () => {
  const classes = useStyles();
  const [openNavlinks, setOpenNavlinks] = useState(false);
  const [locations, setLocations] = useState([]);

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

  useEffect(() => {
    getLocations();
  }, []);

  return (
    <>
      <Box className={classes.top}>
        <IconButton color="black" onClick={handleNav}>
          <MenuIcon className={classes.iconscolor} />
        </IconButton>
      </Box>
      <Drawer
        className={classes.navlinks}
        classes={{
          paper: classes.drawerPaper
        }}
        anchor="right"
        open={openNavlinks}
        onClose={() => setOpenNavlinks(false)}
      >
        <IconButton onClick={() => setOpenNavlinks(false)}>
          <CloseIcon className={classes.iconscolor} />
        </IconButton>
        <Box sx={{ margin: "1.6rem" }}>
          <List>
            {locations.length > 0 ? (
              locations.map((location, index) => (
                <ListItem
                  sx={{
                    background: "#DCDCDC",
                    marginBottom: "10px",
                    borderRadius: "8px !important"
                  }}
                  button
                  key={index}
                >
                  <ListItemIcon>
                    <LocationOnIcon />
                  </ListItemIcon>
                  <ListItemText primary={location.name} />
                </ListItem>
              ))
            ) : (
              <Box>No Marked Locations are present</Box>
            )}
          </List>
        </Box>
      </Drawer>
      <Box className={classes.topleft}>
        <img
          src="./icons/map_icon.png"
          alt="img"
          style={{ width: "50px", borderRadius: "5px", marginRight: "1rem" }}
        />
        <Typography variant={"body1"}>
          Construction site Rawscan <br />
          by .....{" "}
        </Typography>
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
