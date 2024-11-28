import React from "react";
import { BrowserRouter, Route, Router, Routes } from "react-router-dom"
import LogIn from '../pages/LogIn.jsx';
import SignUp from '../pages/SignUp.jsx';
import AddPrisonForm from "../pages/PrisonForm.jsx";
import Dashboard from "../pages/Dashboard.jsx";
import Prisons from "../pages/Prisons.jsx";
import EditPrisonForm from "../pages/EditPrison.jsx";
import ViewPrisonDetails from "../pages/DisplayPrison.jsx";
import Home from "../pages/Home.jsx";
import Cells from "../pages/Cells.jsx";
import AddCellForm from "../pages/CellForm.jsx";
import EditCellForm from "../pages/EditCell.jsx";
import ViewCellDetails from "../pages/DisplayCell.jsx";
import CrimesList from "../pages/Crimes.jsx";
import AddCrimeForm from "../pages/CrimeForm.jsx";
import ViewCrimeDetails from "../pages/DisplayCrime.jsx";
import EditCrimeForm from "../pages/EditCrime.jsx";
import AddInmateForm from "../pages/InmateForm.jsx";
import InmatesList from "../pages/Inmates.jsx";
import EditInmateForm from "../pages/EditInmate.jsx";
import ViewInmateDetails from "../pages/DisplayInmate.jsx";
import AddVisitorForm from "../pages/VisitorForm.jsx";
import VisitorsList from "../pages/Visitors.jsx";
import EditVisitorForm from "../pages/EditVisitor.jsx";
import ViewVisitorDetails from "../pages/DisplayVisitor.jsx";
import LandingPage from "../pages/LandingPage.jsx";
import Navbar from "./Components/Navbar.jsx";

export default function App() {
  return (
    <BrowserRouter>
     <Navbar />
      <Routes>
        <Route path="/login" element={<LogIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/addPrison" element={<AddPrisonForm />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/prisons" element={<Prisons />} />
        <Route path="/editPrison/:id" element={<EditPrisonForm />} />
        <Route path="/getPrison/:id" element={<ViewPrisonDetails />} />
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/cells" element={<Cells />} />
        <Route path="/addCell" element={<AddCellForm />} />
        <Route path="/editCell/:id" element={<EditCellForm />} />
        <Route path="/getCell/:id" element={<ViewCellDetails />} />
        <Route path="/crimes" element={<CrimesList />} />
        <Route path="/addCrime" element={<AddCrimeForm />} />
        <Route path="/getCrime/:id" element={<ViewCrimeDetails />} />
        <Route path="/editCrime/:id" element={<EditCrimeForm />} />
        <Route path="/addInmate" element={<AddInmateForm />} />
        <Route path="/inmates" element={<InmatesList />} />
        <Route path="/editInmate/:id" element={<EditInmateForm />} />
        <Route path="/getInmate/:id" element={<ViewInmateDetails />} />
        <Route path="/addVisitor" element={<AddVisitorForm />} />
        <Route path="/visitors" element={<VisitorsList />} />
        <Route path="/editVisitor/:id" element={<EditVisitorForm />} />
        <Route path="/getVisitor/:id" element={<ViewVisitorDetails />} />
        <Route path="/" element={<LandingPage />} />
      </Routes>
    </BrowserRouter>
  )
}