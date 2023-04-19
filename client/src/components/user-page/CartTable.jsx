import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Box, Pagination, Stack, Typography } from "@mui/material";
import { paginate } from "../../utils/paginate";
import { useState } from "react";
import React from "react";
import IconButton from "@mui/material/IconButton";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import RemoveCircleOutlineOutlinedIcon from "@mui/icons-material/RemoveCircleOutlineOutlined";

function CartTable(props) {
  const { items, onRemove, onAdd, total } = props;
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 5;
  const count = items.length;
  const totalPages = Math.ceil(count / pageSize);
  const itemsToRender = paginate(items, pageSize, currentPage);

  function handlePageChange(e, page) {
    setCurrentPage(page);
  }

  return (
    <React.Fragment>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Code</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Date Added</TableCell>
              <TableCell>Date Of Withdrawal</TableCell>
              <TableCell>Unit Price ($)</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Total Price ($)</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {itemsToRender.map((item) => (
              <TableRow key={item.product._id}>
                <TableCell>{item.product.name}</TableCell>
                <TableCell>{item.product.code}</TableCell>
                <TableCell>{item.product.category}</TableCell>
                <TableCell>{item.dateAdded.slice(0, 10)}</TableCell>
                <TableCell>
                  {item.product.dateofwithdrawal.slice(0, 10)}
                </TableCell>
                <TableCell>{item.product.price}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.product.price * item.quantity}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={3}>
                    <IconButton onClick={() => onAdd(item)}>
                      <AddCircleOutlineOutlinedIcon />
                    </IconButton>
                    <IconButton onClick={() => onRemove(item)}>
                      <RemoveCircleOutlineOutlinedIcon />
                    </IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box display="flex" flexDirection="row" justifyContent="space-between">
        <Pagination
          count={totalPages}
          color="primary"
          sx={{ marginTop: 3 }}
          page={currentPage}
          onChange={(e, p) => handlePageChange(e, p)}
        />
        <Typography marginTop={3} variant="body1">
          Total amount: {total}
        </Typography>
      </Box>
    </React.Fragment>
  );
}

export default CartTable;
