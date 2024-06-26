import React, { useState, useEffect } from 'react';
import logo from "../assets/logo2.png";
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import axiosClient from '../configs/axiosClient';


export const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [usernameFocused, setUsernameFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [loading, setLoading] = useState(false); 
  const navegation = useNavigate();

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navegation("/home");
    }
}, [navegation]);


const handleSubmit = async (event) => {
  event.preventDefault();

  try {
    const data = { email: username, password };
    const response = await axiosClient.post('/validar', data);
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('rol', response.data.rol);
      localStorage.setItem('nombre', response.data.nombre);

      setLoading(true); // Activar el loader solo después de una respuesta exitosa

      setTimeout(() => {
        setLoading(false); // Desactivar el loader antes de la navegación
        if (response.data.rol === 'administrador') {
          navegation("/home");
        } else {
          navegation("/");
        }
      }, 2000); // Retraso de 2 segundos antes de redirigir
    }
  } catch (error) {
    console.error('Error during login:', error);
    alert("Error al iniciar sesión");
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
      <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      {loading && <div className='w-full h-screen fixed flex justify-center items-center bg-black z-20 opacity-70'><div className="progress z-50 bg-white"></div></div>} 
        <div className="relative py-3 sm:max-w-xl sm:mx-auto">
          <div
            className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-green-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"
          ></div>
          <div className="relative px-4 py-2 bg-white shadow-lg sm:rounded-3xl p-3 w-[450px] h-[550px]">
            <div className="max-w-96 mx-auto">
              <section className="gradient-form h-full text-black">
                <div className="container h-full ">
                  <div className="flex h-full flex-wrap items-center justify-center dark:text-black">
                    <div className="w-full">
                      <div className="block rounded-lg">
                        <div className="g-0 lg:flex lg:flex-wrap">
                          <div className="px-4 md:px-0 lg:w-full">
                            <div className="md:mx-6 ">
                              <div className="text-center flex flex-col items-center">
                                <img
                                  className="w-48"
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
                                    placeholder=" "
                                    value={username}
                                    onChange={handleUsernameChange}
                                    onFocus={handleUsernameFocus}
                                    onBlur={handleUsernameBlur}
                                    onClick={handleUsernameClick}
                                  />
                                  <label
                                    htmlFor="exampleFormControlInput1"
                                    className={`pointer-events-none absolute top-0 bg-white left-3 max-w-[90%] mt-1 leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:text-primary ${username || usernameFocused ? 'transform translate-y-[-16px] text-sm text-black' : ''}`}
                                  >
                                    Username
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
                                    className={`pointer-events-none absolute top-0 bg-white left-3 max-w-[90%] mt-1 leading-[1.6] text-neutral-500 transition-all duration-200 ease-out peer-focus:text-primary ${password || passwordFocused ? 'transform translate-y-[-16px] text-sm text-black' : ''}`}
                                  >
                                    Password
                                  </label>
                                </div>
                                <div className="mb-6 pb-1 pt-1 text-center">
                                  <button
                                    onClick={handleSubmit}
                                    className="mb-3 bg-gradient-to-r from-cyan-200 to-green-500  inline-block w-full rounded px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-black shadow-dark-3 transition duration-150 ease-in-out hover:shadow-dark-2 focus:shadow-dark-2 focus:outline-none focus:ring-0 active:shadow-dark-2 dark:shadow-black/30 dark:hover:shadow-dark-strong dark:focus:shadow-dark-strong dark:active:shadow-dark-strong"
                                    type="submit"
                                  >
                                    Log in
                                  </button>
                                  <a href="#!">¿Has olvidado tu contraseña?</a>
                                </div>
                                <div className="flex items-center justify-between pb-6">
                                  <p className="mb-0 me-2">¿No tienes una cuenta?</p>
                                </div>
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
      </div>
    </>
  );
};
