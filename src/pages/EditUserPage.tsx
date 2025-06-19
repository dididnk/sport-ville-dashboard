import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService } from '../services/apiService';
import type {User} from '../types';
import UserForm from '../components/Users/UserForm';
import { AlertTriangle } from 'lucide-react';

const EditUserPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            if (!id) {
                setError('User ID is required');
                setLoading(false);
                return;
            }

            try {
                const userData = await apiService.getUserById(id);
                if (!userData) {
                    setError('User not found');
                } else {
                    setUser(userData);
                }
            } catch (err) {
                setError('Failed to load user data');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [id]);

    const handleSave = async (userData: Partial<User>) => {
        if (!id) return;

        try {
            await apiService.updateUser(id, userData);
            navigate('/users', {
                state: {
                    message: 'User updated successfully!',
                    type: 'success'
                }
            });
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        }
    };

    const handleCancel = () => {
        navigate('/users');
    };

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading user data...</p>
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
                    onClick={() => navigate('/users')}
                    className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                    Back to Users
                </button>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="space-y-6">
            <UserForm
                user={user}
                onSave={handleSave}
                onCancel={handleCancel}
                isEditing={true}
            />
        </div>
    );
};

export default EditUserPage;