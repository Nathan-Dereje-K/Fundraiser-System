import { useContext } from 'react';
import { AuthContext } from '../auth/AuthContext';

export default function TempAuthControls() {
  const { user, login, logout } = useContext(AuthContext);

  return (
    <div className="temp-auth">
      {user ? (
        <>
          <span>Logged in as: {user.name}</span>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <button onClick={login}>Mock Login</button>
      )}
    </div>
  );
}