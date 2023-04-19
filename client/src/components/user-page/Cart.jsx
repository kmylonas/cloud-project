import React, { useState } from "react";
import { Container } from "@mui/system";
import { useEffect } from "react";
import CartTable from "./CartTable";
import { getCart, updateCart, clearCart } from "../../services/cartService";
import { Box, Button, TextField, Typography } from "@mui/material";
import { searchCart } from "../../utils/search";
import { useNavigate } from "react-router-dom";
import Layout from "../layout/Layout";

function Cart(props) {
  const { user } = props;
  const [items, setItems] = useState([]);
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function getItems() {
      const { data } = await getCart(user._id);
      setItems(data.items);
    }

    getItems();
  }, []);

  async function handleRemove(item) {
    const originalItems = [...items];
    if (item.quantity === 1) {
      const tmpItems = items.filter((i) => i.product._id != item.product._id);
      setItems(tmpItems);
    } else if (item.quantity > 1) {
      const idx = items.findIndex((i) => i.product._id === item.product._id);
      const tmpItems = [...items];
      tmpItems[idx].quantity--;
      setItems(tmpItems);
    }

    try {
      await updateCart(user._id, item.product._id, "remove");
    } catch (ex) {
      //unexpected error
      setItems(originalItems);
    }
  }

  async function handleAdd(item) {
    const originalItems = [...items];
    const idx = items.findIndex((i) => i.product._id === item.product._id);
    const tmpItems = [...items];
    tmpItems[idx].quantity++;
    setItems(tmpItems);

    try {
      await updateCart(user._id, item.product._id, "add");
    } catch (ex) {
      //unexpected error
      setItems(originalItems);
    }
  }

  function handleSearch(e) {
    const val = e.target.value;
    setSearchText(val);
  }

  async function handleClear() {
    const originalItems = [...items];
    setItems([]);
    try {
      await clearCart(user._id, "clear");
    } catch (ex) {
      //unexpected error
      setItems(originalItems);
    }
  }

  function totalCartPrice() {
    const sum = items.reduce(function (acc, item) {
      return acc + item.product.price * item.quantity;
    }, 0);
    return sum;
  }
  console.log(items);
  const itemsToRender = searchCart(searchText, items);
  const total = totalCartPrice();
  if (items.length === 0) {
    return (
      <React.Fragment>
        <Layout user={user}>
          <Box
            height="50vh"
            display="flex"
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
          >
            <Typography variant="h5">Your cart is empty</Typography>
            <Button
              variant="outlined"
              sx={{ mt: 5 }}
              onClick={() => navigate("/user")}
            >
              Add Products
            </Button>
          </Box>
        </Layout>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <Layout user={user}></Layout>
      <Container sx={{ height: "100vh", padding: 15 }}>
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          mb={4}
        >
          <Button variant="contained" onClick={handleClear}>
            Clear
          </Button>

          <TextField
            size="small"
            label="Search"
            name="search"
            value={searchText}
            onChange={(e) => handleSearch(e)}
          />
        </Box>
        <CartTable
          items={itemsToRender}
          onRemove={handleRemove}
          onAdd={handleAdd}
          total={total}
        />
      </Container>
    </React.Fragment>
  );
}

export default Cart;
