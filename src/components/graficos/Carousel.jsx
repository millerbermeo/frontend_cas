import React, { useEffect, useState } from 'react';
import { Button, Card, Flex, Title } from '@tremor/react';
import { Recycle, ChevronLeft, ChevronRight } from "lucide-react";
import axiosClient from '../../configs/axiosClient';

const Carousel = () => {
  const [data, setData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

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

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => {
      const lastIndex = isMobile ? data.length - 1 : data.length - 4;
      return prevIndex < lastIndex ? prevIndex + 1 : 0;
    });
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => {
      const lastIndex = isMobile ? data.length - 1 : data.length - 4;
      return prevIndex > 0 ? prevIndex - 1 : lastIndex;
    });
  };

  const slideStyle = {
    transform: `translateX(-${currentIndex * (isMobile ? 100 : 25)}%)`,
  };

  return (
    <div className="relative w-full max-w-[93%] mx-auto">
      <div className="overflow-hidden relative">
        <div className="flex transition-transform duration-300 ease-out" style={slideStyle}>
          {data.map((item, index) => (
            <div key={index} className={`flex-shrink-0 p-2 ${isMobile ? 'w-full' : 'w-1/4'}`}>
              <Card decoration="top" decorationColor="blue" className='bg-gray-100'>
                <Flex justifyContent="between" alignItems="center">
                  <div>
                    <Title className='uppercase text-3xl font-bold'>{item.unidad_medida}</Title>
                    <p>Total: {item.total}</p>
                  </div>
                  <Recycle size={50} color='gray'/>
                </Flex>
              </Card>
            </div>
          ))}
        </div>
      </div>
      <Button onClick={prevSlide} icon={ChevronLeft} variant="light" className="absolute top-1/2 -left-8 transform -translate-y-1/2" />
      <Button onClick={nextSlide} icon={ChevronRight} variant="light" className="absolute top-1/2 -right-8 transform -translate-y-1/2" />
    </div>
  );
};

export default Carousel;
