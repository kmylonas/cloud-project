import * as React from "react";
import { useState, useEffect } from "react";
import { Container, Button, TextField, Box } from "@mui/material";
import Product from "../../common/Product";
import Grid from "@mui/material/Grid";
import { search } from "../../utils/search";
import { updateCart } from "../../services/cartService";
import { getProducts } from "../../services/productsService";
import { useNavigate } from "react-router-dom";
import Layout from "../layout/Layout";

function User(props) {
  const { user } = props;
  const [products, setProducts] = useState([]);
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function getAllProducts() {
      const { data } = await getProducts();
      setProducts(data);
    }

    getAllProducts();
  }, []);

  function handleSearch(e) {
    const val = e.target.value;
    setSearchText(val);
  }

  async function handleAdd(product) {
    const originalProducts = [...products];
    try {
      await updateCart(user._id, product._id, "add");
    } catch (ex) {
      //no expected errors here
      //if unexpected revert to original state
      setProducts(originalProducts);
    }
  }

  function handleShowCart() {
    navigate("/cart");
  }

  const filteredProducts = search(searchText, products);

  return (
    <React.Fragment>
      <Layout user={user}>
        <Container
          sx={{
            height: "100vh",
            padding: 15,
          }}
        >
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            mb={4}
          >
            <Button variant="contained" onClick={handleShowCart}>
              Show Cart
            </Button>
            <TextField
              size="small"
              label="Search"
              name="search"
              value={searchText}
              onChange={(e) => handleSearch(e)}
            />
          </Box>
          <Grid container spacing={8}>
            {filteredProducts.map((product) => (
              <Grid key={product._id} item xs={4}>
                <Product product={product} user={user} onClick={handleAdd} />
              </Grid>
            ))}
          </Grid>
        </Container>
      </Layout>
    </React.Fragment>
  );
}

export default User;
