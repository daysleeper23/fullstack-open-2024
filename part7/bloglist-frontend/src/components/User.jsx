const User = ({ user }) => {
  
  console.log('navigate to user info page', user)

  return (
    <>
      {!user 
        ? <p>...loading user</p>
        : <>
            {user?.name ? <h1>{user.name}</h1> : <h1>Unnamed User</h1>}
            <h2> added blogs </h2>
            <ul>
              {user.blogs.map(b => 
                <li key={b.id}>
                  {b.title}
                </li>
              )}
            </ul>
          </> 
      }
    </>
  )
};
export default User;
