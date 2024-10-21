import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signup from './pages/signup.jsx';
import Login from './pages/login.jsx';
import Dashboard from './pages/dashboard.jsx';

function App() {
  const [user, setUser] = useState(null); // State to manage user

  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup setUser={setUser} />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/dashboard" element={<Dashboard user={user} />} /> {/* Pass user state if needed */}
      </Routes>
    </Router>
  );
}

export default App;
