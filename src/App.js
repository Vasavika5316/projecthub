import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './login.js';
import Home from './home.js';
import ChangePassword from './changepassword.js'
import Profile from './profile.js';
import Activity from './activity.js';
import Contact from './contact.js';

export function App() {
  const isLoggedIn = !!localStorage.getItem("regdNo");
    return (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/changepassword" element={<ChangePassword/>}/>
            <Route path="/profile" element={<Profile/>}/>
            <Route path="/myactivity" element={<Activity/>}/>
            <Route path="/contact" element={<Contact/>}/>
          </Routes>
        </BrowserRouter>
    );
}
