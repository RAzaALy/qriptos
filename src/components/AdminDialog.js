import React, { useState } from "react";

import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  IconButton,
} from "@material-ui/core";
import SupervisorAccountIcon from "@material-ui/icons/SupervisorAccount";
 

const AdminDialog = ({ handleMakeAdmin, username }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleModalOpen = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleDeleteClick = () => {
    handleMakeAdmin();
    handleModalClose();
  };

  return (
    <React.Fragment>
      <IconButton color="primary" size="small" onClick={handleModalOpen}>
        <SupervisorAccountIcon />
      </IconButton>

      <Dialog open={modalOpen} onClose={handleModalClose}>
        <DialogTitle>{"Confirm Make Admin User"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {`Are you sure you want to make ${username} admin from your group?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleModalClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDeleteClick} color="primary">
            {"Make Admin"}
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default AdminDialog;
