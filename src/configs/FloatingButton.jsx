import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings } from 'lucide-react';
import {Tooltip} from "@nextui-org/react";

const FloatingButton = () => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate('/configs');
  };

  return (
   <>
   <Tooltip content="Settings">
     <div className="fixed z-50 bottom-4 right-6">
      <button
        className="bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 focus:outline-none"
        onClick={handleButtonClick}
      >
        <Settings className="w-6 h-6" />
      </button>
    </div>
    </Tooltip>
   </>




  );
};

export default FloatingButton;
