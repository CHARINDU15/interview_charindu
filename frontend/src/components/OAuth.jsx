import { useAuthStore } from "../store/authStore" // Importing the useAuthStore hook from authStore
import { useNavigate } from "react-router-dom"; // Importing the navigate function from react-router-dom
export default function OAuth() {
    const { googleLogin } = useAuthStore();  // Accessing the googleLogin method from authStore
    const navigate = useNavigate();
    const handleGoogleClick = async () => {
        try {
            await googleLogin();  // Trigger the Google login flow
            navigate("/");
        } catch (error) {
            console.error('Error logging in with Google:', error);
        }
    };

    return (
        <button
            type="button"
            onClick={handleGoogleClick}
            className="bg-red-700 text-white rounded-lg p-3 uppercase hover:opacity-95"
        >
            Continue with Google
        </button>
    );
}
