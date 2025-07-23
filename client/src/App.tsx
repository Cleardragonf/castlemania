import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {LoginPage} from './pages/LoginPage';
import {GameSession} from './pages/GameSession';
import {HomePage} from './pages/HomePage';
import { ResourceProvider } from './contexts/ResourceContext';

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/game" element={
        <ResourceProvider>
          <GameSession />
        </ResourceProvider>
      } />
    </Routes>
  </Router>
);

export default App;
