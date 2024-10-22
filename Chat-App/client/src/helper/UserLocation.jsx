import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { setLocation } from '../redux/UserSlice';

const UserLocation = () => {
  const [city, setCity] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            console.log('Position fetched:', latitude, longitude);
            fetchCity(latitude, longitude);
          },
          (error) => {
            toast.error('Unable to retrieve your location: ' + error.message);
            console.error('Geolocation error:', error);
          }
        );
      } else {
        toast.error('Geolocation is not supported by this browser.');
      }
    };

    const fetchCity = async (lat, lon) => {
      try {
        const response = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
        );
        const data = await response.json();
       // console.log('City data:', data);
        if (data.city) {
          setCity(data.city);
          dispatch(setLocation(data.city));
        //  console.log(data.city);
        } else {
          toast.error('City not found');
        }
      } catch (err) {
        toast.error('Error fetching the city');
        console.error('Fetch error:', err);
      }
    };

    fetchLocation();
  }, [dispatch]);

  return city; // Return the fetched city
};

export default UserLocation;
