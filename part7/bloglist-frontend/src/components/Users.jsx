import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { TableContainer, TableHead, Table, TableBody, TableCell, Paper, TableRow } from "@mui/material";

const Users = () => {
  const users = useSelector((state) => state.users);

  return (
    <>
      <h2> Users </h2>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Blogs created</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user, id) => (
              <TableRow key={id}>
                <TableCell>
                  <Link to={`/users/${user.id}`}> {user.name} </Link>{" "}
                </TableCell>
                <TableCell>{user.blogs.length}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};
export default Users;
