import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signin from "./pages/Signin";
import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Setting from "./pages/Setting";
import User from "./pages/Users";
import Accounts from "./pages/Accounts";
import UserDetailPage from "./pages/UserDetailPage";
import HelpCenter from "./pages/HelpCenter";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Signin />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/user" element={<User />} />
            <Route path="/user/:id" element={<UserDetailPage />} />
            <Route path="/setting" element={<Setting />} />
            <Route path="/help-center" element={<HelpCenter />} />
            <Route path="/accounts" element={<Accounts />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
