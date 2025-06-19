import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Users,
    FileCheck,
    AlertTriangle,
    Calendar,
    TrendingUp,
    BarChart2,
    Activity as ActivityIcon
} from 'lucide-react';
import { apiService } from '../services/apiService';
import type {DashboardStats} from '../types';
import { Line, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    ArcElement,
    Title,
    Tooltip,
    Legend
);

const DashboardPage: React.FC = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDashboardStats = async () => {
            try {
                const data = await apiService.getDashboardStats();
                setStats(data);
            } catch (err) {
                setError('Échec du chargement des données du tableau de bord');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardStats();
    }, []);

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-gray-600">Chargement des données du tableau de bord...</p>
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

    if (!stats) {
        return null;
    }

    // Line chart data
    const userGrowthData = {
        labels: stats.userGrowth.labels,
        datasets: [
            {
                label: 'Nouveaux utilisateurs',
                data: stats.userGrowth.data,
                borderColor: 'rgb(79, 70, 229)',
                backgroundColor: 'rgba(79, 70, 229, 0.1)',
                tension: 0.3,
                fill: true,
            },
        ],
    };

    // Doughnut chart data
    const activityData = {
        labels: stats.activityDistribution.labels,
        datasets: [
            {
                data: stats.activityDistribution.data,
                backgroundColor: [
                    'rgba(79, 70, 229, 0.8)',
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(239, 68, 68, 0.8)',
                ],
                borderColor: [
                    'rgb(79, 70, 229)',
                    'rgb(16, 185, 129)',
                    'rgb(245, 158, 11)',
                    'rgb(239, 68, 68)',
                ],
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Aperçu du tableau de bord</h1>
                <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Total des utilisateurs"
                    value={stats.totalUsers}
                    description={`${stats.activeUsers} active`}
                    icon={<Users className="h-6 w-6 text-indigo-600" />}
                    trend={+10}
                    link="/users"
                />
                <StatsCard
                    title="Vérifications en cours"
                    value={stats.pendingVerifications}
                    description="En attente d'approbation"
                    icon={<FileCheck className="h-6 w-6 text-green-600" />}
                    trend={-2}
                    link="/verification"
                />
                <StatsCard
                    title="Rapports"
                    value={stats.openReports}
                    description="Besoin de modération"
                    icon={<AlertTriangle className="h-6 w-6 text-amber-600" />}
                    trend={+5}
                    link="/moderation"
                />
                <StatsCard
                    title="Activités totales"
                    value={stats.totalActivities}
                    description="Éléments du contenu"
                    icon={<ActivityIcon className="h-6 w-6 text-purple-600" />}
                    trend={+24}
                    link="/activities"
                />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg font-medium text-gray-900 flex items-center">
                            <TrendingUp className="h-5 w-5 mr-2 text-indigo-500" />
                            Croissance du nombre d'utilisateurs (12 derniers mois)
                        </h3>
                        <div className="mt-4 h-64">
                            <Line
                                data={userGrowthData}
                                options={{
                                    responsive: true,
                                    maintainAspectRatio: false,
                                    plugins: {
                                        legend: {
                                            position: 'top',
                                        },
                                    },
                                    scales: {
                                        y: {
                                            beginAtZero: true,
                                        },
                                    },
                                }}
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg font-medium text-gray-900 flex items-center">
                            <BarChart2 className="h-5 w-5 mr-2 text-indigo-500" />
                            Répartition des activités
                        </h3>
                        <div className="mt-4 h-64 flex items-center justify-center">
                            <div style={{ width: '70%', height: '100%' }}>
                                <Doughnut
                                    data={activityData}
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: {
                                                position: 'right',
                                            },
                                        },
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Top creators and recent activities */}
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900">Principaux créateurs de contenu</h3>
                    </div>
                    <ul className="divide-y divide-gray-200">
                        {stats.topCreators.map((creator, index) => (
                            <li key={creator.userId} className="px-4 py-3 sm:px-6 hover:bg-gray-50">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-semibold text-sm">
                                            {index + 1}
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">{creator.userName}</div>
                                            <div className="text-xs text-gray-500">{creator.activities} activités</div>
                                        </div>
                                    </div>
                                    <Link
                                        to={`/users/${creator.userId}`}
                                        className="text-xs text-indigo-600 hover:text-indigo-900"
                                    >
                                        Voir le profil
                                    </Link>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
                        <div className="-ml-4 -mt-2 flex items-center justify-between flex-wrap sm:flex-nowrap">
                            <div className="ml-4 mt-2">
                                <h3 className="text-lg leading-6 font-medium text-gray-900">Notifications récentes</h3>
                            </div>
                            <div className="ml-4 mt-2 flex-shrink-0">
                                <Link
                                    to="/notifications"
                                    className="relative inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Voir tous
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="px-4 py-5 sm:p-6">
                        <div className="flow-root">
                            <ul className="-mb-8">
                                <ActivityTimelineItem
                                    title="Enregistrement d'un nouvel utilisateur"
                                    time="5 minutes ago"
                                    iconBg="bg-green-100"
                                    icon={<Users className="h-4 w-4 text-green-600" />}
                                />
                                <ActivityTimelineItem
                                    title="Contenu rapporté"
                                    time="30 minutes ago"
                                    description="Un message a été signalé pour son contenu inapproprié"
                                    iconBg="bg-red-100"
                                    icon={<AlertIcon className="h-4 w-4 text-red-600" />}
                                />
                                <ActivityTimelineItem
                                    title="Demande de vérification d'identité"
                                    time="2 hours ago"
                                    iconBg="bg-blue-100"
                                    icon={<FileCheck className="h-4 w-4 text-blue-600" />}
                                />
                                <ActivityTimelineItem
                                    title="Suspension du compte de l'utilisateur"
                                    time="1 day ago"
                                    description="Action manuelle du modérateur"
                                    iconBg="bg-amber-100"
                                    icon={<BanIcon className="h-4 w-4 text-amber-600" />}
                                    isLast
                                />
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

interface StatsCardProps {
    title: string;
    value: number;
    description: string;
    icon: React.ReactNode;
    trend: number;
    link: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, description, icon, trend, link }) => {
    return (
        <Link to={link} className="block">
            <div className="bg-white overflow-hidden shadow rounded-lg transition-all duration-200 hover:shadow-md">
                <div className="px-4 py-5 sm:p-6">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 bg-indigo-50 rounded-md p-3">
                            {icon}
                        </div>
                        <div className="ml-5 w-0 flex-1">
                            <dl>
                                <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
                                <dd>
                                    <div className="text-lg font-semibold text-gray-900">{value.toLocaleString()}</div>
                                </dd>
                            </dl>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                        <div className="text-sm text-gray-500">{description}</div>
                        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            trend > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                            {trend > 0 ? '+' : ''}{trend}%
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

interface ActivityTimelineItemProps {
    title: string;
    time: string;
    description?: string;
    iconBg: string;
    icon: React.ReactNode;
    isLast?: boolean;
}

const ActivityTimelineItem: React.FC<ActivityTimelineItemProps> = ({
                                                                       title,
                                                                       time,
                                                                       description,
                                                                       iconBg,
                                                                       icon,
                                                                       isLast = false
                                                                   }) => {
    return (
        <li>
            <div className="relative pb-8">
                {!isLast && (
                    <span
                        className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200"
                        aria-hidden="true"
                    />
                )}
                <div className="relative flex items-start space-x-3">
                    <div className="relative">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${iconBg}`}>
                            {icon}
                        </div>
                    </div>
                    <div className="min-w-0 flex-1">
                        <div>
                            <div className="text-sm font-medium text-gray-900">{title}</div>
                            <p className="mt-0.5 text-xs text-gray-500">{time}</p>
                        </div>
                        {description && (
                            <div className="mt-2 text-sm text-gray-700">
                                <p>{description}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </li>
    );
};

// Custom icons
const AlertIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
        <line x1="12" y1="9" x2="12" y2="13"></line>
        <line x1="12" y1="17" x2="12.01" y2="17"></line>
    </svg>
);

const BanIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
    </svg>
);

export default DashboardPage;