import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { X } from 'lucide-react';

const DashboardLayout: React.FC = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const closeSidebar = () => {
        setSidebarOpen(false);
    };

    if (!user) {
        return null;
    }

    return (
        <div className="h-screen flex flex-col bg-gray-50">
            <TopBar
                user={user}
                onLogout={handleLogout}
                onMenuClick={toggleSidebar}
            />

            <div className="flex flex-1 overflow-hidden">
                {/* Mobile sidebar overlay */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 lg:hidden"
                        onClick={closeSidebar}
                    ></div>
                )}

                {/* Sidebar */}
                <div
                    className={`${
                        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } fixed inset-y-0 left-0 z-30 w-64 transition duration-300 transform bg-white lg:translate-x-0 lg:static lg:inset-0 border-r border-gray-200`}
                >
                    <div className="absolute right-0 p-1 -mr-10 lg:hidden">
                        {sidebarOpen && (
                            <button
                                className="flex items-center justify-center w-8 h-8 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                                onClick={closeSidebar}
                            >
                                <X className="w-5 h-5 text-gray-600" />
                            </button>
                        )}
                    </div>
                    <Sidebar currentPath={location.pathname} closeSidebar={closeSidebar} />
                </div>

                {/* Main content */}
                <div className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default DashboardLayout;