import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home, StickyNote, CircleUserRound, Recycle , ArrowLeftRight, Calendar, Settings, NotebookPen, Package  } from "lucide-react";
import Sidebar, { SidebarItem } from "./components/Sidebar";
import { LoginPage } from './pages/LoginPage';
import { ProtectedRoute } from './configs/ProtectedRoute';
import { Spinner } from "@nextui-org/react";
import RequestPasswordReset from './configs/RequestPasswordReset';
import ResetPassword from './configs/ResetPassword';
import UserActividad from './pages/UserActividad';
import FloatingButton from './configs/FloatingButton';


// Lazy load the pages
const HomePage = lazy(() => import('./pages/HomePage'));
const ResiduosPage = lazy(() => import('./pages/ResiduosPage'));
const MovimientosPage = lazy(() => import('./pages/MovimientosPage'));
const ActividadesPage = lazy(() => import('./pages/ActividadesPage'));
const UsuariosPage = lazy(() => import('./pages/UsuariosPage'));
const ElementosPage = lazy(() => import('./pages/ElementosPage'));
const ReportesPage = lazy(() => import('./pages/ReportesPage'));
const ConfigsPage = lazy(() => import('./pages/ConfigsPage'));



export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/request-password-reset" element={< RequestPasswordReset />} />
        <Route path="/reset-password" element={<ResetPassword />} />


        <Route path="/usuario-actividad" element={<UserActividad />} />

        <Route path="/home" element={
          <ProtectedRoute>
            <WithSidebar>
              <Suspense fallback={<Spinner label="Default" color="default" labelColor="foreground" />}>
                <HomePage />
              </Suspense>
            </WithSidebar>
          </ProtectedRoute>
        } />
        <Route path="/residuos" element={
          <ProtectedRoute>
            <WithSidebar>
              <Suspense fallback={<Spinner classNames="mx-auto" label="Default" color="default" labelColor="foreground" />}>
                <ResiduosPage />
              </Suspense>
            </WithSidebar>
          </ProtectedRoute>
        } />
        <Route path="/movimientos" element={
          <ProtectedRoute>
            <WithSidebar>
              <Suspense fallback={<Spinner label="Default" color="default" labelColor="foreground" />}>
                <MovimientosPage />
              </Suspense>
            </WithSidebar>
          </ProtectedRoute>
        } />
        <Route path="/actividades" element={
          <ProtectedRoute>
            <WithSidebar>
              <Suspense fallback={<Spinner label="Default" color="default" labelColor="foreground" />}>
                <ActividadesPage />
              </Suspense>
            </WithSidebar>
          </ProtectedRoute>
        } />
        <Route path="/usuarios" element={
          <ProtectedRoute>
            <WithSidebar>
              <Suspense fallback={<Spinner label="Default" color="default" labelColor="foreground" />}>
                <UsuariosPage />
              </Suspense>
            </WithSidebar>
          </ProtectedRoute>
        } />
        <Route path="/elementos" element={
          <ProtectedRoute>
            <WithSidebar>
              <Suspense fallback={<Spinner label="Default" color="default" labelColor="foreground" />}>
                <ElementosPage />
              </Suspense>
            </WithSidebar>
          </ProtectedRoute>
        } />

        <Route path="/reportes" element={
          <ProtectedRoute>
            <WithSidebar>
              <Suspense fallback={<Spinner label="Default" color="default" labelColor="foreground" />}>
                <ReportesPage />
              </Suspense>
            </WithSidebar>
          </ProtectedRoute>
        } />

        
<Route path="/configs" element={
          <ProtectedRoute>
            <WithSidebar>
              <Suspense fallback={<Spinner label="Default" color="default" labelColor="foreground" />}>
                <ConfigsPage />
              </Suspense>
            </WithSidebar>
          </ProtectedRoute>
        } />


      </Routes>
    </BrowserRouter>
  );
};




const WithSidebar = ({ children }) => (
  <div className="flex">
<FloatingButton/>
    <Sidebar>
      <SidebarItem nav="/home" icon={<Home size={20} />} text="Home" />
      <SidebarItem nav="/residuos" icon={<Recycle  size={20} />} text="Residuos" />
      <SidebarItem nav="/movimientos" icon={<ArrowLeftRight size={20} />} text="Movimientos" />
      <SidebarItem nav="/actividades" icon={<Calendar size={20} />} text="Actividades" />
      <SidebarItem nav="/usuarios" icon={<CircleUserRound size={20} />} text="Usuarios" />
      <SidebarItem nav="/elementos" icon={<Package  size={20} />} text="Elementos" />
      <SidebarItem nav="/reportes" icon={<NotebookPen size={20} />} text="Reportes" />
    </Sidebar>
    {children}
  </div>
);
