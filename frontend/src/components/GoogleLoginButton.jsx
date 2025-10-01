import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../redux/authSlice';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const googleSignInMutation = async (credential) => {
    const { data } = await axios.post(`${API_URL}/auth/google-signin`, { credential });
    return data;
};

const GoogleLoginButton = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const mutation = useMutation({
        mutationFn: googleSignInMutation,
        onSuccess: (data) => {
            toast.success('Successfully logged in!');
            dispatch(setCredentials({ user: data.data.user, token: data.token }));
            navigate('/dashboard');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Google Sign-In failed.');
        },
    });

    return (
        <GoogleLogin
            onSuccess={(credentialResponse) => mutation.mutate(credentialResponse.credential)}
            onError={() => toast.error('Google Sign-In failed.')}
        />
    );
};

export default GoogleLoginButton;