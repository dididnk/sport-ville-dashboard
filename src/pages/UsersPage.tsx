import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { apiService } from '../services/apiService';
import type {User} from '../types';
import UserTable from '../components/Users/UserTable';
import { UserPlus, AlertTriangle, CheckCircle, X } from 'lucide-react';

const UsersPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [notification, setNotification] = useState<{
        message: string;
        type: 'success' | 'error';
    } | null>(null);

    const location = useLocation();

    useEffect(() => {
        // Check for success message from navigation state
        if (location.state?.message) {
            setNotification({
                message: location.state.message,
                type: location.state.type || 'success'
            });

            // Clear the state to prevent showing the message again
            window.history.replaceState({}, document.title);

            // Auto-hide notification after 5 seconds
            setTimeout(() => {
                setNotification(null);
            }, 5000);
        }
    }, [location.state]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await apiService.getUsers();
                setUsers(data);
            } catch (err) {
                setError('Échec du chargement des utilisateurs');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleDeleteUser = async (userId: string) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action ne peut pas être annulée.')) {
            try {
                const success = await apiService.deleteUser(userId);
                if (success) {
                    setUsers(users.filter(user => user.id !== userId));
                    setNotification({
                        message: 'Utilisateur supprimé avec succès !',
                        type: 'success'
                    });
                    setTimeout(() => setNotification(null), 5000);
                } else {
                    setError('Échec de la suppression de l\'utilisateur');
                }
            } catch (err) {
                setError('Une erreur s\'est produite lors de la suppression de l\'utilisateur');
                console.error(err);
            }
        }
    };

    const dismissNotification = () => {
        setNotification(null);
    };

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-gray-600">Chargement des utilisateurs...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 p-6 rounded-lg text-center">
                <AlertTriangle className="h-12 w-12 text-red-500 mx-auto" />
                <h3 className="mt-4 text-lg font-medium text-red-800">Error</h3>
                <p className="mt-2 text-red-700">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                    Réessayer
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Success/Error Notification */}
            {notification && (
                <div className={`rounded-md p-4 ${
                    notification.type === 'success' ? 'bg-green-50' : 'bg-red-50'
                }`}>
                    <div className="flex">
                        <div className="flex-shrink-0">
                            {notification.type === 'success' ? (
                                <CheckCircle className="h-5 w-5 text-green-400" />
                            ) : (
                                <AlertTriangle className="h-5 w-5 text-red-400" />
                            )}
                        </div>
                        <div className="ml-3">
                            <p className={`text-sm font-medium ${
                                notification.type === 'success' ? 'text-green-800' : 'text-red-800'
                            }`}>
                                {notification.message}
                            </p>
                        </div>
                        <div className="ml-auto pl-3">
                            <div className="-mx-1.5 -my-1.5">
                                <button
                                    type="button"
                                    onClick={dismissNotification}
                                    className={`inline-flex rounded-md p-1.5 ${
                                        notification.type === 'success'
                                            ? 'text-green-500 hover:bg-green-100'
                                            : 'text-red-500 hover:bg-red-100'
                                    } focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                                        notification.type === 'success' ? 'focus:ring-green-600' : 'focus:ring-red-600'
                                    }`}
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Gestion des utilisateurs</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Gérer les utilisateurs, mettre à jour leurs informations et contrôler leurs niveaux d'accès.
                    </p>
                </div>
                <div className="mt-4 sm:mt-0">
                    <Link
                        to="/users/create"
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                    >
                        <UserPlus className="h-5 w-5 mr-2" />
                        Ajouter un utilisateur
                    </Link>
                </div>
            </div>

            <UserTable
                users={users}
                onDeleteUser={handleDeleteUser}
            />
        </div>
    );
};

export default UsersPage;