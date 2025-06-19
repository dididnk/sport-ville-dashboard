import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type {User} from '../../types';
import { z } from 'zod';
import {
    Save,
    X,
    Upload,
    Eye,
    EyeOff,
    ArrowLeft,
    User as UserIcon,
    Mail,
    Shield,
    Calendar
} from 'lucide-react';

// Validation schema
const userSchema = z.object({
    name: z.string().min(2, 'Le nom doit comporter au moins 2 caractères'),
    email: z.string().email('Adresse électronique invalide'),
    role: z.enum(['admin', 'moderator', 'user']),
    status: z.enum(['active', 'inactive', 'suspended']),
    password: z.string().min(6, 'Le mot de passe doit comporter au moins 6 caractères').optional(),
});

type UserFormData = z.infer<typeof userSchema>;

interface UserFormProps {
    user?: User;
    onSave: (userData: Partial<User>) => Promise<void>;
    onCancel: () => void;
    isEditing?: boolean;
}

const UserForm: React.FC<UserFormProps> = ({
                                               user,
                                               onSave,
                                               onCancel,
                                               isEditing = false
                                           }) => {
    useNavigate();
    const [formData, setFormData] = useState<UserFormData>({
        name: user?.name || '',
        email: user?.email || '',
        role: user?.role || 'user',
        status: user?.status || 'active',
        password: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState<string>(
        user?.avatar || `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`
    );

    const validateForm = () => {
        try {
            // For editing, password is optional
            const schema = isEditing
                ? userSchema.omit({ password: true }).extend({
                    password: z.string().min(6, 'Le mot de passe doit comporter au moins 6 caractères').optional().or(z.literal(''))
                })
                : userSchema;

            schema.parse(formData);
            setErrors({});
            return true;
        } catch (error) {
            if (error instanceof z.ZodError) {
                const formattedErrors: Record<string, string> = {};
                error.errors.forEach(err => {
                    if (err.path) {
                        formattedErrors[err.path[0]] = err.message;
                    }
                });
                setErrors(formattedErrors);
            }
            return false;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsLoading(true);
        try {
            const userData: Partial<User> = {
                name: formData.name,
                email: formData.email,
                role: formData.role,
                status: formData.status,
                avatar: avatarPreview,
            };

            // Only include password if it's provided
            if (formData.password && formData.password.trim() !== '') {
                (userData as any).password = formData.password;
            }

            await onSave(userData);
        } catch (error) {
            console.error('Erreur d\'enregistrement de l\'utilisateur:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (field: keyof UserFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const generateNewAvatar = () => {
        const newAvatarUrl = `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`;
        setAvatarPreview(newAvatarUrl);
    };

    return (
        <div className="w-full mx-auto">
            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-blue-50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <button
                                onClick={onCancel}
                                className="mr-4 p-2 text-gray-500 hover:text-gray-700 hover:bg-white rounded-full transition-colors"
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    {isEditing ? 'Modifier l\'utilisateur' : 'Créer un nouvel utilisateur'}
                                </h1>
                                <p className="text-sm text-gray-600 mt-1">
                                    {isEditing
                                        ? 'Mettre à jour les informations et les autorisations de l\'utilisateur'
                                        : 'Ajouter un nouvel utilisateur au système'
                                    }
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <UserIcon className="h-8 w-8 text-indigo-600" />
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Avatar Section */}
                    <div className="flex items-center space-x-6">
                        <div className="relative">
                            <img
                                src={avatarPreview}
                                alt="User avatar"
                                className="h-24 w-24 rounded-full object-cover border-4 border-white shadow-lg"
                            />
                            <button
                                type="button"
                                onClick={generateNewAvatar}
                                className="absolute -bottom-2 -right-2 bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 transition-colors shadow-lg"
                            >
                                <Upload className="h-4 w-4" />
                            </button>
                        </div>
                        <div>
                            <h3 className="text-lg font-medium text-gray-900">Profil de l'image</h3>
                            <p className="text-sm text-gray-500 mt-1">
                                Cliquez sur le bouton de téléchargement pour générer un nouvel avatar.
                            </p>
                            <button
                                type="button"
                                onClick={generateNewAvatar}
                                className="mt-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                            >
                                Générer un nouvel avatar
                            </button>
                        </div>
                    </div>

                    {/* Basic Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                <UserIcon className="h-4 w-4 inline mr-1" />
                                Nom complet
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={formData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                                    errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                }`}
                                placeholder="Saisir le nom complet"
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                <Mail className="h-4 w-4 inline mr-1" />
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={formData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                                    errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                }`}
                                placeholder="Saisir l'\email"
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                            )}
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                            <Shield className="h-4 w-4 inline mr-1" />
                            Mot de passe {isEditing && <span className="text-gray-500">(leave blank to keep current)</span>}
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                value={formData.password}
                                onChange={(e) => handleInputChange('password', e.target.value)}
                                className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                                    errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                }`}
                                placeholder={isEditing ? "Saisir un nouveau mot de passe (facultatif)" : "Entrez le mot de passe"}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                        )}
                    </div>

                    {/* Role and Status */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                                <Shield className="h-4 w-4 inline mr-1" />
                                Role
                            </label>
                            <select
                                id="role"
                                value={formData.role}
                                onChange={(e) => handleInputChange('role', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                            >
                                <option value="user">User</option>
                                <option value="moderator">Moderator</option>
                                <option value="admin">Admin</option>
                            </select>
                            <p className="mt-1 text-xs text-gray-500">
                                {formData.role === 'admin' && 'Accès complet au système et gestion des utilisateurs'}
                                {formData.role === 'moderator' && 'Modération du contenu et assistance aux utilisateurs'}
                                {formData.role === 'user' && 'Accès standard des utilisateurs'}
                            </p>
                        </div>

                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                                <Calendar className="h-4 w-4 inline mr-1" />
                                Status
                            </label>
                            <select
                                id="status"
                                value={formData.status}
                                onChange={(e) => handleInputChange('status', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                            >
                                <option value="active">Actif</option>
                                <option value="inactive">Inactif</option>
                                <option value="suspended">Suspendu</option>
                            </select>
                            <p className="mt-1 text-xs text-gray-500">
                                {formData.status === 'active' && 'L\'utilisateur peut accéder au système normalement'}
                                {formData.status === 'inactive' && 'Le compte de l\'utilisateur est temporairement désactivé'}
                                {formData.status === 'suspended' && 'Le compte de l\'utilisateur est suspendu en raison de violations'}
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                        >
                            <X className="h-4 w-4 inline mr-2" />
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors ${
                                isLoading ? 'opacity-70 cursor-not-allowed' : ''
                            }`}
                        >
                            <Save className="h-4 w-4 inline mr-2" />
                            {isLoading ? 'Saving...' : (isEditing ? 'Mise à jour de l\'utilisateur' : 'Créer un utilisateur')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserForm;