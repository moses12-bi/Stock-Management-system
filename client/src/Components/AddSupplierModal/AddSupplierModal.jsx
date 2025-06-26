import React, { useState } from "react";
import { CreateSupplier } from "../../Services/SupplierService";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";

const AddSupplierModal = (props) => {
  const [supplier, setSupplier] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
  });

  const handleSubmit = async (e) => {
    props.onClose(supplier);
  };

  return (
    <Dialog open={props.isOpen} onClose={() => props.onClose()}>
      <DialogTitle>Add New Supplier</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Supplier Name"
          type="text"
          fullWidth
          value={supplier.name}
          onChange={(e) => setSupplier({ ...supplier, name: e.target.value })}
        />
        <TextField
          margin="dense"
          label="Supplier Address"
          type="text"
          fullWidth
          value={supplier.address}
          onChange={(e) => setSupplier({ ...supplier, address: e.target.value })}
        />
        <TextField
          margin="dense"
          label="Supplier Phone"
          type="text"
          fullWidth
          value={supplier.phone}
          onChange={(e) => setSupplier({ ...supplier, phone: e.target.value })}
        />
        <TextField
          margin="dense"
          label="Supplier Email"
          type="email"
          fullWidth
          value={supplier.email}
          onChange={(e) => setSupplier({ ...supplier, email: e.target.value })}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => props.onClose()}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Add Supplier
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddSupplierModal;
