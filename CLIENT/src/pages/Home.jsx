import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
const Home = () => {
  const { user, handleLogout } = useAuth();

  useEffect(() => {
    console.log(user);
  }, [user]);

  if (!user)
    return (
      <h2>
        Not logged in <br /> <a href="/signup">SignUp</a>
      </h2>
    );

  return (
    <div>
      <h2>
        Welcome, {user.userId}! {user.role}
      </h2>
      <a href="/dashboard">dashboard</a>
      <br />
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Home;
