import React, { useState, useEffect } from 'react';
import { apiService } from '../services/apiService';
import type {Report} from '../types';
import ReportsList from '../components/Moderation/ReportsList';
import { AlertTriangle, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const ModerationPage: React.FC = () => {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const data = await apiService.getReports();
                setReports(data);
            } catch (err) {
                setError('Failed to load reports');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, []);

    const handleResolveReport = async (reportId: string, action: 'resolve' | 'dismiss') => {
        try {
            const report = await apiService.getReportById(reportId);
            if (!report) {
                setError('Rapport non trouvé');
                return;
            }

            const updatedReport = await apiService.updateReport(reportId, {
                status: action === 'resolve' ? 'résolu' : 'rejeté',
                resolvedAt: new Date().toISOString(),
                resolvedBy: user?.id || 'inconnue',
            });

            if (updatedReport) {
                setReports(prevReports =>
                    prevReports.map(r =>
                        r.id === reportId ? updatedReport : r
                    )
                );
            }
        } catch (err) {
            setError(`N'a pas réussi à ${action} rapport`);
            console.error(err);
        }
    };

    if (loading) {
        return (
            <div className="h-full flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-gray-600">Chargement des rapports...</p>
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

    const pendingReports = reports.filter(report => report.status === 'pending');

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Modération du contenu</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Examiner et modérer les contenus signalés afin de respecter les normes de la communauté.
                    </p>
                </div>
            </div>

            {/* Stats summary */}
            <div className="bg-white shadow rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-blue-100 text-blue-700">
                            <Shield className="h-8 w-8" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Total des rapports</p>
                            <p className="text-2xl font-semibold text-gray-900">{reports.length}</p>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-amber-100 text-amber-700">
                            <AlertTriangle className="h-8 w-8" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">En attente de révision</p>
                            <p className="text-2xl font-semibold text-gray-900">{pendingReports.length}</p>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <div className="p-3 rounded-full bg-green-100 text-green-700">
                            <CheckIcon className="h-8 w-8" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Taux de réponse</p>
                            <p className="text-2xl font-semibold text-gray-900">
                                {reports.length ? `${Math.round((reports.length - pendingReports.length) / reports.length * 100)}%` : '0%'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Guidelines */}
            <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4">
                <h3 className="text-sm font-medium text-indigo-800">Moderation Guidelines</h3>
                <ul className="mt-2 text-sm text-indigo-700 list-disc list-inside">
                    <li>Examiner minutieusement chaque rapport avant de prendre des mesures</li>
                    <li>Considérer le contexte et l'intention lors de l'évaluation du contenu signalé</li>
                    <li>Pour le harcèlement ou les menaces, résoudre immédiatement et suspendre si nécessaire</li>
                    <li>Refuser les rapports faux ou erronés après un examen minutieux</li>
                </ul>
            </div>

            {/* Reports list */}
            <ReportsList
                reports={reports}
                onResolveReport={handleResolveReport}
            />
        </div>
    );
};

// CheckIcon component
const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
);

export default ModerationPage;