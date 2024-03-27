import React, { useState } from "react";
import Modal from "@mui/material/Modal";
import { Button, TextField, Typography, Grid, Box } from "@mui/material";
import axios from "axios";
import { postLocation } from "../utils/api";

const CustomModal = ({ open, handleClose, positions }) => {
  console.log("position.modal", positions);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [cameraView, setCameraView] = useState(positions.cameraPos);
  const [target, setTarget] = useState(positions.pivotPos);
  const [error, setError] = useState("");

  const handleSave = async () => {
    try {
      // Check if title and description are not empty
      if (title.trim() === "" || description.trim() === "") {
        // Display error message
        setError("Title and description are required.");
        return;
      }

      const res = await postLocation(
        title,
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
    // Handle saving data here
    console.log({ title, description, cameraView, target });
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          minWidth: 300,
          maxWidth: 500,
          borderRadius: 4
        }}
      >
        {error && (
          <Typography variant="body1" color="error" gutterBottom>
            {error}
          </Typography>
        )}
        <Typography variant="h5" align="center" gutterBottom>
          Place Title
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Description"
              value={description}
              rows={3}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Camera View"
              value={cameraView}
              onChange={(e) => setCameraView(e.target.value)}
              fullWidth
              disabled
              defaultValue={positions?.cameraPos?.toArray()}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Target"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              fullWidth
              disabled
              defaultValue={positions?.pivotPos?.toArray()}
            />
          </Grid>
        </Grid>
        <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
          <Button
            onClick={handleSave}
            variant="contained"
            color="primary"
            sx={{ mr: 1 }}
          >
            Save
          </Button>
          <Button onClick={handleClose} variant="contained" color="secondary">
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default CustomModal;
