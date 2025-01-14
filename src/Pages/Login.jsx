import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
// import {useRecoilState } from "recoil";
import axios from "../utils/axios";
import useHandleErr from "../utils/userHandleErr";
import Preloader from "../Components/Preloader";
import { useSetRecoilState } from "recoil";
import { userState } from "../store/atom/userAtom";
// import { authState } from "../store/atom/userAtom";

const Login = () => {
    const navigate = useNavigate();
    const [emailOrUsername, setEmailOrUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const setuserData = useSetRecoilState(userState); 
    const [user, setUser] = useState();
    // const currentUser = useRecoilValue(currentUserSelector);
    const handleError = useHandleErr();
    const getUser = async ()=>{
        try {
            const response = await axios.get("/user/current-user", {
              withCredentials: true,
            });
            setuserData(response.data.data)
            setUser(response.data.data)
            navigate("/")
          } 
          catch (error) {
          }
    }
    // Redirect if already authenticated
    useEffect(() => {
        getUser()
    }, [user?.isAuthenticated]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const loginResponse = await axios.post(
                "/user/login",
                {
                    identity: emailOrUsername,
                    password,
                },
                {
                    withCredentials: true,
                }
            );
            
            // Update auth state with the new user data
            setuserData(loginResponse.data.data)
            
           navigate("/");
        } catch (error) {
            handleError(error);
            console.log(error)
           setUser(null)
        } finally {
            setIsLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    // if (auth?.isLoading) {
    //     return <Preloader />;
    // }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-green-50 to-green-100">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8 transition-transform duration-300 hover:scale-[1.02]">
                <div className="text-center mb-8">
                    <h2 className="text-green-800 text-2xl font-bold mb-2">
                        Welcome Back
                    </h2>
                    <p className="text-gray-600 text-sm">
                        Sign in to your account
                    </p>
                </div>

                <form onSubmit={handleLogin} className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <div className="relative w-full">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600">
                                <Mail size={20} />
                            </div>
                            <input
                                type="text"
                                placeholder="Email or Username"
                                value={emailOrUsername}
                                onChange={(e) => setEmailOrUsername(e.target.value)}
                                className="w-full py-3 px-4 pl-12 pr-12 border border-gray-200 rounded-lg text-base 
                                transition-all duration-200 bg-white/90 hover:bg-white focus:outline-none 
                                focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <div className="relative w-full">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600">
                                <Lock size={20} />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full py-3 px-4 pl-12 pr-12 border border-gray-200 rounded-lg text-base 
                                transition-all duration-200 bg-white/90 hover:bg-white focus:outline-none 
                                focus:border-green-500 focus:ring-2 focus:ring-green-500/20"
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 
                                hover:opacity-70 transition-opacity duration-200 focus:outline-none"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? (
                                    <Eye size={20} />
                                ) : (
                                    <EyeOff size={20} />
                                )}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-green-500 
                        text-white rounded-lg font-medium transition-all duration-200 hover:bg-green-600 
                        active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <span>Sign In</span>
                        <span className="animate-[bounce-x_1s_infinite]">
                            <ArrowRight size={20} />
                        </span>
                    </button>

                    <div className="flex justify-between items-center">
                        <button
                            onClick={() => navigate("/forgotPassword")}
                            className="text-green-600 text-sm hover:text-green-800 
                            transition-colors duration-200"
                        >
                            Forgot Password?
                        </button>
                    </div>

                    <div className="flex items-center gap-4 my-6">
                        <div className="flex-1 h-px bg-gray-200"></div>
                        <span className="text-gray-600 text-sm">
                            or continue with
                        </span>
                        <div className="flex-1 h-px bg-gray-200"></div>
                    </div>

                    <button
                        type="button"
                        onClick={() => navigate("/signup")}
                        className="flex items-center justify-center gap-2 w-full py-3 px-4 
                        text-green-600 bg-white border border-gray-200 rounded-lg font-medium 
                        transition-all duration-200 hover:bg-gray-50 hover:shadow-sm"
                    >
                        <span>Creating your new account</span>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;