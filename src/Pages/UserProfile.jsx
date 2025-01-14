import React, { useState, useRef, useEffect } from 'react';
import axios from '../utils/axios.jsx';
import toast from 'react-hot-toast';
import useHandleErr from '../utils/userHandleErr.js';
import Preloader from '../Components/Preloader.jsx';

const UserProfile = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    username: '',
    phoneNumber: '',
  });
  const [avatar, setAvatar] = useState(null);
  const [showAvatar, setShowAvatar] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const avatarRef = useRef(null);
  const [user, setUser] = useState(null);
  const handleError = useHandleErr();

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        email: user.email || '',
        username: user.username || '',
        phoneNumber: user.phoneNumber || '',
      });
      setShowAvatar(user.avatar);
    }
  }, [user]);

  const getUser = async () => {
    try {
      const response = await axios.get("/user/current-user", {
        withCredentials: true,
      });
      setUser(response.data.data);
    } catch (error) {
      handleError(error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setShowAvatar(URL.createObjectURL(file));
    }
  };

  const validateForm = () => {
    if (!showAvatar) {
      toast.error('Profile picture is required');
      return false;
    }

    if (!formData.fullName?.trim()) {
      toast.error('Please enter your full name');
      return false;
    }

    if (!formData.username?.trim()) {
      toast.error('Please enter a username');
      return false;
    }

    if (!formData.email?.trim()) {
      toast.error('Please enter your email address');
      return false;
    }

    if (!formData.phoneNumber?.trim()) {
      toast.error('Please enter your phone number');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return false;
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.phoneNumber)) {
      toast.error('Please enter a valid 10-digit phone number');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      let avatarUrl = showAvatar;

      if (avatar) {
        const formdata = new FormData();
        formdata.append('file', avatar);
        formdata.append(
          'upload_preset',
          import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
        );
        formdata.append(
          'cloud_name',
          import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
        );

        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/${
            import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
          }/image/upload`,
          formdata
        );

        avatarUrl = response.data.secure_url;
      }

      await axios.post('/user/update-account-details', {
        fullName: formData.fullName,
        email: formData.email,
        username: formData.username,
        phoneNumber: formData.phoneNumber,
        avatar: avatarUrl,
      });

      toast.success('Profile updated successfully!');
      setIsEditing(false);
      getUser(); // Refresh user data
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return <Preloader />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-green-50 to-green-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-green-800">
            {isEditing ? 'Update Profile' : 'Profile Details'}
          </h2>
        </div>

        {/* Avatar Display/Upload */}
        <div className="relative w-24 h-24 mx-auto mb-8">
          <div 
            className={`w-full h-full rounded-full overflow-hidden ${isEditing ? 'cursor-pointer group' : ''}`}
            onClick={() => isEditing && avatarRef.current.click()}
          >
            <img 
              src={showAvatar || '/api/placeholder/128/128'} 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
            {isEditing && (
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-sm">Change Photo</span>
              </div>
            )}
          </div>
          {isEditing && (
            <input
              ref={avatarRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name Input */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50"
            />
          </div>

          {/* Username Input */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50"
            />
          </div>

          {/* Email Input */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50"
            />
          </div>

          {/* Phone Input */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            {isEditing ? (
              <>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Updating...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      fullName: user.fullName,
                      email: user.email,
                      username: user.username,
                      phoneNumber: user.phoneNumber,
                    });
                    setShowAvatar(user.avatar);
                    setAvatar(null);
                  }}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Edit Profile
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserProfile;