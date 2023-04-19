import { TextField, Box } from "@mui/material";
import { MenuItem } from "@mui/material";

export function InputField(props) {
  const {
    size,
    label,
    icon: Icon,
    value,
    onChange,
    name,
    type,
    error,
    helperText,
  } = props;

  return (
    <Box sx={{ display: "flex", alignItems: "flex-end" }}>
      {Icon && <Icon sx={{ color: "action.active", mr: 1, my: 0.5 }} />}
      <TextField
        error={error}
        helperText={helperText || ""}
        type={type || "text"}
        fullWidth
        size={size ? size : "medium"}
        margin="dense"
        label={label || ""}
        variant="standard"
        value={value ? value : ""}
        name={name}
        onChange={(e) => onChange(e)}
      />
    </Box>
  );
}

export function SelectField(props) {
  const {
    size,
    label,
    icon: Icon,
    menu,
    name,
    value,
    onChange,
    error,
    helperText,
  } = props;
  return (
    <Box sx={{ display: "flex", alignItems: "flex-end" }}>
      {Icon && <Icon sx={{ color: "action.active", mr: 1, my: 0.5 }} />}
      <TextField
        error={error}
        helperText={helperText || ""}
        variant="standard"
        fullWidth
        select
        margin="dense"
        size={size || ""}
        label={label || ""}
        name={name}
        value={value || ""}
        onChange={(e) => onChange(e)}
      >
        {menu.map((item, index) => (
          <MenuItem value={item.toLowerCase()} key={index}>
            {item}
          </MenuItem>
        ))}
      </TextField>
    </Box>
  );
}
