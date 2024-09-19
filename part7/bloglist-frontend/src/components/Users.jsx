import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Users = () => {
  const users = useSelector((state) => state.users);

  return (
    <>
      <h1> Users </h1>
      <table>
        <thead>
          <tr>
            <th> </th>
            <th>
              <em>blogs created</em>
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, id) => (
            <tr key={id}>
              <td>
                {" "}
                <Link to={`/users/${user.id}`}> {user.name} </Link>{" "}
              </td>
              <td>{user.blogs.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};
export default Users;
