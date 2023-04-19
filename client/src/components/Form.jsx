import { Button, Paper, styled, Box } from "@mui/material";
import { useState } from "react";
import { ReactComponent as IconAvatar } from "../images/account.svg";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

function Form() {
  const [login, setLogin] = useState(true);

  function handleSubmit() {
    setLogin(true);
  }

  return (
    <StyledPaper elevation={2}>
      <Button
        variant={login ? "contained" : "text"}
        onClick={() => {
          setLogin(true);
        }}
      >
        Login
      </Button>
      <Button
        variant={login ? "text" : "contained"}
        onClick={() => {
          setLogin(false);
        }}
      >
        Register
      </Button>
      <Box textAlign="center">
        <IconAvatar width={150} height={150} />
      </Box>
      <Box display="flex" flexDirection="column" justifyContent="space-evenly">
        {login ? <LoginForm /> : <RegisterForm onSubmit={handleSubmit} />}
      </Box>
    </StyledPaper>
  );
}

const StyledPaper = styled(Paper)({
  minHeight: "550px",
});

export default Form;
