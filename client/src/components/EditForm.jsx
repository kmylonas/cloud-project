import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { InputField, SelectField } from "../common/formElements";

export default function EditForm(props) {
  const { open, onClose, data, onChange, onSubmit, errors } = props;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Subscribe</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To subscribe to this website, please enter your email address here. We
          will send updates occasionally.
        </DialogContentText>
        <InputField
          error={errors.firstname ? true : false}
          helperText={errors.firstname}
          label="First Name"
          name="firstname"
          value={data.firstname}
          onChange={onChange}
        />
        <InputField
          error={errors.lastname ? true : false}
          helperText={errors.lastname}
          value={data.lastname}
          label="Last Name"
          name="lastname"
          onChange={onChange}
        />
        <InputField
          error={errors.email ? true : false}
          helperText={errors.email}
          value={data.email}
          label="E-mail"
          name="email"
          onChange={onChange}
        />
        <SelectField
          error={errors.role ? true : false}
          helperText={errors.role}
          value={data.role}
          label="Role"
          name="role"
          onChange={onChange}
          menu={["Admin", "Seller", "User"]}
        />
        <SelectField
          error={errors.status ? true : false}
          helperText={errors.status}
          value={data.status}
          label="Status"
          name="status"
          onChange={onChange}
          menu={["Approved", "Unapproved"]}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onSubmit}>Submit</Button>
      </DialogActions>
    </Dialog>
  );
}
