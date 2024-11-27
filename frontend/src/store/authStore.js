import {create} from "zustand"  //state management library
import axios from "axios"
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth'
import { app } from '../../../backend/Firebase/firebase'



const API_URL = "http://localhost:5000/api/auth";
axios.defaults.withCredentials = true;

 export const useAuthStore = create((set) => ({
    user: null,
    isAuthenticated: false,
    error: null,
    isLoading: false,
    isCheckingAuth: true,
    token: null,
    


    signup: async (email, password,name,recaptchaToken) => {
        set({ isLoading: true,error: null });
        try {
            const response = await axios.post(`${API_URL}/signup`, { email, password,name,recaptchaToken});
            set({ user: response.data.user, isAuthenticated: true, token:response.data.token ,isLoading: false  });
        } catch (error) {
            set({ error: error.response.data.message ||"Error Signup" , isLoading: false });
            throw error;
        }
    },

    verifyEmail: async (code) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${API_URL}/verify-email`, { code });
            set({ user: response.data.user, isAuthenticated: true, token:response.data.token, isLoading: false });
            return response.data;
        } catch (error) {
            console.log(error.message);
            set({ error: error.response.data.message || "Error verifying email", isLoading: false });
            throw error;
            
        }
    },

    checkAuth: async () => {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        set({ isCheckingAuth: true,error: null });
        try {
            const response = await axios.get(`${API_URL}/check-auth`);
            set({ user: response.data.user, isAuthenticated: true, token: response.data.token, isCheckingAuth: false ,error: null});
        } catch (error) {
            set({ error:null ,isCheckingAuth: false, isAuthenticated: false });
            throw error;
            
        }
    },

    login: async (email, password,recaptchaToken) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axios.post(`${API_URL}/login`, { email, password,recaptchaToken});
            set({ user: response.data.user,token: response.data.token ,isAuthenticated: true, isLoading: false,error: null });
        } catch (error) {
            set({ error: error.response.data.message || "Error Login", isLoading: false });
            throw error;
        }
    },

    logout: async () => {
		set({ isLoading: true, error: null });
		try {
			await axios.post(`${API_URL}/logout`);
			set({ user: null, isAuthenticated: false, token: null, error: null, isLoading: false });
		} catch (error) {
			set({ error: "Error logging out", isLoading: false });
			throw error;
		}
	},

    forgotPassword: async (email) => {
        set({ isLoading: true, error: null ,message:null});
        try {
            const response=await axios.post(`${API_URL}/forgot-password`, { email });
            set({message: response.data.message, isLoading: false });
        } catch (error) {
            set({ error: error.response.data.message || "Error sending reset link", isLoading: false });
            throw error;
        }
    },
    resetPassword: async (token, password) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`${API_URL}/reset-password/${token}`, { password });
			set({ message: response.data.message, isLoading: false });
		} catch (error) {
			set({
				isLoading: false,
				error: error.response.data.message || "Error resetting password",
			});
			throw error;
		}
	},
        // Google OAuth method
        googleLogin: async () => {
            set({ isLoading: true, error: null });
            try {
                const provider = new GoogleAuthProvider();
                const auth = getAuth(app);
                const result = await signInWithPopup(auth, provider);
    
                // Send the Google user info to your backend
                const response = await axios.post(`${API_URL}/google`, {
                    email: result.user.email,
                    name: result.user.displayName,
                    password: result.user.uid,  // Using Google UID as a placeholder
                });
    
                set({ user: response.data.user, isAuthenticated: true, token: response.data.token, isLoading: false, error: null });
            } catch (error) {
                set({ error: "Error logging in with Google", isLoading: false });
                throw error;
            }
        },
}));

