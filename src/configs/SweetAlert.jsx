import React, { useEffect } from 'react';
import Swal from 'sweetalert2';

export const SweetAlert = ({ type, message }) => {
  useEffect(() => {
    if (type && message) { // Verifica que type y message no sean null o undefined
        if (type === 'success') {
            Swal.fire({
                icon: 'success',
                title: '¡Éxito!',
                text: message,
            });
        } else if (type === 'error') {
            Swal.fire({
                icon: 'error',
                title: '¡Error!',
                text: message,
            });
        }
    }
}, [type, message]); 

return null;
}


