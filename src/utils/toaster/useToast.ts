// src/hooks/useToast.ts
import { useCallback } from 'react';
import { toast, type ToastOptions } from 'react-toastify';

const defaultOptions: ToastOptions = {
    position: 'top-center',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'colored',
};

export const useToast = () => {
    const showSuccess = useCallback((message: string, options?: ToastOptions) => {
        toast.success(message, {
            ...defaultOptions,
            style: {
                backgroundColor: 'hsl(237 50% 20%)',
                color: 'hsl(0 0% 100%)',
            },
            ...options
        });
    }, []);

    const showError = useCallback((message: string, options?: ToastOptions) => {
        console.error('Toast Error:', message);
        toast.error(message, {
            ...defaultOptions,
            autoClose: 7000,
            ...options
        });
    }, []);

    return {
        showSuccess,
        showError,
    };
};