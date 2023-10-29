/* eslint-disable react/prop-types */
import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { Stack, ListItemIcon } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import PublishedWithChangesOutlinedIcon from "@mui/icons-material/PublishedWithChangesOutlined";
import PublishOutlinedIcon from "@mui/icons-material/PublishOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";

const ActionsMenu = ({
  data,
  handleEmployeeEdit,
  handleTeamEdit,
  handleViewEmployeeDetails,
  handleDeleteMember,
  handleAddMemberClick,
  handleAddTeamClick,
  hanldeMemberTeamChange,
  handleEmployeePromote,
}) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // HANDLE EDIT
  const handleEdit = (type) => {
    if (type) handleEmployeeEdit(data?.id);
    else handleTeamEdit(data?.id);
    handleClose();
  };

  const handleView = () => {
    handleViewEmployeeDetails(data?.id);
    handleClose();
  };

  const handleDelete = () => {
    handleDeleteMember(data?.id);
    handleClose();
  };

  const handleAdd = (type) => {
    if (type) handleAddTeamClick();
    else handleAddMemberClick();
    handleClose();
  };

  const hanldeTeamChange = () => {
    hanldeMemberTeamChange(data?.id);
    handleClose();
  };

  const handlePromote = () => {
    handleEmployeePromote(data?.id);
    handleClose();
  };

  return (
    <Stack>
      <Button
        id="demo-positioned-button"
        aria-controls={open ? "demo-positioned-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        <MenuOutlinedIcon size="md" />
      </Button>
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        {(data?.role?.toLowerCase()?.includes("head") || !data?.email) && (
          <MenuItem onClick={() => handleAdd(data?.email)}>
            <ListItemIcon>
              <AddCircleOutlineIcon fontSize="small" />
            </ListItemIcon>
            Add
          </MenuItem>
        )}
        <MenuItem onClick={() => handleEdit(data?.email)}>
          <ListItemIcon>
            <EditOutlinedIcon fontSize="small" />
          </ListItemIcon>
          Edit
        </MenuItem>
        <MenuItem onClick={handleView}>
          <ListItemIcon>
            <RemoveRedEyeOutlinedIcon fontSize="small" />
          </ListItemIcon>
          view
        </MenuItem>
        {data?.role?.toLowerCase()?.includes("member") && (
          <>
            <MenuItem onClick={handleDelete}>
              <ListItemIcon>
                <DeleteOutlineIcon fontSize="small" />
              </ListItemIcon>
              Delete
            </MenuItem>
            <MenuItem onClick={hanldeTeamChange}>
              <ListItemIcon>
                <PublishedWithChangesOutlinedIcon fontSize="small" />
              </ListItemIcon>
              Change Team
            </MenuItem>
          </>
        )}
        {(data?.role?.toLowerCase()?.includes("member") ||
          data?.role?.toLowerCase()?.includes("lead")) && (
          <MenuItem onClick={handlePromote}>
            <ListItemIcon>
              <PublishOutlinedIcon fontSize="small" />
            </ListItemIcon>
            Promote
          </MenuItem>
        )}
      </Menu>
    </Stack>
  );
};

export default ActionsMenu;
