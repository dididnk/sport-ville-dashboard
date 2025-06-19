import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type {User} from '../../types';
import {
    Menu,
    Bell,
    Search,
    ChevronDown,
    User as UserIcon,
    LogOut,
    Settings
} from 'lucide-react';

interface TopBarProps {
    user: User;
    onLogout: () => void;
    onMenuClick: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ user, onLogout, onMenuClick }) => {
    const [profileOpen, setProfileOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);
    const notificationsRef = useRef<HTMLDivElement>(null);

    // Handle clicks outside dropdown menus
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setProfileOpen(false);
            }
            if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
                setNotificationsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const toggleProfile = () => setProfileOpen(!profileOpen);
    const toggleNotifications = () => setNotificationsOpen(!notificationsOpen);

    return (
        <header className="bg-white border-b border-gray-200 z-10">
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Left side */}
                    <div className="flex">
                        <button
                            type="button"
                            className="text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 lg:hidden"
                            onClick={onMenuClick}
                        >
                            <Menu className="h-6 w-6" />
                        </button>

                        {/* Search bar */}
                        <div className="hidden md:flex md:flex-1 px-2 lg:ml-6 items-center">
                            <div className="max-w-lg w-full lg:max-w-xs">
                                <label htmlFor="search" className="sr-only">Search</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Search className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="search"
                                        name="search"
                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        placeholder="Rechercher des utilisateurs ou des rapports..."
                                        type="search"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right side */}
                    <div className="flex items-center lg:ml-6">
                        {/* Notifications */}
                        <div className="relative ml-3" ref={notificationsRef}>
                            <button
                                className="flex items-center justify-center p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 relative"
                                onClick={toggleNotifications}
                            >
                                <Bell className="h-5 w-5" />
                                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
                            </button>

                            {notificationsOpen && (
                                <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-50">
                                    <div className="px-4 py-2 border-b border-gray-200">
                                        <h3 className="text-sm font-medium text-gray-700">Notifications</h3>
                                    </div>
                                    <div className="max-h-80 overflow-y-auto">
                                        <a href="#" className="block px-4 py-3 hover:bg-gray-50 border-b border-gray-100">
                                            <div className="flex items-start">
                                                <div className="flex-shrink-0">
                                                    <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
                                                        <UserIcon className="h-4 w-4 text-indigo-600" />
                                                    </div>
                                                </div>
                                                <div className="ml-3 w-0 flex-1">
                                                    <p className="text-sm font-medium text-gray-900">New user verification request</p>
                                                    <p className="text-xs text-gray-500 mt-1">5 minutes ago</p>
                                                </div>
                                            </div>
                                        </a>
                                        <a href="#" className="block px-4 py-3 hover:bg-gray-50 border-b border-gray-100">
                                            <div className="flex items-start">
                                                <div className="flex-shrink-0">
                                                    <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
                                                        <Flag className="h-4 w-4 text-red-600" />
                                                    </div>
                                                </div>
                                                <div className="ml-3 w-0 flex-1">
                                                    <p className="text-sm font-medium text-gray-900">Nouveau contenu signalé</p>
                                                    <p className="text-xs text-gray-500 mt-1">Il y a 30 minutes</p>
                                                </div>
                                            </div>
                                        </a>
                                        <a href="#" className="block px-4 py-3 hover:bg-gray-50">
                                            <div className="flex items-start">
                                                <div className="flex-shrink-0">
                                                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                                                        <CheckIcon className="h-4 w-4 text-green-600" />
                                                    </div>
                                                </div>
                                                <div className="ml-3 w-0 flex-1">
                                                    <p className="text-sm font-medium text-gray-900">Vérification de l'utilisateur approuvée</p>
                                                    <p className="text-xs text-gray-500 mt-1">Il y a 1 heure</p>
                                                </div>
                                            </div>
                                        </a>
                                    </div>
                                    <div className="border-t border-gray-200 px-4 py-2">
                                        <Link to="/notifications" className="text-xs text-indigo-600 font-medium hover:text-indigo-500">
                                            Voir toutes les notifications
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Profile dropdown */}
                        <div className="relative ml-4" ref={profileRef}>
                            <button
                                className="flex items-center max-w-xs rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                onClick={toggleProfile}
                            >
                                <span className="sr-only">Ouvrir le menu utilisateur</span>
                                <img
                                    className="h-8 w-8 rounded-full"
                                    src={user.avatar}
                                    alt={user.name}
                                />
                                <span className="hidden md:flex md:items-center ml-2">
                  <span className="text-sm font-medium text-gray-700 mr-1">{user.name}</span>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </span>
                            </button>

                            {profileOpen && (
                                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-50">
                                    <div className="px-4 py-2 border-b border-gray-200">
                                        <p className="text-sm font-medium text-gray-700">{user.name}</p>
                                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                    </div>
                                    <Link
                                        to="/profile"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                    >
                                        <UserIcon className="h-4 w-4 mr-2 text-gray-500" />
                                        Votre profil
                                    </Link>
                                    <button
                                        onClick={onLogout}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                                    >
                                        <LogOut className="h-4 w-4 mr-2 text-gray-500" />
                                        S'inscrire
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile search bar */}
            <div className="md:hidden border-t border-gray-200 p-2">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="Rechercher des utilisateurs ou des rapports..."
                        type="search"
                    />
                </div>
            </div>
        </header>
    );
};

// CheckIcon component
const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
);

// Flag component
const Flag: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
        <line x1="4" y1="22" x2="4" y2="15"></line>
    </svg>
);

export default TopBar;