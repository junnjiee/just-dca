import { AppProvider } from '@/app/provider';
import { AppRoutes } from '@/app/routes';
import '@/globals.css';

export function App() {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  );
}
