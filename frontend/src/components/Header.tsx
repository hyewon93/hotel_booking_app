import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client";

const Header = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { showToast, isLoggedIn } = useAppContext();

    const mutation = useMutation(apiClient.signOut, {
        onSuccess: async () => {
            await queryClient.invalidateQueries("validateToken");
            
            showToast({message: "Signed out successfully!", type: "SUCCESS"});
            navigate("/");
        }, 
        onError: (error: Error) => {
            showToast({message: error.message, type: "ERROR"});
        }
    });

    const handleSignout = () => {
        mutation.mutate();
    }

    return (
        <div className="bg-sky-700 py-6">
            <div className="container mx-auto flex justify-between">
                <span className="text-3xl text-white font-bold tracking-tight">
                    <Link to="/">ForYouBooking.com</Link>
                </span>
                <span className="flex space-x-2">
                    {isLoggedIn ? (
                        <>
                            <Link to="/my-bookings" className="flex items-center text-white px-3 font-bold hover:bg-sky-600">My Bookings</Link>
                            <Link to="/my-hotels" className="flex items-center text-white px-3 font-bold hover:bg-sky-600">My Hotels</Link>
                            <button onClick={handleSignout} className="flex bg-white items-center text-sky-600 px-3 font-bold hover:bg-gray-100 rounded">
                                Sign Out
                            </button>
                        </> 
                    ) : ( 
                        <Link to="/sign-in" className="flex bg-white items-center text-sky-600 px-3 font-bold hover:bg-gray-100 rounded">
                            Sign In
                        </Link>
                    )}
                </span>
            </div>
        </div>
    );
};

export default Header;