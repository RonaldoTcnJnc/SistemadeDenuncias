import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './components/HomePage/HomePage';
import LoginPage from './components/LoginPage/LoginPage';
import CitizenDashboard from './components/CitizenDashboard/CitizenDashboard';
import ProfilePage from './components/ProfilePage/ProfilePage';
import ReportsAnalytics from './components/Reports/ReportsAnalytics';

// Layout para las páginas que tienen la barra lateral
import DashboardLayout from './components/DashboardLayout/DashboardLayout';

// Placeholders (creados en src/components/Placeholders)
import NewReport from './components/Placeholders/NewReport';
import MyReports from './components/Placeholders/MyReports';
import Register from './components/Placeholders/Register';

function App() {
  // Simulación de autenticación. Cambia a `true` para ver las páginas protegidas.
  const isAuthenticated = true;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/iniciar-sesion" element={<LoginPage />} />

        {/* Rutas Protegidas con el Layout del Dashboard */}
        <Route
          path="/panel"
          element={
            isAuthenticated ? (
              <DashboardLayout>
                <CitizenDashboard />
              </DashboardLayout>
            ) : (
              <Navigate to="/iniciar-sesion" />
            )
          }
        />
        <Route
          path="/perfil"
          element={
            isAuthenticated ? (
              <DashboardLayout>
                <ProfilePage />
              </DashboardLayout>
            ) : (
              <Navigate to="/iniciar-sesion" />
            )
          }
        />

        <Route
          path="/informes"
          element={
            isAuthenticated ? (
              <DashboardLayout>
                <ReportsAnalytics />
              </DashboardLayout>
            ) : (
              <Navigate to="/iniciar-sesion" />
            )
          }
        />

        <Route
          path="/nueva-denuncia"
          element={
            isAuthenticated ? (
              <DashboardLayout>
                <NewReport />
              </DashboardLayout>
            ) : (
              <Navigate to="/iniciar-sesion" />
            )
          }
        />

        <Route
          path="/mis-denuncias"
          element={
            isAuthenticated ? (
              <DashboardLayout>
                <MyReports />
              </DashboardLayout>
            ) : (
              <Navigate to="/iniciar-sesion" />
            )
          }
        />

        <Route path="/registro" element={<Register />} />

        {/* Redirección por defecto si no encuentra la ruta */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;