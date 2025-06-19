import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import type {User} from '../types';
import VerificationList from '../components/Verification/VerificationList';
import { AlertTriangle, UserCheck, UserX, CheckCircle2 } from 'lucide-react';

const VerificationPage: React.FC = () => {
    const [pendingUsers, setPendingUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [stats, setStats] = useState({
        total: 0,
        approved: 0,
        rejected: 0,
        pending: 0
    });

    useEffect(() => {
        const fetchPendingVerifications = async () => {
            try {
                const data = await apiService.getPendingVerifications();
                setPendingUsers(data);

                // Get all users to calculate stats
                const allUsers = await apiService.getUsers();

                setStats({
                    total: allUsers.length,
                    approved: allUsers.filter(u => u.verified).length,
                    rejected: allUsers.filter(u => u.verificationStatus === 'rejected').length,
                    pending: data.length
                });
            } catch (err) {
                setError('Échec du chargement des demandes de vérification');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchPendingVerifications();
    }, []);

    const handleApprove = async (userId: string) => {
        try {
            const updatedUser = await apiService.updateVerificationStatus(userId, 'approved');

            if (updatedUser) {
                // Remove from pending list
                setPendingUsers(prevUsers => prevUsers.filter(user => user.id !== userId));

                // Update stats
                setStats(prev => ({
                    ...prev,
                    approved: prev.approved + 1,
                    pending: prev.pending - 1
                }));
            }
        } catch (err) {
            setError('Vérification non approuvée');
            console.error(err);
        }
    };

    const handleReject = async (userId: string, reason?: string) => {
        try {
            const updatedUser = await apiService.updateVerificationStatus(
                userId,
                'rejected',
                reason || 'Échec de la vérification des documents'
            );

            if (updatedUser) {
                // Remove from pending list
                setPendingUsers(prevUsers => prevUsers.filter(user => user.id !== userId));

                // Update stats
                setStats(prev => ({
                    ...prev,
                    rejected: prev.rejected + 1,
                    pending: prev.pending - 1
                }));
            }
        } catch (err) {
            setError('Échec du rejet de la vérification');
            console.error(err);
        }
    };

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-gray-600">Chargement des demandes de vérification...</p>
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

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Vérification de l'identité</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Approuver ou rejeter les demandes de vérification de l'identité des utilisateurs.
                    </p>
                </div>
            </div>

            {/* Stats summary */}
            <div className="bg-white shadow rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-gray-100 text-gray-700">
                            <UserIcon className="h-8 w-8" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Total des utilisateurs</p>
                            <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-amber-100 text-amber-700">
                            <UserCheck className="h-8 w-8" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">En attente</p>
                            <p className="text-2xl font-semibold text-gray-900">{stats.pending}</p>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-green-100 text-green-700">
                            <CheckCircle2 className="h-8 w-8" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Approuvé</p>
                            <p className="text-2xl font-semibold text-gray-900">{stats.approved}</p>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-red-100 text-red-700">
                            <UserX className="h-8 w-8" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Rejeté</p>
                            <p className="text-2xl font-semibold text-gray-900">{stats.rejected}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Guidelines */}
            <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4">
                <h3 className="text-sm font-medium text-indigo-800">Lignes directrices en matière de vérification</h3>
                <ul className="mt-2 text-sm text-indigo-700 list-disc list-inside">
                    <li>Vérifier que le document correspond aux informations du profil de l'utilisateur</li>
                    <li>Vérifier que le document n'est pas périmé ou falsifié.</li>
                    <li>S'assurer que l'image du document est claire et que tous les détails sont lisibles.</li>
                    <li>En cas de rejet, fournir une raison claire à l'utilisateur.</li>
                </ul>
            </div>

            {/* Verification requests list */}
            <VerificationList
                users={pendingUsers}
                onApprove={handleApprove}
                onReject={handleReject}
            />
        </div>
    );
};

// UserIcon component
const UserIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
    </svg>
);

export default VerificationPage;