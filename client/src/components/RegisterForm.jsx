import { Button, Box } from "@mui/material";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import { InputField, SelectField } from "../common/formElements";
import { useState } from "react";
import Joi from "joi";
import { validateField, validateForm } from "../utils/validation";
import { toast } from "react-toastify";
import { register } from "../services/usersService";

function RegisterForm(props) {
  const menuItems = ["Admin", "Seller", "User"];
  const [data, setData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    role: "",
    status: "unapproved",
  });
  const [errors, setErrors] = useState({});
  const { onSubmit } = props;

  const schema = Joi.object({
    firstname: Joi.string().min(3).max(20).required(),
    lastname: Joi.string().min(3).max(20).required(),
    email: Joi.string().email({ tlds: false }).required(),
    password: Joi.string().min(3).max(15).required(),
    role: Joi.string().valid("admin", "seller", "user").required(),
    status: Joi.string().valid("approved", "unapproved").required(),
  });

  function handleChange(e) {
    const val = e.target.value;
    const name = e.target.name;
    const errorMessage = validateField(name, val, schema);
    const tmpErrors = { ...errors };
    if (errorMessage) tmpErrors[name] = errorMessage;
    else delete tmpErrors[name];

    const tmpData = { ...data };
    tmpData[name] = val;
    setErrors(tmpErrors);
    setData(tmpData);
  }

  async function handleSubmit() {
    const tmpErrors = validateForm(data, schema);
    setErrors(tmpErrors || {});
    if (tmpErrors) return;

    //Call backend for post to
    //save user

    try {
      await register(data);
      toast.success("You have successfully registered");
      onSubmit();
    } catch (ex) {
      if (ex.response && ex.response.status === 400)
        toast.error("Error Code: 400 Bad Request");
      else if (ex.response && ex.response.status === 404)
        toast.error("This e-mail is already registered");
    }
  }

  return (
    <Box>
      <Box
        display="flex"
        flexDirection="column"
        paddingLeft={3}
        paddingRight={3}
      >
        <InputField
          error={errors.firstname ? true : false}
          helperText={errors.firstname}
          size="small"
          label="First Name"
          icon={PersonOutlineOutlinedIcon}
          name="firstname"
          value={data.firstname}
          onChange={handleChange}
        />
        <InputField
          error={errors.lastname ? true : false}
          helperText={errors.lastname}
          size="small"
          label="Last Name"
          icon={PersonOutlineOutlinedIcon}
          name="lastname"
          value={data.lastname}
          onChange={handleChange}
        />
        <InputField
          error={errors.email ? true : false}
          helperText={errors.email}
          size="small"
          label="Email"
          icon={EmailOutlinedIcon}
          name="email"
          value={data.email}
          onChange={handleChange}
        />
        <InputField
          error={errors.password ? true : false}
          helperText={errors.password}
          type="password"
          size="small"
          label="Password"
          icon={LockOpenOutlinedIcon}
          name="password"
          value={data.password}
          onChange={handleChange}
        />
        <SelectField
          error={errors.role ? true : false}
          helperText={errors.role}
          size="small"
          label="Role"
          icon={AdminPanelSettingsOutlinedIcon}
          menu={menuItems}
          name="role"
          value={data.role}
          onChange={handleChange}
        />
        <Box textAlign="center" margin={2}>
          <Button variant="contained" onClick={handleSubmit}>
            Submit
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default RegisterForm;
