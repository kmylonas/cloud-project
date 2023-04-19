import React from "react";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

function Unauthorized() {
  const navigate = useNavigate();
  function handleLogin() {
    navigate("/welcome", { replace: true });
  }

  return (
    <React.Fragment>
      <h1>You are not authorized to see this page</h1>
      <Button variant="contained" onClick={handleLogin}>
        Back
      </Button>
    </React.Fragment>
  );
}

export default Unauthorized;
