const User = ({ user }) => {
  console.log("navigate to user info page", user);

  return (
    <>
      {!user ? (
        <p>...loading user</p>
      ) : (
        <>
          {user?.name ? <h2>{user.name}</h2> : <h2>Unnamed User</h2>}
          <h3> added blogs </h3>
          <ul>
            {user.blogs.map((b) => (
              <li key={b.id}>{b.title}</li>
            ))}
          </ul>
        </>
      )}
    </>
  );
};
export default User;
