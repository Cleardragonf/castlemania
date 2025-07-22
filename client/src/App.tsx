import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {LoginPage} from './pages/LoginPage';
import {GameSession} from './pages/GameSession';
import {HomePage} from './pages/HomePage';

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/game" element={<GameSession />} />
    </Routes>
  </Router>
);

export default App;
