import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { InputField } from "../../common/formElements";
import { validateField, validateForm } from "../../utils/validation";
import Joi from "joi";
import { useState } from "react";

function ProductEditForm(props) {
  const { open, onClose, product, onChange, onSubmit } = props;
  const [errors, setErrors] = useState({});

  const schema = Joi.object({
    _id: Joi.string(),
    name: Joi.string().required(),
    seller: Joi.required(),
    price: Joi.number().required(),
    code: Joi.string().required(),
    category: Joi.string().required(),
    dateofwithdrawal: Joi.string(),
    activated: Joi.boolean(),
  });

  function doChange(e) {
    const val = e.target.value;
    const name = e.target.name;
    const errorMessage = validateField(name, val, schema);

    const tmpErrors = { ...errors };
    if (errorMessage) tmpErrors[name] = errorMessage;
    else delete tmpErrors[name];

    setErrors(tmpErrors);
    onChange(val, name);
  }

  function doClose() {
    setErrors({});
    onClose();
  }

  function doSubmit() {
    console.log("Do submit");
    const tmpErrors = validateForm(product, schema);
    console.log(tmpErrors);
    setErrors(tmpErrors || {});
    if (tmpErrors) return;

    onSubmit();
  }

  return (
    <Dialog open={open} onClose={doClose}>
      <DialogTitle>Subscribe</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To subscribe to this website, please enter your email address here. We
          will send updates occasionally.
        </DialogContentText>
        <InputField
          error={errors.name ? true : false}
          helperText={errors.name}
          value={product.name}
          label="Product Name"
          name="name"
          onChange={doChange}
        />
        <InputField
          error={errors.code ? true : false}
          helperText={errors.code}
          value={product.code}
          label="Product Code"
          name="code"
          onChange={doChange}
        />
        <InputField
          error={errors.category ? true : false}
          helperText={errors.category}
          value={product.category}
          label="Category"
          name="category"
          onChange={doChange}
        />
        <InputField
          error={errors.price ? true : false}
          helperText={errors.price}
          value={product.price}
          label="Price"
          name="price"
          onChange={doChange}
        />
        <InputField
          error={errors.dateofwithdrawal ? true : false}
          helperText={errors.dateofwithdrawal}
          value={product.dateofwithdrawal}
          label="Date Of Withdrawal YYYY-MM-DD"
          name="dateofwithdrawal"
          onChange={doChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={doClose}>Cancel</Button>
        <Button onClick={doSubmit}>Submit</Button>
      </DialogActions>
    </Dialog>
  );
}

export default ProductEditForm;
