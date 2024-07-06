import React from 'react';
import { CalendarActividades } from '../components/actividades/CalendarActividades';
import { Link } from "react-router-dom";

function UserActividad() {
  return (
    <>
      <div className="min-h-screen bg-gray-100 flex flex-col justify-between">
        {/* Encabezado */}
        <header className="bg-white shadow-md p-4">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold text-sky-600">Centro de Recolección de Residuos</h1>
            <nav>
              <ul className="flex space-x-4">
                <Link to="/">
                <li className="text-gray-700 hover:text-sky-600">Login</li>
                </Link>
                {/* <li><a href="/about" className="text-gray-700 hover:text-sky-600">Acerca de</a></li> */}
                <li><a target='_blank' href="https://wa.me/3102455831" className="text-gray-700 hover:text-sky-600">Contacto</a></li>
              </ul>
            </nav>
          </div>
        </header>

        {/* Contenido Principal */}
        <main className="flex-grow container mx-auto p-4 mt-10">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Calendario de Actividades</h2>
            <div className="w-full h-full">
              <CalendarActividades />
            </div>
          </div>
        </main>

        {/* Pie de Página */}
        <footer className="bg-white shadow-md p-4">
          <div className="container mx-auto text-center">
            <p className="text-gray-600">© 2024 Centro de Recolección de Residuos. Todos los derechos reservados.</p>
          </div>
        </footer>
      </div>
    </>
  );
}

export default UserActividad;
