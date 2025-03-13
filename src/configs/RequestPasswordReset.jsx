import React, { useState } from 'react';
import { Input, Button, Card } from '@nextui-org/react';
import { useNavigate } from 'react-router-dom';
import axiosClient from './axiosClient';
import { SweetAlert } from './SweetAlert'; // Asegúrate de importar correctamente

const RequestPasswordReset = () => {
  const [email, setEmail] = useState('');
  const [alertProps, setAlertProps] = useState({ type: '', message: '' });
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!email) {
      setAlertProps({ type: 'error', message: 'El correo electrónico no puede estar vacío.' });
      return;
    }

    try {
      await axiosClient.post('usuario/request-password-reset', { email });
      setAlertProps({
        type: 'success',
        message: 'Correo de restablecimiento de contraseña enviado.',
      });
      setTimeout(() => navigate('/'), 2000); // Redirige al login después de 2 segundos
    } catch (error) {
      console.error('Error al solicitar el restablecimiento de contraseña:', error);
      setAlertProps({
        type: 'error',
        message: 'Error al solicitar el restablecimiento de contraseña.',
      });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <form onSubmit={handleSubmit}>
          <h2 className="text-center mb-6 text-2xl font-bold">Restablecer Contraseña</h2>
          <Input
            fullWidth
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ingrese su correo electrónico"
            className="mb-4"
            required
          />
          <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white">
            Enviar
          </Button>
          <Button
            className="w-full mt-4 bg-gray-500 hover:bg-gray-600 text-white"
            onClick={() => navigate('/')}
          >
            Volver al Login
          </Button>
        </form>
      </Card>
      <SweetAlert type={alertProps.type} message={alertProps.message} />
    </div>
  );
};

export default RequestPasswordReset;
