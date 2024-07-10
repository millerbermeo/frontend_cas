import React, { useState, useEffect } from 'react';
import logo from "../assets/logocas.png";
import logo2 from "../assets/logoSenaNaranja.png";
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { Progress } from "@nextui-org/react";
import axiosClient from '../configs/axiosClient';
import { Calendar } from "lucide-react";

export const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [usernameFocused, setUsernameFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progressVisible, setProgressVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(''); // Estado para el mensaje de error

  const navigate = useNavigate();

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate("/home");
    }
  }, []);

  useEffect(() => {
    if (progressVisible) {
      let interval = setInterval(() => {
        setProgress((prev) => {
          if (prev < 100) return prev + 2;
          clearInterval(interval);
          return prev;
        });
      }, 10);

      return () => clearInterval(interval);
    }
  }, [progressVisible]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(''); // Limpiar cualquier error previo

    try {
      const data = { email: username, password };
      const response = await axiosClient.post('/validar', data);

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('rol', response.data.rol);
        localStorage.setItem('nombre', response.data.nombre);
        localStorage.setItem('id', response.data.id);

        setProgressVisible(true);
        setTimeout(() => {
          setLoading(false);
          setProgressVisible(false);
          if (response.data.rol === 'administrador') {
            navigate("/home");
          } else if (response.data.rol === 'operario') {
            navigate("/usuario-actividad");
          } else {
            navigate("/");
          }
        }, 1000);
      } else {
        setLoading(false);
        setError("Error al iniciar sesión. Información inválida.");
      }
    } catch (error) {
      setLoading(false);
      console.error('Error during login:', error);
      setError("Error al iniciar sesión. Información inválida.");
    }
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleUsernameFocus = () => {
    setUsernameFocused(true);
  };

  const handleUsernameBlur = () => {
    if (!username) {
      setUsernameFocused(false);
    }
  };

  const handlePasswordFocus = () => {
    setPasswordFocused(true);
  };

  const handlePasswordBlur = () => {
    if (!password) {
      setPasswordFocused(false);
    }
  };

  const handleUsernameClick = () => {
    setUsernameFocused(true);
  };

  const handlePasswordClick = () => {
    setPasswordFocused(true);
  };

  return (
    <>
      <div className="h-screen bg-slate-100 py-6 flex flex-col justify-center sm:py-12">
        {progressVisible && (
          <div className='w-full h-screen fixed flex justify-center items-center bg-black z-20 opacity-85'>
            <div className="z-50 w-80 text-white opacity-100">
              <Progress
                aria-label="Progress"
                size="lg"
                value={progress}
                color="primary"
                showValueLabel={true}
                className="max-w-xl w-full opacity-100"
              />
            </div>
          </div>
        )}
        <div className="relative py-3 sm:max-w-xl scale-90 md:scale-100 sm:mx-auto ">
          <div className="absolute inset-0 bg-sky-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
          <div className="relative px-4 py-2 bg-white shadow-lg sm:rounded-3xl p-3 w-[450px] h-[550px]">
            <div className="max-w-96 mx-auto">
              <section className="gradient-form h-full text-black">
                <div className="container h-full">
                  <div className="flex h-full flex-wrap items-center justify-center dark:text-black">
                    <div className="w-full">
                      <div className="block rounded-lg">
                        <div className="g-0 lg:flex lg:flex-wrap">
                          <div className="px-4 md:px-0 lg:w-full">
                            <div className="md:mx-6 ">
                              <div className="text-center pt-10 flex flex-col items-center">
                                <img
                                  className="w-40 h-auto"
                                  src={logo}
                                  alt="logo"
                                />
                                <h4 className="mb-4 mt-1 pb-1 text-xl font-semibold">
                                  Centro de Acopio Yamboro
                                </h4>
                              </div>
                              <form onSubmit={handleSubmit}>
                                <p className="mb-4">Por favor, ingrese a su cuenta</p>
                                <div className="relative mb-4">
                                  <input
                                    type="text"
                                    className="peer block min-h-[auto] w-full rounded border border-cyan-400 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[twe-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-black dark:placeholder:text-neutral-300 dark:autofill:shadow-autofill dark:peer-focus:text-primary [&:not([data-twe-input-placeholder-active])]:placeholder:opacity-0"
                                    id="exampleFormControlInput1"
                                    placeholder=""
                                    value={username}
                                    onChange={handleUsernameChange}
                                    onFocus={handleUsernameFocus}
                                    onBlur={handleUsernameBlur}
                                    onClick={handleUsernameClick}
                                  />
                                  <label
                                    htmlFor="exampleFormControlInput1"
                                    className={`pointer-events-none absolute top-0 rounded-md px-1 bg-white left-3 max-w-[90%] mt-1 leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:text-primary ${username || usernameFocused ? 'transform translate-y-[-16px] text-sm text-black' : ''}`}
                                  >
                                    Email
                                  </label>
                                </div>
                                <div className="relative mb-4">
                                  <input
                                    type={showPassword ? "text" : "password"}
                                    className="peer block min-h-[auto] w-full rounded border border-cyan-400 bg-transparent px-3 py-[0.32rem] leading-[1.6] outline-none transition-all duration-200 ease-linear focus:placeholder:opacity-100 peer-focus:text-primary data-[twe-input-state-active]:placeholder:opacity-100 motion-reduce:transition-none dark:text-black dark:placeholder:text-neutral-300 dark:autofill:shadow-autofill dark:peer-focus:text-primary [&:not([data-twe-input-placeholder-active])]:placeholder:opacity-0"
                                    id="exampleFormControlInput11"
                                    placeholder=" "
                                    value={password}
                                    onChange={handlePasswordChange}
                                    onFocus={handlePasswordFocus}
                                    onBlur={handlePasswordBlur}
                                    onClick={handlePasswordClick}
                                  />
                                  <button
                                    onClick={togglePasswordVisibility}
                                    type="button"
                                    className="absolute inset-y-0 right-3 flex items-center"
                                  >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                  </button>
                                  <label
                                    htmlFor="exampleFormControlInput11"
                                    className={`pointer-events-none absolute top-0 rounded-md px-1 bg-white left-3 max-w-[90%] mt-1 leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:text-primary ${password || passwordFocused ? 'transform translate-y-[-16px] text-sm text-black' : ''}`}
                                  >
                                    Password
                                  </label>
                                </div>
                                <div className="mb-6 pb-1 pt-1 text-center">
                                  <button
                                    onClick={handleSubmit}
                                    className="mb-3 bg-gradient-to-r from-cyan-400 to-sky-600 inline-block w-full rounded px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-black shadow-dark-3 transition duration-150 ease-in-out hover:shadow-dark-2 focus:shadow-dark-2 focus:outline-none focus:ring-0 active:shadow-dark-2 dark:shadow-black/30 dark:hover:shadow-dark-strong dark:focus:shadow-dark-strong dark:active:shadow-dark-strong"
                                    type="submit"
                                  >
                                    Log in
                                  </button>
                                  <Link to="/request-password-reset">
                                    <span>¿Has olvidado tu contraseña?</span>
                                  </Link>
                                </div>
                                {error && (
                                  <div className="mb-6 text-red-500 text-center">
                                    {error}
                                  </div>
                                )}

                              </form>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>



        {/* <div className='hidden w-80 2xl:w-full md:flex fixed top-10 left-10 bg-white max-w-md p-6 rounded-lg shadow-lg'>
          <div className='text-center'>
            <h2 className='text-2xl font-bold text-sky-600'>Centro de Recolección de Residuos</h2>
            <p className='text-gray-700 mt-4'>
              El Centro de Recolección de Residuos del SENA gestiona y recicla residuos,
              promoviendo la sostenibilidad y utilizando tecnologías avanzadas para su seguimiento.
            </p>
          </div>
        </div> */}

        {/* Calendario de Actividades */}
        <Link to="/usuario-actividad">
          <div className='hidden md:flex flex-col justify-center items-center fixed top-10 right-10 bg-white w-[220px] p-6 rounded-lg shadow-lg'>
            <Calendar size={80} className='text-sky-600 mb-4' />
            <h2 className='text-base text-sky-600 font-medium text-center'>Ingresar a <br /> Calendario de Actividades</h2>
          </div>
        </Link>

        {/* Pie de página */}
        <div className='fixed flex flex-col items-start bottom-10 left-10'>
          <div className='flex items-end pb-2'>
            <img src={logo2} className='w-24' alt="Logo SENA" />
            <p className='text-xl ml-2'>Sede Yamboro</p>
          </div>
          <span className='text-gray-600'>© Todos los derechos reservados.</span>
        </div>
      </div>
    </>
  );
};
