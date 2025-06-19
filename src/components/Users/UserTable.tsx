import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type {User} from '../../types';
import {
    Search,
    Filter,
    ChevronDown,
    Edit,
    Trash2,
    CheckCircle,
    XCircle,
    AlertCircle
} from 'lucide-react';
import { format } from 'date-fns';

interface UserTableProps {
    users: User[];
    onDeleteUser: (userId: string) => void;
}

const UserTable: React.FC<UserTableProps> = ({ users, onDeleteUser }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [roleFilter, setRoleFilter] = useState<string>('all');
    const [sortConfig, setSortConfig] = useState<{ key: keyof User; direction: 'asc' | 'desc' }>({
        key: 'joinDate',
        direction: 'desc'
    });
    const [showStatusDropdown, setShowStatusDropdown] = useState(false);
    const [showRoleDropdown, setShowRoleDropdown] = useState(false);

    // Filter users
    const filteredUsers = users.filter(user => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
        const matchesRole = roleFilter === 'all' || user.role === roleFilter;

        return matchesSearch && matchesStatus && matchesRole;
    });

    // Sort users
    const sortedUsers = [...filteredUsers].sort((a, b) => {
        if (sortConfig.key === 'joinDate' || sortConfig.key === 'lastActive') {
            const dateA = new Date(a[sortConfig.key]);
            const dateB = new Date(b[sortConfig.key]);

            if (sortConfig.direction === 'asc') {
                return dateA.getTime() - dateB.getTime();
            } else {
                return dateB.getTime() - dateA.getTime();
            }
        }

        if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
    });

    const handleSort = (key: keyof User) => {
        setSortConfig({
            key,
            direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
        });
    };

    const handleStatusFilter = (status: string) => {
        setStatusFilter(status);
        setShowStatusDropdown(false);
    };

    const handleRoleFilter = (role: string) => {
        setRoleFilter(role);
        setShowRoleDropdown(false);
    };

    return (
        <div className="bg-white shadow rounded-lg overflow-hidden">
            {/* Filters and search */}
            <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                <div className="flex flex-wrap items-center justify-between">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Utilisateurs
                        <span className="ml-2 text-sm text-gray-500">({filteredUsers.length})</span>
                    </h3>

                    <div className="mt-4 sm:mt-0 flex flex-wrap items-center space-x-2">
                        {/* Status filter */}
                        <div className="relative inline-block text-left">
                            <button
                                type="button"
                                className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                            >
                                <Filter className="mr-2 h-5 w-5 text-gray-400" />
                                Statut: {statusFilter === 'all' ? 'Tout' : statusFilter}
                                <ChevronDown className="ml-2 -mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
                            </button>

                            {showStatusDropdown && (
                                <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none z-10">
                                    <div className="py-1" role="none">
                                        <button
                                            onClick={() => handleStatusFilter('all')}
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                        >
                                            Tout
                                        </button>
                                        <button
                                            onClick={() => handleStatusFilter('active')}
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                        >
                                            Actif
                                        </button>
                                        <button
                                            onClick={() => handleStatusFilter('inactive')}
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                        >
                                            Inactif
                                        </button>
                                        <button
                                            onClick={() => handleStatusFilter('suspended')}
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                        >
                                            En Attente
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Role filter */}
                        <div className="relative inline-block text-left">
                            <button
                                type="button"
                                className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                            >
                                <Filter className="mr-2 h-5 w-5 text-gray-400" />
                                Role: {roleFilter === 'all' ? 'Tout' : roleFilter}
                                <ChevronDown className="ml-2 -mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
                            </button>

                            {showRoleDropdown && (
                                <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none z-10">
                                    <div className="py-1" role="none">
                                        <button
                                            onClick={() => handleRoleFilter('all')}
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                        >
                                            Tout
                                        </button>
                                        <button
                                            onClick={() => handleRoleFilter('admin')}
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                        >
                                            Admin
                                        </button>
                                        <button
                                            onClick={() => handleRoleFilter('moderator')}
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                        >
                                            Modérateur
                                        </button>
                                        <button
                                            onClick={() => handleRoleFilter('user')}
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                        >
                                            Utilisateur
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Search input */}
                        <div className="w-full sm:w-auto mt-2 sm:mt-0">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-3 py-2 border-gray-300 rounded-md"
                                    placeholder="Recherche d'utilisateurs..."
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* User table */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                            onClick={() => handleSort('name')}
                        >
                            <div className="flex items-center">
                                <span>Nom Prénom</span>
                                {sortConfig.key === 'name' && (
                                    <span className="ml-1">
                      {sortConfig.direction === 'asc' ? '↑' : '↓'}
                    </span>
                                )}
                            </div>
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Email
                        </th>
                        <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                            onClick={() => handleSort('status')}
                        >
                            <div className="flex items-center">
                                <span>Statut</span>
                                {sortConfig.key === 'status' && (
                                    <span className="ml-1">
                      {sortConfig.direction === 'asc' ? '↑' : '↓'}
                    </span>
                                )}
                            </div>
                        </th>
                        <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                            onClick={() => handleSort('role')}
                        >
                            <div className="flex items-center">
                                <span>Role</span>
                                {sortConfig.key === 'role' && (
                                    <span className="ml-1">
                      {sortConfig.direction === 'asc' ? '↑' : '↓'}
                    </span>
                                )}
                            </div>
                        </th>
                        <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                            onClick={() => handleSort('verified')}
                        >
                            <div className="flex items-center">
                                <span>Vérifié</span>
                                {sortConfig.key === 'verified' && (
                                    <span className="ml-1">
                      {sortConfig.direction === 'asc' ? '↑' : '↓'}
                    </span>
                                )}
                            </div>
                        </th>
                        <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                            onClick={() => handleSort('joinDate')}
                        >
                            <div className="flex items-center">
                                <span>Date d'entrée</span>
                                {sortConfig.key === 'joinDate' && (
                                    <span className="ml-1">
                      {sortConfig.direction === 'asc' ? '↑' : '↓'}
                    </span>
                                )}
                            </div>
                        </th>
                        <th scope="col" className="relative px-6 py-3">
                            <span className="sr-only">Actions</span>
                        </th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {sortedUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 h-10 w-10">
                                        <img
                                            className="h-10 w-10 rounded-full"
                                            src={user.avatar}
                                            alt={user.name}
                                        />
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-sm font-medium text-gray-900">
                                            <Link to={`/users/${user.id}`} className="hover:text-indigo-600">
                                                {user.name}
                                            </Link>
                                        </div>
                                        <div className="text-sm text-gray-500">ID: {user.id}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">{user.email}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : user.status === 'inactive'
                              ? 'bg-gray-100 text-gray-800'
                              : 'bg-red-100 text-red-800'
                  }`}>
                    {user.status}
                  </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.role === 'admin'
                          ? 'bg-purple-100 text-purple-800'
                          : user.role === 'moderator'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                  }`}>
                    {user.role}
                  </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {user.verified ? (
                                    <span className="inline-flex items-center text-green-600">
                      <CheckCircle className="h-5 w-5 mr-1" />
                      Oui
                    </span>
                                ) : user.verificationStatus === 'pending' ? (
                                    <span className="inline-flex items-center text-amber-600">
                      <AlertCircle className="h-5 w-5 mr-1" />
                      En attente
                    </span>
                                ) : (
                                    <span className="inline-flex items-center text-gray-500">
                      <XCircle className="h-5 w-5 mr-1" />
                      Non vérifié
                    </span>
                                )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {format(new Date(user.joinDate), 'MMM dd, yyyy')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div className="flex space-x-3 justify-end">
                                    <Link
                                        to={`/users/edit/${user.id}`}
                                        className="text-indigo-600 hover:text-indigo-900 cursor-pointer"
                                    >
                                        <Edit className="h-5 w-5" />
                                    </Link>
                                    <button
                                        onClick={() => onDeleteUser(user.id)}
                                        className="text-red-600 hover:text-red-900 cursor-pointer"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Empty state */}
            {sortedUsers.length === 0 && (
                <div className="py-12 text-center">
                    <Search className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No users found</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        Essayez d'ajuster votre recherche ou votre filtre pour trouver ce que vous cherchez.
                    </p>
                </div>
            )}
        </div>
    );
};

export default UserTable;