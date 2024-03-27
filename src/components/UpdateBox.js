import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  makeStyles,
  Typography
} from "@material-ui/core";
import CancelIcon from "@mui/icons-material/Cancel";
import { editLocationData, postLocation } from "../utils/api";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(2)
  },
  formControl: {
    minWidth: 200
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-between",
    gap: theme.spacing(2)
  },
  errorText: {
    color: "red",
    marginTop: theme.spacing(1)
  }
}));

const UpdateBox = (props) => {
  const { annotation, handleClose, locations, setLocations } = props;
  const classes = useStyles();
  const [locationTitle, setLocationTitle] = useState("");
  const [description, setDescription] = useState("");
  //   const [positions, setPositions] = useState(null);
  const [error, setError] = useState("");

  //   const handleAddPosition = () => {
  //     if (viewer) {
  //       let position = viewer.scene.view.position;
  //       let pivot_point = viewer.scene.view.getPivot();

  //       setPositions({ cameraPos: position, pivotPos: pivot_point });

  //       //   if (
  //       //     positions !== null &&
  //       //     (position !== positions.cameraPos || pivot_point !== positions.pivotPos)
  //       //   ) {
  //       //     setPositions({ cameraPos: position, pivotPos: pivot_point });
  //       //   }
  //     }
  //   };

  const handleSave = async () => {
    let missingFields = [];
    if (!locationTitle.trim()) {
      missingFields.push("Location Title");
    }
    if (!description.trim()) {
      missingFields.push("Location Description");
    }

    if (missingFields.length > 0) {
      setError(
        `Please fill in the following fields: ${missingFields.join(", ")}`
      );
      return;
    }

    try {
      // Check if title and description are not empty

      const res = await editLocationData(
        locationTitle,
        description,
        annotation.data.locationID
      );
      if (res) {
        setLocations((locs) => {
          let locationClone = [...locs];
          locationClone[annotation.index] = res.data.item;
          return locationClone;
        });
        handleClose();
      }
    } catch (e) {
      console.log("error while saving is", e);
    }

    console.log("Data saved:", { locationTitle, description });
    setError("");
  };

  const handleCancel = () => {
    handleClose();
    console.log("Operation canceled");
  };

  //   useEffect(() => {
  //     if (viewer) {
  //       let position = viewer.scene.view.position;
  //       let pivot_point = viewer.scene.view.getPivot();
  //       setPositions({ cameraPos: position, pivotPos: pivot_point });
  //     }
  //     window.addEventListener("dblclick", handleAddPosition);
  //     window.addEventListener("mouseup", handleAddPosition);
  //     window.addEventListener("wheel", handleAddPosition);
  //     return () => {
  //       window.removeEventListener("dblclick", handleAddPosition);
  //       window.removeEventListener("mouseup", handleAddPosition);
  //       window.removeEventListener("wheel", handleAddPosition);
  //     };
  //   }, [viewer]);

  useEffect(() => {
    const tempDiv = document.createElement("div");

    // Set the innerHTML of the div to the HTML content
    tempDiv.innerHTML = annotation.data.details;

    // Extract the text content
    const extractedText = tempDiv.textContent || tempDiv.innerText;
    setDescription(extractedText);
    setLocationTitle(annotation.data.name);
  }, []);

  return (
    <Box className={classes.root}>
      {error && <Typography className={classes.errorText}>{error}</Typography>}
      <TextField
        label="Location Title"
        variant="outlined"
        fullWidth
        defaultValue={locationTitle}
        value={locationTitle}
        onChange={(e) => setLocationTitle(e.target.value)}
      />
      <TextField
        label="Location Description"
        variant="outlined"
        fullWidth
        multiline
        rows={3}
        defaultValue={description}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <Button variant="contained" color="primary" onClick={handleSave}>
        Update and Save
      </Button>

      {/* <Box className={classes.buttonContainer}>
        <Button variant="contained" color="primary" onClick={handleSave}>
          Save
        </Button>
        <Button variant="contained" color="secondary" onClick={handleCancel}>
          Cancel
        </Button>
      </Box> */}
    </Box>
  );
};

export default UpdateBox;
