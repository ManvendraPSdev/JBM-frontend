import React, { useState, useEffect } from 'react';
import axios from '../utils/axios.jsx';

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/user/get-all-users", {
        withCredentials: true,
      });
      setUsers(response.data.data);
      setError(null);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleCreatorStatus = async (userId, makeCreator = true) => {
    try {
      setLoading(true);
      await axios.post("/user/make-creator", 
        { userId, status: makeCreator },
        { withCredentials: true }
      );
      
      setUsers(users.map(user => {
        if (user._id === userId) {
          return { ...user, isCreator: makeCreator };
        }
        return user;
      }));

      alert(`User ${makeCreator ? 'made creator' : 'removed from creator'} successfully`);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update user status");
    } finally {
      setLoading(false);
    }
  };

  const handleAdminStatus = async (userId, makeAdmin = true) => {
    try {
      setLoading(true);
      await axios.post("/user/make-admin", 
        { userId, status: makeAdmin },
        { withCredentials: true }
      );
      
      setUsers(users.map(user => {
        if (user._id === userId) {
          return { ...user, isAdmin: makeAdmin };
        }
        return user;
      }));

      alert(`User ${makeAdmin ? 'made admin' : 'removed from admin'} successfully`);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update admin status");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h1 className="text-2xl font-semibold text-gray-800">User Management</h1>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="text-gray-600">Loading users...</div>
            </div>
          ) : error ? (
            <div className="text-red-600 text-center py-4">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Username
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Roles
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {user.username}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {user.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-x-2">
                          {user.isAdmin && (
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                              Admin
                            </span>
                          )}
                          {user.isCreator && (
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                              Creator
                            </span>
                          )}
                          {!user.isAdmin && !user.isCreator && (
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                              User
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-x-2">
                          <button
                            className={`px-4 py-2 text-sm font-medium rounded-md ${
                              user.isAdmin
                                ? 'bg-red-600 hover:bg-red-700 text-white'
                                : 'bg-purple-600 hover:bg-purple-700 text-white'
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                            onClick={() => handleAdminStatus(user._id, !user.isAdmin)}
                            disabled={loading}
                          >
                            {user.isAdmin ? 'Remove Admin' : 'Make Admin'}
                          </button>
                          <button
                            className={`px-4 py-2 text-sm font-medium rounded-md ${
                              user.isCreator
                                ? 'bg-red-600 hover:bg-red-700 text-white'
                                : 'bg-blue-600 hover:bg-blue-700 text-white'
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                            onClick={() => handleCreatorStatus(user._id, !user.isCreator)}
                            disabled={loading}
                          >
                            {user.isCreator ? 'Remove Creator' : 'Make Creator'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;