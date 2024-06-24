import React, { useState } from 'react';
import { Input, Button, Card } from '@nextui-org/react';
import { useLocation, useNavigate } from 'react-router-dom';
import axiosClient from './axiosClient';
import { SweetAlert } from './SweetAlert'; // Asegúrate de importar correctamente

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [alertProps, setAlertProps] = useState({ type: '', message: '' });
  const location = useLocation();
  const navigate = useNavigate();
  const token = new URLSearchParams(location.search).get('token');

  const validatePassword = (password) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/.test(password);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!newPassword) {
      setAlertProps({ type: 'error', message: 'La nueva contraseña no puede estar vacía.' });
      return;
    }
    if (!validatePassword(newPassword)) {
      setAlertProps({ type: 'error', message: 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setAlertProps({ type: 'error', message: 'Las contraseñas no coinciden.' });
      return;
    }

    try {
      await axiosClient.post('usuario/reset-password', { token, newPassword });
      setAlertProps({
        type: 'success',
        message: 'Contraseña restablecida correctamente.',
      });
      setTimeout(() => navigate('/'), 1000); // Redirige al login después de 1 segundo
    } catch (error) {
      console.error('Error al restablecer la contraseña:', error);
      setAlertProps({
        type: 'error',
        message: 'Error al restablecer la contraseña.',
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
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Ingrese su nueva contraseña"
            className="mb-4"
            required
          />
          <Input
            fullWidth
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirme su nueva contraseña"
            className="mb-4"
            required
          />
          <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white">
            Restablecer
          </Button>
        </form>
      </Card>
      <SweetAlert type={alertProps.type} message={alertProps.message} />
    </div>
  );
};

export default ResetPassword;
