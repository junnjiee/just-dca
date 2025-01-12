import { Routes, Route } from "react-router";
import { DashboardPage } from "@/views/dashboard/page";

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
    </Routes>
  );
}
