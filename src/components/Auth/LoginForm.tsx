import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { loginSchema } from '../../services/authService';
import { z } from 'zod';
import { Eye, EyeOff, LogIn, ShieldCheck } from 'lucide-react';

const LoginForm: React.FC = () => {
    const [email, setEmail] = useState('admin@example.com');
    const [password, setPassword] = useState('admin123');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const { login, isLoading, error: authError } = useAuth();
    const navigate = useNavigate();

    const toggleShowPassword = () => {
        setShowPassword(prev => !prev);
    };

    const validateForm = () => {
        try {
            loginSchema.parse({ email, password });
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

        const success = await login(email, password);
        if (success) {
            navigate('/dashboard');
        }
    };

    // const handleDemoLogin = async (e: React.MouseEvent) => {
    //     e.preventDefault();
    //     const success = await login('admin@example.com', 'admin123');
    //     if (success) {
    //         navigate('/dashboard');
    //     }
    // };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-6 sm:p-10">
                    <div className="flex justify-center">
                        <ShieldCheck className="h-12 w-12 text-indigo-600" />
                    </div>
                    <h2 className="mt-4 text-center text-3xl font-bold text-gray-900">
                        Sport-Ville
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Connectez-vous pour accéder à votre portail d'administration
                    </p>

                    {authError && (
                        <div className="mt-4 bg-red-50 text-red-700 p-3 rounded-md text-sm">
                            {authError}
                        </div>
                    )}

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email
                                </label>
                                <div className="mt-1">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className={`appearance-none block w-full px-3 py-2 border ${
                                            errors.email ? 'border-red-300' : 'border-gray-300'
                                        } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                                    />
                                    {errors.email && (
                                        <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Mot de passe
                                </label>
                                <div className="mt-1 relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        autoComplete="current-password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className={`appearance-none block w-full px-3 py-2 border ${
                                            errors.password ? 'border-red-300' : 'border-gray-300'
                                        } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm pr-10`}
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        onClick={toggleShowPassword}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5 text-gray-400" />
                                        ) : (
                                            <Eye className="h-5 w-5 text-gray-400" />
                                        )}
                                    </button>
                                    {errors.password && (
                                        <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                    Souvenez-vous de moi
                                </label>
                            </div>

                            <div className="text-sm">
                                <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                                    Vous avez oublié votre mot de passe ?
                                </a>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                                    isLoading ? 'opacity-70 cursor-not-allowed' : ''
                                }`}
                            >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <LogIn className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" />
                </span>
                                {isLoading ? 'En cours...' : 'S\'inscrire'}
                            </button>
                        </div>

                        <div className="text-sm text-center">
                            <span className="text-gray-600">Vous n'avez pas de compte ?</span>{' '}
                            <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                                Demande d'accès
                            </a>
                        </div>
                    </form>

                    <div className="mt-6">
                        <p className="text-xs text-center text-gray-500">
                            A des fins de démonstration, utilisez : admin@example.com / admin123
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;