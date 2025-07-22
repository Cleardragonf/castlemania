import { useNavigate } from 'react-router-dom';

export const LoginPage = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    // Simulate login
    localStorage.setItem('userId', '1');
    navigate('/home');
  };

  return (
    <div>
      <h1>Login</h1>
      <button onClick={handleLogin}>Login as TestUser</button>
    </div>
  );
};