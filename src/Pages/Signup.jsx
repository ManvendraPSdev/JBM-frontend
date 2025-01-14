import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, User, Phone, ArrowRight, Eye, EyeOff, Camera } from "lucide-react";
import { TbPasswordMobilePhone } from "react-icons/tb";
import axios from "../utils/axios.jsx";
import useHandleErr from "../utils/userHandleErr.js";   
import toast from "react-hot-toast";
import Preloader from "../Components/Preloader.jsx";
import { upload } from "../utils/upload.js";

const SignUp = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        fullname: "",
        phone: "",
    });
    const [otpsent, setOtpsent] = useState(false);
    const [avatar, setAvatar] = useState(null);
    const [showAvatar, setShowAvatar] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isFileSelected, setIsFileSelected] = useState(false);
    const avatarRef = useRef(null);
    const handleError = useHandleErr();
    const [otpVerified, setOtpVerified] = useState(false);
    const [otp, setOtp] = useState("");
    const [otpEntered, setOtpEntered] = useState("");
    const [loading, setLoading] = useState(false);

    // ... Keep all the existing handler functions the same ...
    // (handleInputChange, handleAvatarChange, togglePasswordVisibility, sendOTP, verifyOTP, validateForm, handleSignUp)
    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatar(file);
            setShowAvatar(URL.createObjectURL(file));
            setIsFileSelected(true);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const sendOTP = async () => {
        if (!formData.email) {
            toast.error("Please enter email");
            return;
        }
        try {
            const response = await axios.post("/user/send-otp", {
                email: formData.email,
            });
            if (response.data.statusCode === 200) {
                setOtp(response.data.data.otp);
                toast.success("OTP sent successfully");
            }
        } catch (error) {
            handleError(error);
        }
    };

    const verifyOTP = async () => {
        if (otpEntered != otp) {
            toast.error("OTP entered is incorrect");
            return;
        }
        setOtpVerified(true);
        toast.success("OTP verified successfully");
        console.log(otpEntered , otp);
        setOtpsent(true);
    };

    const validateForm = () => {
        if (!avatar) {
            toast.error("Please upload a profile picture");
            return false;
        }

        if (!formData.fullname.trim()) {
            toast.error("Please enter your full name");
            return false;
        }

        if (!formData.username.trim()) {
            toast.error("Please enter a username");
            return false;
        }

        if (!formData.email.trim()) {
            toast.error("Please enter your email address");
            return false;
        }

        if (!otpVerified) {
            toast.error("Please verify your email with OTP");
            return false;
        }

        if (!formData.phone.trim()) {
            toast.error("Please enter your phone number");
            return false;
        }

        if (!formData.password) {
            toast.error("Please enter a password");
            return false;
        }

        // Basic password strength validation
        if (formData.password.length < 8) {
            toast.error("Password must be at least 8 characters long");
            return false;
        }

        // Basic email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            toast.error("Please enter a valid email address");
            return false;
        }

        // Basic phone number validation (assuming 10 digits)
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(formData.phone)) {
            toast.error("Please enter a valid 10-digit phone number");
            return false;
        }

        return true;
    };

    const handleSignUp = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }
        setLoading(true);
        setIsLoading(true);

        try {

            const avatarUrl = await upload([avatar]);

            await axios.post("/user/register", {
                username: formData.username,
                email: formData.email,
                password: formData.password,
                avatar: avatarUrl[0],
                fullName: formData.fullname,
                phoneNumber: formData.phone,
            });

            toast.success("Account created successfully!");
            navigate("/login");
        } catch (error) {
            handleError(error);
        } finally {
            setIsLoading(false);
            setLoading(false);
        }
    };

    return loading ? (
        <Preloader />
    ) : (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-green-50 to-green-100">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-green-800">Create Account</h2>
                </div>

                {/* Avatar Upload */}
                <div className="relative w-24 h-24 mx-auto mb-8 cursor-pointer group"
                     onClick={() => avatarRef.current.click()}>
                    <div className="w-full h-full rounded-full overflow-hidden">
                        {showAvatar ? (
                            <img src={showAvatar} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                <Camera className="w-6 h-6 text-gray-500" />
                            </div>
                        )}
                    </div>
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-sm">Upload Photo</span>
                    </div>
                    <input
                        ref={avatarRef}
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                    />
                </div>

                <form onSubmit={handleSignUp} className="space-y-6">
                    {/* Full Name Input */}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-gray-500" />
                        </div>
                        <input
                            type="text"
                            name="fullname"
                            placeholder="Full Name"
                            value={formData.fullname}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                    </div>

                    {/* Username Input */}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="h-5 w-5 text-gray-500" />
                        </div>
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={formData.username}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                    </div>

                    {/* Email and OTP Send */}
                    <div className="flex gap-4">
                        <div className="relative flex-grow">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-gray-500" />
                            </div>
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleInputChange}
                                disabled={otpsent}
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={sendOTP}
                            className="px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                        >
                            Send OTP
                        </button>
                    </div>

                    {/* OTP Verification */}
                    <div className="flex gap-4">
                        <div className="relative flex-grow">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <TbPasswordMobilePhone className="h-5 w-5 text-gray-500" />
                            </div>
                            <input
                                type="text"
                                name="email-otp"
                                placeholder="Enter OTP"
                                onChange={(e) => setOtpEntered(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={verifyOTP}
                            className="px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                        >
                            Verify
                        </button>
                    </div>

                    {/* Phone Input */}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Phone className="h-5 w-5 text-gray-500" />
                        </div>
                        <input
                            type="tel"
                            name="phone"
                            placeholder="Phone Number"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                    </div>

                    {/* Password Input */}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-500" />
                        </div>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                            {showPassword ? (
                                <Eye className="h-5 w-5 text-gray-500" />
                            ) : (
                                <EyeOff className="h-5 w-5 text-gray-500" />
                            )}
                        </button>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <span>Create Account</span>
                        <ArrowRight className="h-5 w-5 animate-bounce-x" />
                    </button>

                    {/* Divider */}
                    <div className="relative flex items-center">
                        <div className="flex-grow border-t border-gray-200"></div>
                        <span className="flex-shrink mx-4 text-gray-500">or</span>
                        <div className="flex-grow border-t border-gray-200"></div>
                    </div>

                    {/* Login Link */}
                    <button
                        type="button"
                        onClick={() => navigate("/login")}
                        className="w-full py-3 border border-gray-200 text-green-600 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Already have an account? Sign In
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SignUp;