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

import { postLocation } from "../utils/api";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    gap: theme.spacing(2),
    padding: "1rem"
  },
  succesBtn: {
    background: "green"
  },
  input_label: {
    color: "#fff !important"
  },
  labelText: {
    color: "#fff !important",
    fontSize: "20px !important"
  },
  textField: {
    border: "1px solid #DCDCDC"
  },
  formControl: {
    minWidth: 200
  },
  buttonContainer: {
    display: "flex",
    opacity: 1,
    justifyContent: "space-between",
    gap: theme.spacing(2)
  },
  errorText: {
    color: "red",
    marginTop: theme.spacing(1)
  },
  textFieldRoot: {
    "& .MuiInputBase-input": {
      padding: "6px",
      paddingLeft: "20px",
      height: "35px",
      background: "#404040",
      borderRadius: "8px",
      color: "#fff"
    },
    "& .MuiOutlinedInput-root": {
      borderRadius: "8px",
      border: "1px solid #8F8F8F"
    },
    "&.MuiTextField-root": {
      marginTop: "4px",
      //   marginBottom: "14px",
      borderRadius: "1px"
    }
  },
  descriptionTextField: {
    "& .MuiInputBase-input": {
      padding: "0px",
      paddingLeft: "20px",
      paddingTop: "15px",
      // height: "35px",
      background: "#404040",
      borderRadius: "8px",
      color: "#fff"
    },
    "& .MuiOutlinedInput-root": {
      borderRadius: "8px",
      border: "1px solid #8F8F8F"
    },
    "&.MuiTextField-root": {
      marginTop: "4px",
      marginBottom: "14px",
      borderRadius: "1px"
    },
    "& .MuiOutlinedInput-multiline": {
      padding: "0px"
    }
  },
  createButton: {
    "&.MuiButton-root": {
      padding: "3.5px",
      marginTop: "0px",
      borderRadius: "3px",
      color: "#fff",
      border: "none",
      lineHeight: "none"
    }
  }
}));

const LocationBox = (props) => {
  const { viewer, handleClose } = props;
  const classes = useStyles();
  const [locationTitle, setLocationTitle] = useState("");
  const [description, setDescription] = useState("");
  const [positions, setPositions] = useState(null);
  const [error, setError] = useState("");
  const [saving, setsaving] = useState(false);

  const handleAddPosition = () => {
    if (viewer) {
      let position = viewer.scene.view.position;
      let pivot_point = viewer.scene.view.getPivot();

      setPositions({ cameraPos: position, pivotPos: pivot_point });

      //   if (
      //     positions !== null &&
      //     (position !== positions.cameraPos || pivot_point !== positions.pivotPos)
      //   ) {
      //     setPositions({ cameraPos: position, pivotPos: pivot_point });
      //   }
    }
  };

  const handleSave = async () => {
    let missingFields = [];
    if (!locationTitle.trim()) {
      missingFields.push("Location Title");
    }
    if (!description.trim()) {
      missingFields.push("Location Description");
    }
    if (!positions) {
      missingFields.push("Positions");
    }

    if (missingFields.length > 0) {
      setError(
        `Please fill in the following fields: ${missingFields.join(", ")}`
      );
      return;
    }

    try {
      // Check if title and description are not empty

      const res = await postLocation(
        locationTitle,
        description,
        positions.cameraPos,
        positions.pivotPos
      );
      if (res) {
        handleClose();
      }
    } catch (e) {
      console.log("error while saving is", e);
    }

    console.log("Data saved:", { locationTitle, description, positions });
    setError("");
  };

  const handleCancel = () => {
    handleClose();
    console.log("Operation canceled");
  };

  useEffect(() => {
    if (viewer) {
      let position = viewer.scene.view.position;
      let pivot_point = viewer.scene.view.getPivot();
      setPositions({ cameraPos: position, pivotPos: pivot_point });
    }
    window.addEventListener("dblclick", handleAddPosition);
    window.addEventListener("mouseup", handleAddPosition);
    window.addEventListener("wheel", handleAddPosition);
    return () => {
      window.removeEventListener("dblclick", handleAddPosition);
      window.removeEventListener("mouseup", handleAddPosition);
      window.removeEventListener("wheel", handleAddPosition);
    };
  }, [viewer]);

  return (
    <Box
      className={classes.root}
      sx={{
        bgcolor: "#202020",
        // opacity: 0.9,
        // maxWidth: "30%",
        color: "#fff",
        borderRadius: "8px"
      }}
    >
      {error && <Typography className={classes.errorText}>{error}</Typography>}
      <TextField
        // label="Location Title"
        // className={classes.textField}
        className={classes.textFieldRoot}
        placeholder="Location Title"
        // InputLabelProps={{ className: classes.input_label }}
        // InputProps={{ className: classes.labelText }}
        variant="outlined"
        fullWidth
        value={locationTitle}
        onChange={(e) => setLocationTitle(e.target.value)}
      />
      <TextField
        // label="Location Description"
        // className={classes.textField}
        className={classes.descriptionTextField}
        placeholder="Location Description"
        // InputLabelProps={{ className: classes.input_label }}
        // InputProps={{ className: classes.labelText }}
        variant="outlined"
        fullWidth
        multiline
        rows={2}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <Button variant="contained" color="primary" onClick={handleAddPosition}>
        {positions !== null ? "Update Position" : "Add Positions"}
      </Button>
      {positions && positions !== null && (
        <Box sx={{ position: "relative" }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              border: "1px solid #fff",
              padding: "0.5rem"
            }}
          >
            <Typography
              variant="body1"
              sx={{ fontWeight: "bold", marginBottom: "2px" }}
            >
              Camera:{" "}
              <span style={{ fontSize: "0.8rem" }}>
                {positions.cameraPos.toArray().join(", ")}
              </span>
            </Typography>
            <Typography
              variant="body1"
              sx={{ fontWeight: "bold", marginBottom: "2px" }}
            >
              Target:{" "}
              <span style={{ fontSize: "0.8rem" }}>
                {positions.pivotPos.toArray().join(", ")}
              </span>
            </Typography>
          </Box>
        </Box>
      )}
      <Box className={classes.buttonContainer}>
        <Button
          sx={{ background: "green" }}
          className={classes.succesBtn}
          variant="contained"
          color="primary"
          onClick={handleSave}
        >
          Save
        </Button>
        <Button variant="contained" color="secondary" onClick={handleCancel}>
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default LocationBox;
