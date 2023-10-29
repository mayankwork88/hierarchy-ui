/* eslint-disable react/prop-types */
import {
  Paper,
  Stack,
  Typography,
  TextField,
  Button,
  Box,
  MenuItem,
} from "@mui/material";
import { useTheme } from "@emotion/react";

const ShowForm = ({ onChange, value, onSubmit, onCancel, disableInput }) => {
  const theme = useTheme();

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit();
  };

  const data = [
    {
      label: "Team Lead",
      value: "lead",
    },
    {
      label: "Team Member",
      value: "member",
    },
  ];

  const getInput = (
    placeholder,
    disabled,
    name,
    select,
    label,
    value,
    onInputChange,
    selectData
  ) => (
    <TextField
      sx={{ background: "#fff", textTransform: "capitalize" }}
      disabled={disabled.disable}
      required
      fullWidth
      id={name}
      select={select}
      label={label}
      variant="outlined"
      size="large"
      value={value}
      name={name}
      placeholder={placeholder}
      onChange={onInputChange}
      helperText={disabled.message}
    >
      {select && value && (
        <MenuItem key={value} value={value}>
          {value?.toLowerCase().includes("lead") ? "Team Lead" : "Team Member"}
        </MenuItem>
      )}
      {select &&
        selectData
          ?.filter((menu) => menu.value.toLowerCase() !== value.toLowerCase())
          ?.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
    </TextField>
  );

  return (
    <form onSubmit={handleSubmit}>
      <Paper
        elevation={4}
        sx={{
          p: theme.spacing(4, 5),
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: theme.spacing(3),
        }}
      >
        <Typography variant="h4" component="h1">
          Add Member
        </Typography>
        <Stack width={"100%"} gap={theme.spacing(2)}>
          {getInput(
            "Full Name",
            false,
            "name",
            false,
            "Full Name",
            value?.name,
            onChange
          )}
          {getInput(
            "Enter Email",
            false,
            "email",
            false,
            "Email",
            value?.email,
            onChange
          )}
          {getInput(
            "Phone",
            false,
            "phone",
            false,
            "phone",
            value?.phone,
            onChange
          )}
          {getInput(
            "Role",
            disableInput,
            "role",
            true,
            "role",
            value?.role,
            onChange,
            data
          )}
        </Stack>
        <Box display={"flex"} width="100%" gap={theme.spacing(2)}>
          <Button
            variant="outlined"
            sx={{
              width: "100%",
              fontSize: "1.2rem",
              letterSpacing: "3px",
              p: theme.spacing(1, 0),
            }}
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            sx={{
              width: "100%",
              fontSize: "1.2rem",
              letterSpacing: "3px",
              p: theme.spacing(1, 0),
            }}
            type="submit"
          >
            Submit
          </Button>
        </Box>
      </Paper>
    </form>
  );
};

export default ShowForm;
