import React, { useEffect, useState } from 'react';
import { Settings, ChevronLeft, ChevronRight } from "lucide-react";
import axiosClient from '../../configs/axiosClient';

const Carousel = () => {
  const [data, setData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosClient.get('grafico/listarr');
        if (Array.isArray(response.data)) {
          setData(response.data);
        } else {
          console.error('Unexpected data format:', response.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => {
      const lastIndex = data.length - 4;
      return prevIndex < lastIndex ? prevIndex + 1 : 0;
    });
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => {
      const lastIndex = data.length - 4;
      return prevIndex > 0 ? prevIndex - 1 : lastIndex;
    });
  };

  return (
    <div className="relative w-full max-w-[93%] mx-auto">
      <div className="overflow-hidden relative">
        <div className="flex transition-transform duration-300 ease-out" style={{ transform: `translateX(-${currentIndex * 25}%)` }}>
          {data.map((item, index) => (
            <div key={index} className="w-1/4 flex-shrink-0 p-2">
              <div className="p-4 bg-white shadow-md rounded-lg flex justify-between">
                <div>
                  <h2 className="text-xl font-bold mb-2 uppercase">{item.unidad_medida}</h2>
                  <p>Total: {item.total}</p>
                </div>
                <div>
                  <Settings size={50} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <button onClick={prevSlide} className="absolute top-1/2 -left-8 transform -translate-y-1/2 bg-gray-800 text-white rounded-full p-1">
      <ChevronLeft size={24} />
      </button>
      <button onClick={nextSlide} className="absolute top-1/2 -right-8 transform -translate-y-1/2 bg-gray-800 text-white rounded-full p-1">
      <ChevronRight size={24} />
      </button>
    </div>
  );
};

export default Carousel;
