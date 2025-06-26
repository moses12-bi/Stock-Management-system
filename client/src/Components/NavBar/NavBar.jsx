import React from "react";
import { useAuth } from "../../contexts/useAuth";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const NavBar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      logout();
      toast.success('Logged out successfully');
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    }
  };

  return (
    <div>
      <nav className="bg-white border-gray-200 dark:bg-gray-900">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl p-4">
          <Link
            to={isAuthenticated ? "/dashboard" : "/"}
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <img
              src="https://flowbite.com/docs/images/logo.svg"
              className="h-8"
              alt="Flowbite Logo"
            />
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              Inventory Manager
            </span>
          </Link>
          <div className="flex items-center space-x-6 rtl:space-x-reverse">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  className="text-sm text-blue-600 dark:text-blue-500 hover:underline"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-sm text-blue-600 dark:text-blue-500 hover:underline"
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                <span className="text-sm text-gray-500 dark:text-white">
                  Welcome, {user?.email}!
                </span>
                <button
                  onClick={handleLogout}
                  className="text-sm text-blue-600 dark:text-blue-500 hover:underline"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
