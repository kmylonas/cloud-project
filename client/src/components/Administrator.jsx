import * as React from "react";
import { Container, Pagination } from "@mui/material";
import { Box } from "@mui/material/";
import CustomTable from "../common/CustomTable";
import { paginate } from "../utils/paginate";
import { useState } from "react";
import { useEffect } from "react";
import EditForm from "./EditForm";
import Joi from "joi";
import { validateField, validateForm } from "../utils/validation";
import { toast } from "react-toastify";
import Layout from "./layout/Layout";
import { deleteUser, getUsers, updateUser } from "../services/usersService";

function Administrator(props) {
  const { user } = props;
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [data, setData] = useState({});
  const [errors, setErrors] = useState({});

  useEffect(() => {
    async function getAllUsers() {
      const { data } = await getUsers();

      setUsers(data);
    }

    getAllUsers();
  }, []);

  const tableHead = ["First Name", "Last Name", "E-mail", "Role", "Status", ""];

  function handlePageChange(e, page) {
    setCurrentPage(page);
  }

  const schema = Joi.object({
    _id: Joi.string(),
    firstname: Joi.string().min(3).max(20).required(),
    lastname: Joi.string().min(3).max(20).required(),
    email: Joi.string().email({ tlds: false }).required(),
    status: Joi.string().valid("approved", "unapproved").required(),
    role: Joi.string().valid("admin", "seller", "user").required(),
    cart: Joi.array(),
  });

  async function handleDelete(user) {
    const originalUsers = [...users];
    const tmpUsers = users.filter((u) => u._id != user._id);
    setUsers(tmpUsers);

    try {
      await deleteUser(user._id);
      toast.success("User deleted");
    } catch (ex) {
      if (ex.response && ex.response.status === 404) {
        toast.error("This user was already deleted");
      } else {
        //unexpected error
        setUsers(originalUsers);
      }
    }
  }

  function handleChange(e) {
    const val = e.target.value;
    const name = e.target.name;
    const errorMessage = validateField(name, val, schema);
    const tmpErrors = { ...errors };
    if (errorMessage) tmpErrors[name] = errorMessage;
    else delete tmpErrors[name];

    const tmpData = { ...data };
    tmpData[name] = val;
    setErrors(tmpErrors);
    setData(tmpData);
  }

  function handleEdit(user) {
    setData(user);
    setOpen(true);
  }

  function handleClose() {
    setErrors({});
    setOpen(false);
  }

  async function handleSubmit() {
    const originalUsers = [...users];

    const tmpErrors = validateForm(data, schema);
    console.log(tmpErrors);
    setErrors(tmpErrors || {});
    if (tmpErrors) return;

    //Call backend for post to
    //update user

    try {
      await updateUser(data);
      findAndUpdate(data);
      toast.success("You have successfully updated the user");
    } catch (ex) {
      if (ex.response && ex.response.status === 403)
        toast.error(ex.response.data);
      else if (ex.repsonse && ex.response.status === 404)
        toast.error("The user was not found");
      //unexpected error
      else setUsers(originalUsers);
    }

    setOpen(false);
  }

  function findAndUpdate(data) {
    var idx = -1;
    for (let i = 0; i < users.length; i++) {
      if (users[i]._id === data._id) {
        idx = i;
        break;
      }
    }
    const tmpUsers = [...users];
    tmpUsers[idx] = { ...data };
    setUsers(tmpUsers);
  }

  const pageSize = 5;
  const count = users.length;
  const totalPages = Math.ceil(count / pageSize);
  const usersToRender = paginate(users, pageSize, currentPage);

  console.log(usersToRender);

  return (
    <React.Fragment>
      <Layout user={user}>
        <Container sx={{ height: "100vh" }}>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            height="100%"
            alignItems="center"
          >
            <Box width="90%">
              <CustomTable
                head={tableHead}
                data={usersToRender}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
              <Pagination
                count={totalPages}
                color="primary"
                sx={{ marginTop: 3 }}
                page={currentPage}
                onChange={(e, p) => handlePageChange(e, p)}
              />
            </Box>
          </Box>
        </Container>
        <EditForm
          open={open}
          onClose={handleClose}
          data={data}
          errors={errors}
          onChange={handleChange}
          onSubmit={handleSubmit}
        />
      </Layout>
    </React.Fragment>
  );
}

export default Administrator;
