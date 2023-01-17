import "./App.css";
import { Error, Landing, ProtectedRoute, Register } from "./pages";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import {
  AddJob,
  AllJob,
  Profile,
  SharedLayout,
  Stats,
} from "./pages/dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <SharedLayout />
            </ProtectedRoute>
          }
        >
          {/* thêm index attribue thì bỏ cái path =...  */}
          <Route index element={<Stats />} />
          <Route path="/all-jobs" element={<AllJob />} />
          <Route path="/add-job" element={<AddJob />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
        <Route path="/register" element={<Register />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
