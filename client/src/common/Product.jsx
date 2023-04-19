import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import { CardHeader, Stack } from "@mui/material";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import ClearOutlinedIcon from "@mui/icons-material/ClearOutlined";
import ModeEditOutlinedIcon from "@mui/icons-material/ModeEditOutlined";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";

function Product(props) {
  const { product, onEdit, onDelete, user, onClick, onActivate } = props;

  return (
    <Card elevation={10} sx={{ backgroundColor: "grey.50" }}>
      <CardHeader title={product.name} subheader={product.code} />
      <CardContent>
        <Typography color="text.secondary">
          {product.seller.firstname + " " + product.seller.lastname}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {product.category}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          Withdrawal:{" "}
          {product.dateofwithdrawal
            ? product.dateofwithdrawal.slice(0, 10)
            : ""}
        </Typography>
        <Typography color="text.secondary"> {product.price + " $"}</Typography>
      </CardContent>
      <CardActions>
        {user.role === "user" && (
          <Button
            variant="outlined"
            onClick={() => onClick(product)}
            color="success"
            size="small"
          >
            Add To Cart
          </Button>
        )}
        <Box>
          {user.role === "seller" && (
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                color="success"
                size="small"
                startIcon={<ModeEditOutlinedIcon />}
                onClick={() => onEdit(product)}
              >
                Edit
              </Button>
              <Button
                variant="outlined"
                color="error"
                size="small"
                startIcon={<ClearOutlinedIcon />}
                onClick={() => onDelete(product)}
              >
                Delete
              </Button>
              <Button
                variant="outlined"
                color="primary"
                size="small"
                onClick={() => onActivate(product)}
              >
                {product.activated ? "Deactivate" : "Activate"}
              </Button>
            </Stack>
          )}
        </Box>
      </CardActions>
    </Card>
  );
}

export default Product;
