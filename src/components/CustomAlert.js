import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { deleteLocationItem } from "../utils/api";

function CustomAlert(props) {
  const { showAlert, handleClose, setLocations } = props;
  const handleYes = async () => {
    try {
      // Check if title and description are not empty

      const res = await deleteLocationItem(showAlert.data.locationID);
      if (res) {
        setLocations((locs) => {
          const locationClone = [...locs];
          locationClone.splice(showAlert.index, 1);
          return locationClone;
        });

        handleClose();
      }
    } catch (e) {
      console.log("error while saving is", e);
      handleClose();
    }
  };
  const handleNo = () => {
    handleClose();
  };
  return (
    <Dialog open={showAlert.show} onClose={handleClose}>
      <DialogTitle>Confirmation</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to proceed with this action?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleYes} color="primary" variant="contained">
          Yes
        </Button>
        <Button onClick={handleNo} color="secondary" variant="contained">
          No
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CustomAlert;
