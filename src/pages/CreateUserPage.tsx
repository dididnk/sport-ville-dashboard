import React from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/apiService';
import type {User} from '../types';
import UserForm from '../components/Users/UserForm';

const CreateUserPage: React.FC = () => {
    const navigate = useNavigate();

    const handleSave = async (userData: Partial<User>) => {
        try {
            await apiService.createUser(userData);
            navigate('/users', {
                state: {
                    message: 'User created successfully!',
                    type: 'success'
                }
            });
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    };

    const handleCancel = () => {
        navigate('/users');
    };

    return (
        <div className="space-y-6">
            <UserForm
                onSave={handleSave}
                onCancel={handleCancel}
                isEditing={false}
            />
        </div>
    );
};

export default CreateUserPage;