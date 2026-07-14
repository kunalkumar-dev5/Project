import { createContext, useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { doctors as sampleDoctors } from '../assets/assets';

export const AppContext = createContext();

const AppcontextProvider = ({ children }) => {
    const currencySymbol = '$';
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';
    const baseUrl = backendUrl.replace(/\/$/, '');
    const [doctors, setDoctors] = useState(sampleDoctors);

    const getDoctorsData = async () => {
        try {
            const { data } = await axios.get(`${baseUrl}/api/doctor/list`);
            if (data.success) {
                setDoctors(data.doctors);
            } else {
                setDoctors(sampleDoctors);
            }
        } catch (error) {
            console.error(error);
            setDoctors(sampleDoctors);
            toast.error(error.response?.data?.message || error.message || 'Failed to load doctors');
        }
    };

    useEffect(() => {
        getDoctorsData();
    }, []);

    const contextValue = {
        doctors,
        currencySymbol,
    };

    return (
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    );
};

export default AppcontextProvider;
