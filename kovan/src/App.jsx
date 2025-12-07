import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import Applications from './pages/Applications';
import UserProfile from './pages/UserProfile';
import Discover from './pages/Discover';
import Login from './pages/Login';
import Statistics from './pages/Statistics';
import HashtagThread from './pages/HashtagThread';
import Me from './pages/Me';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import './styles/globals.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/me" element={<Me />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile/:userId" element={<UserProfile />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/projects" element={<Applications />} />
        <Route path="/statistics" element={<Statistics />} />
        <Route path="/login" element={<Login />} />
        <Route path="/hashtag/:slug" element={<HashtagThread />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
      </Routes>
    </Router>
  );
}

export default App;
