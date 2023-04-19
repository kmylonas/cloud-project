import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { Button, Box } from "@mui/material/";
import { useState } from "react";
import Menu from "./Menu";
import { logout } from "../services/authService";

function Navbar(props) {
  const [showMenu, setShowMenu] = useState(false);

  function handleHover() {
    setShowMenu(!showMenu);
  }

  function handleLogout() {
    logout();
    window.location = "/";
  }

  const { user } = props;

  const info =
    user.firstname.toUpperCase() +
    " " +
    user.lastname.toUpperCase() +
    " (" +
    user.role.toUpperCase() +
    ")";

  return (
    <React.Fragment>
      <Box>
        <AppBar>
          <Toolbar
            variant="dense"
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Box>
              <IconButton
                onMouseEnter={handleHover}
                color="inherit"
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            </Box>
            <Box display="flex" flexDirection="row" alignItems="center">
              <Typography variant="body2" color="inherit" mr={4}>
                {info}
              </Typography>
              <Button onClick={handleLogout} color="inherit">
                Logout
              </Button>
            </Box>
          </Toolbar>
          <Box>{showMenu && <Menu onMouseLeave={handleHover} />}</Box>
        </AppBar>
      </Box>
    </React.Fragment>
  );
}

export default Navbar;
