/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
import { useState } from "react";
import { Stack, Typography, Box, Snackbar, Alert, Paper } from "@mui/material";
import { useTheme } from "@emotion/react";
import AppModal from "./Modal";
import ShowForm from "./ShowForm";
import { useSelector } from "react-redux";
import ShowEmployeeDetails from "./ShowEmployeeDetails";
import ShowTeamForm from "./ShowTeamForm";
import ActionsMenu from "./ActionsMenu";
import TeamChangeContent from "./TeamChangeContent";
import IconButton from "@mui/material/IconButton";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import { VisibilityOffOutlined } from "@mui/icons-material";

const EmployeeCard = ({
  data,
  handleEditEmployee,
  handleAddNewMember,
  handleDeleteMember,
  handleAddTeam,
  handleEditTeam,
  handleTeamChange,
  handleEmployeePromote,
}) => {
  const theme = useTheme();
  const state = useSelector((state) => state.company);

  const [showAlert, setShowAlert] = useState({ alert: false, message: "" });
  const [openModal, setOpenModal] = useState(false);
  const [eventType, setEventType] = useState(null);
  const [viewSelectedEmployee, setViewSelectedEmployee] = useState({});
  const [newTeam, setNewTeam] = useState({ name: "" });
  const [error, setError] = useState({ error: false, message: "" });
  const [teamsInADepartment, setTeamsInADepartment] = useState([]);
  const [expand, setExpand] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState({
    currentTeamName: "",
    memberId: null,
    newTeamId: null,
  });

  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
  });
  const [disableInput, setDisableInput] = useState({
    disable: false,
    message: "",
  });

  const getSelectedEmployee = (tree, id) => {
    if (tree.id === id) {
      return tree;
    }
    if (tree.teams && Array.isArray(tree.teams)) {
      for (const team of tree.teams) {
        const member = getSelectedEmployee(team, id);
        if (member) {
          return member;
        }
      }
    }
    return null; // Member with the specified ID not found
  };

  const isTeamNameExist = (tree, name) => {
    if (tree.name.toLowerCase() === name.toLowerCase()) {
      return true;
    }
    if (tree.teams && Array.isArray(tree.teams)) {
      for (const team of tree.teams) {
        const ifExist = isTeamNameExist(team, name);
        if (ifExist) return true;
      }
    }
    return false; // team name is not exist
  };

  const isTeamLeadExist = (tree, id) => {
    if (tree.id === id) {
      return tree.teams.some((emp) => emp.role.toLowerCase() === "lead");
    }
    if (tree.teams && Array.isArray(tree.teams)) {
      for (const team of tree.teams) {
        const ifExist = isTeamLeadExist(team, id);
        if (ifExist) return true;
      }
    }
    return false; // team name is not exist
  };

  const getTeamStatsByEmployeeId = (tree, id) => {
    if (tree?.teams?.some((emp) => emp.id === id)) {
      return tree?.teams?.filter((el) => el.role.toLowerCase() === "member")
        ?.length;
    }

    if (tree?.teams && Array.isArray(tree.teams)) {
      for (const team of tree.teams) {
        const stats = getTeamStatsByEmployeeId(team, id);
        if (stats) return stats;
      }
    }
    return null;
  };

  const handleAddNewMemberChange = (event) => {
    const { name, value } = event.target;
    setNewMember({ ...newMember, [name]: value });
  };

  const handleAddNewTeamChange = (event) => {
    const { name, value } = event.target;
    setNewTeam({ ...newTeam, [name]: value });
  };

  const handleEmployeeEdit = (employeeId) => {
    setOpenModal(true);
    setEventType("editMember");
    const selectedEmployee = getSelectedEmployee(state, employeeId);
    setNewMember({
      name: selectedEmployee.name,
      email: selectedEmployee.email,
      phone: selectedEmployee.phone,
      role: selectedEmployee.role,
    });
  };

  const handleTeamEdit = (teamId) => {
    setOpenModal(true);
    setEventType("editTeam");
    const selectedTeam = getSelectedEmployee(state, teamId);
    setNewTeam({
      name: selectedTeam.name,
    });
  };

  const handleAddNewMemberSubmit = () => {
    handleAddNewMember(data.id, newMember);
    setOpenModal(false);
    setNewMember({
      name: "",
      email: "",
      phone: "",
    });
  };
  const handleEmployeeEditSubmit = () => {
    handleEditEmployee(data.id, newMember);
    setOpenModal(false);
    setNewMember({
      name: "",
      email: "",
      phone: "",
    });
  };

  const handleTeamEditSubmit = () => {
    const isExist = isTeamNameExist(state, newTeam.name);
    if (isExist) {
      setError({ error: true, message: "Team Name already exists!" });
      return;
    }
    handleEditTeam(data.id, newTeam);
    setOpenModal(false);
    setNewTeam({ name: "" });
  };

  const handleTeamChangeSubmit = () => {
    const isLastMember = getTeamStatsByEmployeeId(state, selectedTeam.memberId);
    if (isLastMember === 1)
      setShowAlert({
        alert: true,
        message: "A team must have at least one member",
      });
    else {
      const member = getSelectedEmployee(state, selectedTeam.memberId);
      handleTeamChange(selectedTeam, member);
    }
    setOpenModal(false);
    setSelectedTeam("");
  };

  const handleAddNewTeamSubmit = () => {
    const isExist = isTeamNameExist(state, newTeam.name);
    if (isExist) {
      setError({ error: true, message: "Team Name already exists!" });
      return;
    }
    handleAddTeam(data.id, newTeam);
    setOpenModal(false);
    setNewTeam({
      name: "",
    });
  };

  const handleModalCancel = () => {
    setOpenModal(false);
    setNewTeam({ name: "" });
    setNewMember({
      name: "",
      email: "",
      phone: "",
    });
  };

  const handleAddMemberClick = () => {
    setEventType("addMember");
    setOpenModal(true);
    // if team lead exist -> set role option to member by default
    //else allow user to create one

    // check for team stats return -> {lead:Number, member:Number}
    // const teamStats = getTeamStats(state, 9);
    // alert(data.id);
    const isLeadExist = isTeamLeadExist(state, data.id);
    if (isLeadExist) {
      setNewMember({
        ...newMember,
        role: "member",
      });
      setDisableInput({
        disable: true,
        message: "A team can have only 1 Team Lead",
      });
    }
  };

  const handleAddTeamClick = () => {
    setEventType("addTeam");
    setOpenModal(true);
  };

  const handleViewEmployeeDetails = (employeeId) => {
    setEventType("view");
    const selectedEmployee = getSelectedEmployee(state, employeeId);
    setViewSelectedEmployee(selectedEmployee);
    setOpenModal(true);
  };

  const handleDeleteMemberCheck = (employeeId) => {
    const members = getTeamStatsByEmployeeId(state, employeeId);
    if (members === 1)
      setShowAlert({
        alert: true,
        message: "A team must have at least one member",
      });
    else handleDeleteMember(employeeId);
  };

  const findDepartmentByMemberId = (tree, employeeId) => {
    if (
      tree?.teams?.some((ele) => ele?.teams?.some((el) => el.id === employeeId))
    ) {
      return tree;
    }
    if (tree?.teams && Array.isArray(tree.teams)) {
      for (const team of tree.teams) {
        const stats = findDepartmentByMemberId(team, employeeId);
        if (stats) {
          return stats;
        }
      }
    }
    return null;
  };

  const getTeamById = (tree, id) => {
    if (tree?.teams?.some((emp) => emp.id === id)) {
      return tree;
    }

    if (tree?.teams && Array.isArray(tree.teams)) {
      for (const team of tree.teams) {
        const stats = getTeamById(team, id);
        if (stats) return stats;
      }
    }
    return null;
  };

  const hanldeMemberTeamChange = (memberId) => {
    setEventType("changeTeam");
    setOpenModal(true);
    const memberCurrentTeam = getTeamById(state, memberId);
    // setSelectedTeam(memberCurrentTeam?.name);
    setSelectedTeam({
      ...selectedTeam,
      currentTeamName: memberCurrentTeam?.name,
      memberId: memberId,
      newTeamId: null,
    });
    const tree = findDepartmentByMemberId(state, memberId);
    setTeamsInADepartment(tree?.teams);
  };

  //event type :- addMember, editMember, view, addTeam
  const chooseSubmit = (type) => {
    switch (type) {
      case "addMember":
        return handleAddNewMemberSubmit;
      case "editMember":
        return handleEmployeeEditSubmit;
      case "addTeam":
        return handleAddNewTeamSubmit;
      case "editTeam":
        return handleTeamEditSubmit;
      case "changeTeam":
        return handleTeamChangeSubmit;
      default:
        return handleAddNewTeamSubmit;
    }
  };

  const modalContent = (type) => {
    switch (type) {
      case "addMember":
        return (
          <ShowForm
            onChange={handleAddNewMemberChange}
            value={newMember}
            onSubmit={chooseSubmit(eventType)}
            onCancel={handleModalCancel}
            disableInput={disableInput}
          />
        );
      case "editMember":
        return (
          <ShowForm
            onChange={handleAddNewMemberChange}
            value={newMember}
            onSubmit={chooseSubmit(eventType)}
            onCancel={handleModalCancel}
            disableInput={disableInput}
          />
        );
      case "view":
        return (
          <ShowEmployeeDetails viewSelectedEmployee={viewSelectedEmployee} />
        );
      case "addTeam":
        return (
          <ShowTeamForm
            onChange={handleAddNewTeamChange}
            value={newTeam}
            onSubmit={chooseSubmit(eventType)}
            onCancel={handleModalCancel}
            error={error}
          />
        );
      case "editTeam":
        return (
          <ShowTeamForm
            onChange={handleAddNewTeamChange}
            value={newTeam}
            onSubmit={chooseSubmit(eventType)}
            onCancel={handleModalCancel}
            error={error}
          />
        );
      case "changeTeam":
        return (
          <TeamChangeContent
            teamsInADepartment={teamsInADepartment}
            selectedTeam={selectedTeam}
            onSubmit={chooseSubmit(eventType)}
            setSelectedTeam={setSelectedTeam}
            onCancel={handleModalCancel}
          />
        );
      default:
        return <Typography variant="h2">This is not expected :/</Typography>;
    }
  };

  return (
    <Stack>
      <AppModal
        openModal={openModal}
        handleClose={() => setOpenModal(false)}
        content={modalContent(eventType)}
      />
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={showAlert.alert}
        autoHideDuration={6000}
        onClose={() => setShowAlert({ alert: false, message: "" })}
      >
        <Alert
          onClose={() => setShowAlert({ alert: false, message: "" })}
          severity="error"
          sx={{ width: "100%" }}
        >
          {showAlert?.message}
        </Alert>
      </Snackbar>
      <Paper sx={{ p: theme.spacing(2), border: "0.1px solid #0000003b" }}>
        <Box display={"flex"} justifyContent="space-between">
          <Typography variant="h5" sx={{ textTransform: "capitalize" }}>
            {data?.name} - {data?.role}
          </Typography>
          <Box display="flex">
            {data?.teams?.length ? (
              <>
                <IconButton onClick={() => setExpand(!expand)}>
                  {expand ? (
                    <VisibilityOffOutlined />
                  ) : (
                    <RemoveRedEyeOutlinedIcon />
                  )}
                </IconButton>
              </>
            ) : null}

            <ActionsMenu
              data={data}
              handleEmployeeEdit={handleEmployeeEdit}
              handleTeamEdit={handleTeamEdit}
              handleViewEmployeeDetails={handleViewEmployeeDetails}
              handleDeleteMember={handleDeleteMemberCheck}
              handleAddMemberClick={handleAddMemberClick}
              handleAddTeamClick={handleAddTeamClick}
              hanldeMemberTeamChange={hanldeMemberTeamChange}
              handleEmployeePromote={handleEmployeePromote}
            />
          </Box>
        </Box>
        <Stack
          p={theme.spacing(1, 2)}
          sx={{ display: `${expand ? "black" : "none"}` }}
        >
          {data?.teams?.map((ele) => (
            <EmployeeCard
              key={ele.id}
              data={ele}
              handleAddNewMember={handleAddNewMember}
              handleEditEmployee={handleEditEmployee}
              handleDeleteMember={handleDeleteMember}
              handleAddTeam={handleAddTeam}
              handleEditTeam={handleEditTeam}
              handleTeamChange={handleTeamChange}
              handleEmployeePromote={handleEmployeePromote}
            />
          ))}
        </Stack>
      </Paper>
    </Stack>
  );
};

export default EmployeeCard;
