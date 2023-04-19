import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InventoryOutlinedIcon from "@mui/icons-material/InventoryOutlined";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import { Box } from "@mui/system";

function Menu(props) {
  const { onMouseLeave } = props;

  return (
    <Box>
      <List
        onMouseLeave={onMouseLeave}
        sx={{
          color: "common.black",
          backgroundColor: "grey.100",
        }}
      >
        <ListItem disablePadding>
          <ListItemButton component="a" href="user">
            <ListItemIcon>
              <InventoryOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Products" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component="a" href="cart">
            <ListItemIcon>
              <ShoppingCartOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Cart" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component="a" href="seller">
            <ListItemIcon>
              <StorefrontOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Seller" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component="a" href="admin">
            <ListItemIcon>
              <AdminPanelSettingsOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Administrator" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );
}

export default Menu;
