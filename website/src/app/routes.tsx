import { Routes, Route } from "react-router";
import { DashboardPage } from "@/views/dashboard/DashboardPage";
import { RootLayout } from "@/views/root-layout/RootLayout";

import { UserInputProvider } from "@/contexts/user-input";

export function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <RootLayout>
            <UserInputProvider>
              <DashboardPage />
            </UserInputProvider>
          </RootLayout>
        }
      />
    </Routes>
  );
}
