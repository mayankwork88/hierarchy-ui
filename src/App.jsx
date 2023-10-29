import { EmployeeCard } from "./components";
import { useDispatch, useSelector } from "react-redux";
import SearchEmp from "./components/SearchEmp";
import ShowEmployeeDetails from "./components/ShowEmployeeDetails";
import {
  addTeamMember,
  removeTeamMember,
  updateEmployeeInfo,
  createNewTeam,
  updateTeam,
  promoteEmployee,
} from "./store";
import { useEffect, useState } from "react";
import { Container, Stack } from "@mui/material";
import TabPane from "./components/TabPane";
import Navbar from "./components/Navbar";
import { useTheme } from "@emotion/react";

const App = () => {
  const dispatch = useDispatch();
  const theme = useTheme();

  const state = useSelector((state) => state.company);
  const [searchQuery, setSearchQuery] = useState("");
  const [companyInfo, setCompanyInfo] = useState(state);
  const [filteredEmp, setFilteredEmp] = useState([]);

  useEffect(() => {
    setCompanyInfo(state);
  }, [state]);

  const handleAddNewMember = (teamId, newMember) => {
    const data = { teamId, newMember };
    dispatch(addTeamMember(data));
  };

  const handleEditEmployee = (employeeId, updatedEmployee) => {
    const data = { employeeId, updatedEmployee };
    dispatch(updateEmployeeInfo(data));
  };

  const handleDeleteMember = (id) => {
    dispatch(removeTeamMember(id));
  };

  const handleAddTeam = (departmentId, newTeam) => {
    const data = { departmentId, newTeam };
    console.log(data);
    dispatch(createNewTeam(data));
  };

  const handleEditTeam = (teamId, updatedTeam) => {
    const data = { teamId, updatedTeam };
    dispatch(updateTeam(data));
  };

  const handleTeamChange = (teamInfo, newMember) => {
    const data = { teamId: teamInfo.newTeamId, newMember };
    dispatch(removeTeamMember(newMember.id));
    dispatch(addTeamMember(data));
  };

  const handleEmployeePromote = (empId) => {
    dispatch(promoteEmployee(empId));
  };
  const searchedResults = [];
  const getSelectedEmployee = (tree, query) => {
    const isName = tree?.name?.toLowerCase()?.includes(query?.toLowerCase());
    const isEmail = tree?.email?.toLowerCase()?.includes(query?.toLowerCase());
    const isPhone = tree?.phone?.toLowerCase()?.includes(query?.toLowerCase());
    if (isName || isEmail || isPhone) {
      searchedResults.push(tree);
    }
    if (tree.teams && Array.isArray(tree.teams)) {
      for (const team of tree.teams) {
        getSelectedEmployee(team, query);
      }
    }
    return null; // Member with the specified ID not found
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = () => {
    if (searchQuery.length) {
      getSelectedEmployee(state, searchQuery);
      setFilteredEmp(searchedResults);
    }
  };

  const handleGoBack = () => {
    setFilteredEmp([]);
    setSearchQuery("");
  };
  return (
    <Stack>
      <Navbar />
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: theme.spacing(2),
          py: theme.spacing(2),
        }}
      >
        <SearchEmp
          handleSearch={handleSearchChange}
          searchQuery={searchQuery}
          handleSearchSubmit={handleSearchSubmit}
        />
        {filteredEmp?.length ? (
          <TabPane
            text="searched results"
            btnText="go back"
            onClick={handleGoBack}
          />
        ) : null}
        {filteredEmp?.length ? (
          <Stack direction="row" p={2} gap={2} flexWrap="wrap">
            {filteredEmp.map((ele) => (
              <ShowEmployeeDetails key={ele.id} viewSelectedEmployee={ele} />
            ))}
          </Stack>
        ) : (
          <EmployeeCard
            key={companyInfo.id}
            data={companyInfo}
            handleAddNewMember={handleAddNewMember}
            handleEditEmployee={handleEditEmployee}
            handleDeleteMember={handleDeleteMember}
            handleAddTeam={handleAddTeam}
            handleEditTeam={handleEditTeam}
            handleTeamChange={handleTeamChange}
            handleEmployeePromote={handleEmployeePromote}
          />
        )}
      </Container>
    </Stack>
  );
};

export default App;
