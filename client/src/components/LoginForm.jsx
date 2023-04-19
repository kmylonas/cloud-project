import { Button, Box } from "@mui/material";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import { InputField } from "../common/formElements";
import { useState } from "react";
import Joi from "joi";
import { validateField, validateForm } from "../utils/validation";
import { toast } from "react-toastify";
import { login } from "../services/authService";

function LoginForm() {
  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const schema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
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
    //login
    try {
      await login({ ...data });
      window.location.replace("/welcome");
    } catch (err) {
      if (
        err.response &&
        (err.response.status === 400 || err.response.status === 401)
      ) {
        console.log(err);
        toast.error(err.response.data);
      }
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
        <Box textAlign="center" margin={2}>
          <Button variant="contained" onClick={handleSubmit}>
            Submit
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

export default LoginForm;
