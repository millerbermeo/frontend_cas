import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LayoutDashboard, Home, StickyNote, CircleUserRound, Trash2, ArrowLeftRight, Calendar, Settings } from "lucide-react";
import Sidebar, { SidebarItem } from "./components/Sidebar";
import { LoginPage } from './pages/LoginPage';

// Lazy load the pages
const HomePage = lazy(() => import('./pages/HomePage'));
const ResiduosPage = lazy(() => import('./pages/ResiduosPage'));
const MovimientosPage = lazy(() => import('./pages/MovimientosPage'));
const ActividadesPage = lazy(() => import('./pages/ActividadesPage'));
const UsuariosPage = lazy(() => import('./pages/UsuariosPage'));
const ElementosPage = lazy(() => import('./pages/ElementosPage'));

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LoginPage />} />
        {/* Routes for pages with sidebar */}
        <Route path='/home' element={<WithSidebar><Suspense fallback={<div>Loading...</div>}><HomePage /></Suspense></WithSidebar>} />
        <Route path='/residuos' element={<WithSidebar><Suspense fallback={<div>Loading...</div>}><ResiduosPage /></Suspense></WithSidebar>} />
        <Route path='/movimientos' element={<WithSidebar><Suspense fallback={<div>Loading...</div>}><MovimientosPage /></Suspense></WithSidebar>} />
        <Route path='/actividades' element={<WithSidebar><Suspense fallback={<div>Loading...</div>}><ActividadesPage /></Suspense></WithSidebar>} />
        <Route path='/usuarios' element={<WithSidebar><Suspense fallback={<div>Loading...</div>}><UsuariosPage /></Suspense></WithSidebar>} />
        <Route path='/elementos' element={<WithSidebar><Suspense fallback={<div>Loading...</div>}><ElementosPage /></Suspense></WithSidebar>} />
      </Routes>
    </BrowserRouter>
  );
};

// Component to wrap pages with the sidebar
const WithSidebar = ({ children }) => (
  <div className='flex'>
    <Sidebar>
      <SidebarItem nav="/home" icon={<Home size={20} />} text="Home" />
      <SidebarItem nav="/residuos" icon={<Trash2 size={20} />} text="Residuos"/>
      <SidebarItem nav="/movimientos" icon={<ArrowLeftRight size={20} />} text="Movimientos" />
      <SidebarItem nav="/actividades" icon={<Calendar size={20} />} text="Actividades"/>
      <SidebarItem nav="/usuarios" icon={<CircleUserRound size={20} />} text="Usuarios" />
      <SidebarItem nav="/elementos" icon={<LayoutDashboard size={20} />} text="Elementos"/>
    </Sidebar>
    {children}
  </div>
);
