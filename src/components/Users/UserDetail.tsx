import React from 'react';
import { Link } from 'react-router-dom';
import type {User, Activity} from '../../types';
import {
    CheckCircle,
    XCircle,
    AlertCircle,
    Mail,
    Calendar,
    Clock,
    Activity as ActivityIcon,
    Edit,
    ArrowLeft, AlertTriangle
} from 'lucide-react';
import { format } from 'date-fns';

interface UserDetailProps {
    user: User;
    activities: Activity[];
}

const UserDetail: React.FC<UserDetailProps> = ({ user, activities }) => {
    // Get status badge component
    const getStatusBadge = () => {
        switch(user.status) {
            case 'active':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Actif
          </span>
                );
            case 'inactive':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <XCircle className="h-3 w-3 mr-1" />
            Inactif
          </span>
                );
            case 'suspended':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <AlertCircle className="h-3 w-3 mr-1" />
            Suspendu
          </span>
                );
            default:
                return null;
        }
    };

    // Get role badge component
    const getRoleBadge = () => {
        switch(user.role) {
            case 'admin':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            Admin
          </span>
                );
            case 'moderator':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            Modérateur
          </span>
                );
            case 'user':
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Utilisateur
          </span>
                );
            default:
                return null;
        }
    };

    // Get verification badge component
    const getVerificationBadge = () => {
        if (user.verified) {
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="h-3 w-3 mr-1" />
          Vérifié
        </span>
            );
        }

        if (user.verificationStatus === 'pending') {
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
          <AlertCircle className="h-3 w-3 mr-1" />
          Vérification en cours
        </span>
            );
        }

        return (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        <XCircle className="h-3 w-3 mr-1" />
        Non vérifié
      </span>
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <Link
                    to="/users"
                    className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-900"
                >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Retour aux utilisateurs
                </Link>

                <Link
                    to={`/users/edit/${user.id}`}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    <Edit className="h-4 w-4 mr-2" />
                    Modifier l'utilisateur
                </Link>
            </div>

            {/* User profile header */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                    <div>
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Profil de l'utilisateur</h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">
                            Informations détaillées et statistiques.
                        </p>
                    </div>
                    <div className="flex space-x-2">
                        {getStatusBadge()}
                        {getRoleBadge()}
                    </div>
                </div>

                <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                    <div className="flex flex-col sm:flex-row">
                        <div className="flex-shrink-0 mb-4 sm:mb-0">
                            <img
                                src={user.avatar}
                                alt={user.name}
                                className="h-24 w-24 rounded-full"
                            />
                        </div>
                        <div className="sm:ml-6">
                            <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                            <div className="mt-1 flex items-center text-sm text-gray-500">
                                <Mail className="h-4 w-4 mr-1" />
                                {user.email}
                            </div>
                            <div className="mt-1 flex items-center text-sm text-gray-500">
                                <Calendar className="h-4 w-4 mr-1" />
                                Rejoint {format(new Date(user.joinDate), 'MMMM d, yyyy')}
                            </div>
                            <div className="mt-1 flex items-center text-sm text-gray-500">
                                <Clock className="h-4 w-4 mr-1" />
                                Dernier actif {format(new Date(user.lastActive), 'MMMM d, yyyy')}
                            </div>
                            <div className="mt-2">
                                {getVerificationBadge()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Activity stats */}
            <div className="bg-white shadow sm:rounded-lg overflow-hidden">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">Activity Statistics</h3>
                </div>
                <div className="px-4 py-5 sm:p-6">
                    <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                        <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">Total Activities</dt>
                            <dd className="mt-1 flex items-center text-3xl font-semibold text-indigo-600">
                                <ActivityIcon className="h-6 w-6 mr-2 text-indigo-400" />
                                {user.activities}
                            </dd>
                        </div>
                        <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gray-500">Rapports contre l'utilisateur</dt>
                            <dd className="mt-1 flex items-center text-3xl font-semibold text-amber-600">
                                <AlertTriangle className="h-6 w-6 mr-2 text-amber-400" />
                                {user.reports}
                            </dd>
                        </div>

                        {/* Activity distribution */}
                        <div className="sm:col-span-2">
                            <dt className="text-sm font-medium text-gray-500">Répartition des activités</dt>
                            <dd className="mt-1">
                                <div className="flex space-x-4">
                                    <div className="flex flex-col items-center p-3 bg-indigo-50 rounded-lg">
                    <span className="text-lg font-semibold text-indigo-700">
                      {activities.filter(a => a.type === 'post').length}
                    </span>
                                        <span className="text-xs text-indigo-600">Posts</span>
                                    </div>
                                    <div className="flex flex-col items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-lg font-semibold text-green-700">
                      {activities.filter(a => a.type === 'comment').length}
                    </span>
                                        <span className="text-xs text-green-600">Commentaires</span>
                                    </div>
                                    <div className="flex flex-col items-center p-3 bg-amber-50 rounded-lg">
                    <span className="text-lg font-semibold text-amber-700">
                      {activities.filter(a => a.type === 'like').length}
                    </span>
                                        <span className="text-xs text-amber-600">J'aimes</span>
                                    </div>
                                    <div className="flex flex-col items-center p-3 bg-blue-50 rounded-lg">
                    <span className="text-lg font-semibold text-blue-700">
                      {activities.filter(a => a.type === 'share').length}
                    </span>
                                        <span className="text-xs text-blue-600">Partages</span>
                                    </div>
                                </div>
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>
        </div>
    );
};

interface ActivityTypeIconProps {
    type: string;
    className?: string;
}

const ActivityTypeIcon: React.FC<ActivityTypeIconProps> = ({ type, className }) => {
    switch(type) {
        case 'post':
            return (
                <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 5v14M5 12h14"></path>
                </svg>
            );
        case 'comment':
            return (
                <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
            );
        case 'like':
            return (
                <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
            );
        case 'share':
            return (
                <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="18" cy="5" r="3"></circle>
                    <circle cx="6" cy="12" r="3"></circle>
                    <circle cx="18" cy="19" r="3"></circle>
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                </svg>
            );
        default:
            return (
                <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                </svg>
            );
    }
};

export default UserDetail;