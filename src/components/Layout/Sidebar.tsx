import React from 'react';
import { Link } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    AlertCircle,
    ShieldCheck,
    BarChart2,
    Settings,
    UserCheck,
    Flag
} from 'lucide-react';

interface SidebarProps {
    currentPath: string;
    closeSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentPath, closeSidebar }) => {
    const navItems = [
        {
            path: '/dashboard',
            label: 'Dashboard',
            icon: <LayoutDashboard className="w-5 h-5 mr-3" />
        },
        {
            path: '/users',
            label: 'Gestion des utilisateurs',
            icon: <Users className="w-5 h-5 mr-3" />
        },
        {
            path: '/moderation',
            label: 'Modération du contenu',
            icon: <Flag className="w-5 h-5 mr-3" />
        },
        {
            path: '/verification',
            label: 'Vérification de l\'identité',
            icon: <UserCheck className="w-5 h-5 mr-3" />
        },
    ];

    return (
        <div className="h-full flex flex-col">
            <div className="flex items-center justify-center h-16 border-b border-gray-200">
                <Link
                    to="/dashboard"
                    className="flex items-center text-xl font-semibold text-indigo-600"
                    onClick={closeSidebar}
                >
                    <ShieldCheck className="w-7 h-7 mr-2" />
                    <span>SportVille</span>
                </Link>
            </div>

            <nav className="flex-1 pt-4 pb-4 overflow-y-auto">
                <ul className="px-2 space-y-1">
                    {navItems.map((item) => (
                        <li key={item.path}>
                            <Link
                                to={item.path}
                                className={`flex items-center px-4 py-3 text-sm rounded-lg transition-colors ${
                                    currentPath === item.path
                                        ? 'text-indigo-700 bg-indigo-50 font-medium'
                                        : 'text-gray-700 hover:text-indigo-700 hover:bg-gray-100'
                                }`}
                                onClick={closeSidebar}
                            >
                                {item.icon}
                                <span>{item.label}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="p-4 border-t border-gray-200">
                <div className="px-2 py-2">
                    <div className="flex items-center space-x-3">
                        <AlertCircle className="w-5 h-5 text-indigo-600" />
                        <span className="text-sm text-gray-600">Besoin d'aide ?</span>
                    </div>
                    <Link
                        to="/help"
                        className="mt-1 block text-xs text-indigo-600 hover:underline"
                        onClick={closeSidebar}
                    >
                        Voir la documentation
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;