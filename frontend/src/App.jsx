import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import UpdateProfile from "./pages/UpdateProfile";
import ResetPassword from "./pages/ResetPassword";
import ProtectedRoute from "./component/ProtectedRoute";
import { Toaster } from "react-hot-toast";
import BirthdayCard from "./pages/BirthdayWishes";
import Dashboard from "./component/dashBoard/Dashboard";
import AdminPanel from "./component/dashBoard/AdminPanel";

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<BirthdayCard/>} />

        <Route path="/loginHome" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
                 {/* ✅ Protected Pages */}
         <Route element={<ProtectedRoute />}>
           <Route path="/update" element={<UpdateProfile />} />
           <Route path="/dashboard" element={<Dashboard />} />
         </Route>

         {/* ✅ Admin Pages */}
         <Route element={<AdminPanel />}>
           <Route path="/admin" element={<AdminPanel />} />
         </Route>

        {/* Protected */}
        {/* <Route element={<ProtectedRoute />}>
          <Route path="/update" element={<UpdateProfile />} />
        </Route> */}
      </Routes>
    </BrowserRouter>
  );
}











// import React from "react";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import Register from "./pages/Register";
// import Login from "./pages/Login";
// import ForgotPassword from "./pages/ForgotPassword";
// import ResetPassword from "./pages/ResetPassword";
// import UpdateProfile from "./pages/UpdateProfile";
// import Dashboard from "./pages/Dashboard";
// import AdminPanel from "./pages/AdminPanel";
// import ProtectedRoute from "./components/ProtectedRoute";
// import AdminRoute from "./components/AdminRoute";
// import { Toaster } from "react-hot-toast";

// export default function App() {
//   return (
//     <BrowserRouter>
//       <Toaster position="top-right" />
//       <Routes>
//         <Route path="/" element={<Login />} />

//         <Route path="/register" element={<Register />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/forgot-password" element={<ForgotPassword />} />
//         <Route path="/reset-password/:token" element={<ResetPassword />} />

//         {/* ✅ Protected Pages */}
//         <Route element={<ProtectedRoute />}>
//           <Route path="/update" element={<UpdateProfile />} />
//           <Route path="/dashboard" element={<Dashboard />} />
//         </Route>

//         {/* ✅ Admin Pages */}
//         <Route element={<AdminRoute />}>
//           <Route path="/admin" element={<AdminPanel />} />
//         </Route>
//       </Routes>
//     </BrowserRouter>
//   );
// }







// import { useState } from 'react'
// // import FtpDownloader from "./component/FtpDownloader"
// import Login from "./pages/Login"


// function App() {

//   return (
//     <>
//     <div style={{backgroundColor:"gray"}}>
//       <Login/>
    
//     {/* <FtpDownloader/> */}
//     </div>
    
//     </>
//   )
// }

// export default App
