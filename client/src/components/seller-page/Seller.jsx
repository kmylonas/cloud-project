import * as React from "react";
import { Box, Container, Button, TextField } from "@mui/material";
import Product from "../../common/Product";
import Grid from "@mui/material/Grid";
import { useState, useEffect } from "react";
import ProductEditForm from "./ProductEditForm";
import { toast } from "react-toastify";
import { search } from "../../utils/search";
import Layout from "../layout/Layout";
import {
  addProduct,
  deleteProduct,
  getProducts,
  updateProduct,
  updateActivateField,
} from "../../services/productsService";

function Seller(props) {
  const { user } = props;
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [editProd, setEditProd] = useState({});
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    async function getSellerProducts() {
      const result = await getProducts(user._id);
      setProducts(result.data);
    }

    getSellerProducts();
  }, []);

  function handleOpen(prod) {
    setEditProd(prod);
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  function handleChange(val, name) {
    const tmpEditProd = { ...editProd };
    tmpEditProd[name] = val;
    setEditProd(tmpEditProd);
  }

  function handleAdd() {
    setEditProd({
      name: "",
      code: "",
      seller: user._id,
      price: "",
      category: "",
      dateofwithdrawal: "",
    });
    setOpen(true);
  }

  function handleSubmit() {
    if (editProd._id) {
      doUpdateProduct();
    } else {
      doAddProduct();
    }
    setOpen(false);
  }

  async function handleActivate(product) {
    const idx = products.findIndex((prod) => prod._id === product._id);
    const tmpProds = [...products];
    tmpProds[idx].activated = !product.activated;
    setProducts(tmpProds);
    await updateActivateField(product._id, product.activated);
  }

  async function doUpdateProduct() {
    const originalProducts = [...products];
    console.log("DoUpdate");
    const idx = products.findIndex((pr) => pr._id === editProd._id);
    const tmpProds = [...products];
    tmpProds[idx] = editProd;
    setProducts(tmpProds);

    //send put to update prod in database
    try {
      await updateProduct(editProd._id, editProd);
      toast.success("Successfully updated");
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        toast.error("This product was not found");
      setProducts(originalProducts);
    }

    return;
  }

  async function doAddProduct() {
    try {
      const { data: newId } = await addProduct(editProd);
      const tmpProds = [...products];
      const newProd = { ...editProd };
      newProd._id = newId;
      newProd.seller = user;
      tmpProds.unshift(newProd);
      setProducts(tmpProds);
    } catch (ex) {
      if (ex.response && ex.response.status === 400) toast.error("Bad request");
    }
  }

  async function handleDelete(prod) {
    const originalProducts = [...products];
    const tmpProds = products.filter((p) => p._id != prod._id);
    setProducts(tmpProds);

    try {
      await deleteProduct(prod._id);
      toast.success("Successfully deleted");
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        toast.error("Already deleted");
      else {
        //unexpected error
        setProducts(originalProducts);
      }
    }
  }

  function handleSearch(e) {
    const val = e.target.value;
    setSearchText(val);
  }

  const filteredProcuts = search(searchText, products);

  return (
    <React.Fragment>
      <Layout user={user}>
        <Container sx={{ height: "100vh", padding: 15 }}>
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
            mb={4}
          >
            <Button variant="contained" onClick={handleAdd}>
              Add Product
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
            {filteredProcuts.map((product) => (
              <Grid key={product._id} item xs={4}>
                <Product
                  user={user}
                  product={product}
                  onEdit={handleOpen}
                  onDelete={handleDelete}
                  onActivate={handleActivate}
                />
              </Grid>
            ))}
          </Grid>
        </Container>
        <ProductEditForm
          open={open}
          onClose={handleClose}
          product={editProd}
          onChange={handleChange}
          onSubmit={handleSubmit}
        />
      </Layout>
    </React.Fragment>
  );
}

export default Seller;
