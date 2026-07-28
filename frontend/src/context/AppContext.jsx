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
    const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : false)
    const [userData, setUserData] = useState(false)

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

    const loadUserProfileData = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/user/get-profile', { headers: { token } })
            if (data.success) {
                setUserData(data.userData)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    }

    const contextValue = {
        doctors,
        currencySymbol,
        token, setToken,
        backendUrl,
        userData, setUserData,
        loadUserProfileData
    };

    useEffect(() => {
        getDoctorsData();
    }, []);

    useEffect(() => {
        if (token) {
            loadUserProfileData()
        } else {
            setUserData(false)
        }
    }, [token])

    return (
        <AppContext.Provider value={contextValue}>
            {children}
        </AppContext.Provider>
    );
};

export default AppcontextProvider;
