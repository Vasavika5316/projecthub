import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './login.js';
import Home from './home.js';
import AHome from './ahome.js';
import ChangePassword from './changepassword.js';
import AChangePassword from './achangepassword.js'
import Profile from './profile.js';
import Activity from './activity.js';
import Contact from './contact.js';
import DV from './dv.js';
import FHome from './fhome.js';
import FProfile from './fprofile.js';
import FChangePassword from './fchangepassword.js';
import FActivity from './factivity.js';
import FDV from './fdv.js';
import ADV from './adv.js';
import FContact from './fcontact.js';
import AContact from './acontact.js';
import AddStudent from './addstudent.js';
import AddFaculty from './addfaculty.js';
export function App() {
  const isLoggedIn = !!localStorage.getItem("regdNo");
    return (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/addstudent" element={<AddStudent />} />
            <Route path="/addfaculty" element={<AddFaculty />} />
            <Route path="/changepassword" element={<ChangePassword/>}/>
            <Route path="/profile" element={<Profile/>}/>
            <Route path="/myactivity" element={<Activity/>}/>
            <Route path="/contact" element={<Contact/>}/>
            <Route path="/acontact" element={<AContact/>}/>
            <Route path="/datavisualization" element={<DV/>}/>
            <Route path="/fhome" element={<FHome/>}/>
            <Route path="/ahome" element={<AHome/>}/>
            <Route path="/fprofile" element={<FProfile/>}/>
            <Route path="/fchangepassword" element={<FChangePassword/>}/>
            <Route path="/achangepassword" element={<AChangePassword/>}/>
            <Route path="/fmyactivity" element={<FActivity/>}/>
            <Route path="/fdatavisualization" element={<FDV/>}/>
            <Route path="/adatavisualization" element={<ADV/>}/>
            <Route path="/fcontact" element={<FContact/>}/>
          </Routes>
        </BrowserRouter>
    );
}