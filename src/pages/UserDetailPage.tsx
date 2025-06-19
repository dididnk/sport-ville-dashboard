import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { apiService } from '../services/apiService';
import type {User, Activity} from '../types';
import UserDetail from '../components/Users/UserDetail';
import { AlertTriangle } from 'lucide-react';

const UserDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [user, setUser] = useState<User | null>(null);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserData = async () => {
            if (!id) {
                setError('L\'identifiant de l\'utilisateur est requis');
                setLoading(false);
                return;
            }

            try {
                // Fetch user data
                const userData = await apiService.getUserById(id);
                if (!userData) {
                    setError('Utilisateur non trouvé');
                    setLoading(false);
                    return;
                }
                setUser(userData);

                // Fetch user activities
                const activitiesData = await apiService.getUserActivities(id);
                setActivities(activitiesData);
            } catch (err) {
                setError('Échec du chargement des données de l\'utilisateur');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [id]);

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-gray-600">Chargement des données de l'utilisateur...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 p-6 rounded-lg text-center">
                <AlertTriangle className="h-12 w-12 text-red-500 mx-auto" />
                <h3 className="mt-4 text-lg font-medium text-red-800">Erreur</h3>
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

    if (!user) {
        return null;
    }

    return <UserDetail user={user} activities={activities} />;
};

export default UserDetailPage;