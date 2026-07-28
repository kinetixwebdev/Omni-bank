import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signin from "./pages/Signin";
import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Transaction from "./pages/Transaction";
import Setting from "./pages/Setting";
import TransferMoney from "./pages/TransferMoney";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Signin />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/transactions" element={<Transaction />} />
            <Route path="/transfer/money" element={<TransferMoney />} />
            <Route path="/setting" element={<Setting />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
