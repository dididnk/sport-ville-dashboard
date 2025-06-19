import React, { useState } from 'react';
import type {Report} from '../../types';
import {
    Search,
    CheckCircle,
    XCircle,
    ExternalLink,
    Flag,
    MessageSquare,
    User
} from 'lucide-react';
import { format } from 'date-fns';

interface ReportsListProps {
    reports: Report[];
    onResolveReport: (reportId: string, action: 'resolve' | 'dismiss') => Promise<void>;
}

const ReportsList: React.FC<ReportsListProps> = ({ reports, onResolveReport }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'resolved' | 'dismissed'>('pending');

    // Filter reports
    const filteredReports = reports.filter(report => {
        const matchesSearch =
            report.reporterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            report.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
            report.description.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'all' || report.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    // Get icon based on reported item type
    const getReportedItemIcon = (type: string) => {
        switch(type) {
            case 'content':
                return <Flag className="h-5 w-5 text-red-500" />;
            case 'user':
                return <User className="h-5 w-5 text-amber-500" />;
            case 'comment':
                return <MessageSquare className="h-5 w-5 text-blue-500" />;
            default:
                return <Flag className="h-5 w-5 text-gray-500" />;
        }
    };

    return (
        <div className="bg-white shadow rounded-lg overflow-hidden">
            {/* Filters and search */}
            <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                <div className="flex flex-wrap items-center justify-between">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Contenu signalé
                        <span className="ml-2 text-sm text-gray-500">
              ({filteredReports.filter(r => r.status === 'pending').length} pending)
            </span>
                    </h3>

                    <div className="mt-4 sm:mt-0 flex flex-wrap items-center space-x-2">
                        {/* Status filter buttons */}
                        <div className="inline-flex rounded-md shadow-sm" role="group">
                            <button
                                type="button"
                                onClick={() => setStatusFilter('pending')}
                                className={`py-2 px-4 text-sm font-medium rounded-l-lg ${
                                    statusFilter === 'pending'
                                        ? 'bg-indigo-100 text-indigo-700 border-indigo-300'
                                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                } border`}
                            >
                                En attente
                            </button>
                            <button
                                type="button"
                                onClick={() => setStatusFilter('resolved')}
                                className={`py-2 px-4 text-sm font-medium ${
                                    statusFilter === 'resolved'
                                        ? 'bg-indigo-100 text-indigo-700 border-indigo-300'
                                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                } border-t border-b`}
                            >
                                Résolu
                            </button>
                            <button
                                type="button"
                                onClick={() => setStatusFilter('dismissed')}
                                className={`py-2 px-4 text-sm font-medium ${
                                    statusFilter === 'dismissed'
                                        ? 'bg-indigo-100 text-indigo-700 border-indigo-300'
                                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                } border-t border-b`}
                            >
                                Rejeté
                            </button>
                            <button
                                type="button"
                                onClick={() => setStatusFilter('all')}
                                className={`py-2 px-4 text-sm font-medium rounded-r-lg ${
                                    statusFilter === 'all'
                                        ? 'bg-indigo-100 text-indigo-700 border-indigo-300'
                                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                } border`}
                            >
                                Tous
                            </button>
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
                                    placeholder="Rapports de recherche..."
                                    value={searchTerm}
                                    onChange={e => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reports list */}
            <ul className="divide-y divide-gray-200 max-h-screen overflow-y-auto">
                {filteredReports.map((report) => (
                    <li key={report.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                        <div className="flex items-start justify-between">
                            <div className="min-w-0 flex-1">
                                <div className="flex items-start">
                                    <div className="mr-3 flex-shrink-0">
                                        {getReportedItemIcon(report.reportedItemType)}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900 flex items-center">
                                            Rapporté {report.reportedItemType}
                                            <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        {report.reason}
                      </span>
                                        </p>
                                        <p className="mt-1 text-sm text-gray-500">
                                            Rapporté par <span className="font-medium">{report.reporterName}</span> on{' '}
                                            {format(new Date(report.createdAt), 'MMM dd, yyyy')}
                                        </p>
                                        <p className="mt-2 text-sm text-gray-700">{report.description}</p>

                                        {report.status !== 'pending' && (
                                            <div className="mt-2 flex items-center text-sm text-gray-500">
                        <span className={`inline-flex items-center ${
                            report.status === 'resolved' ? 'text-green-700' : 'text-amber-700'
                        }`}>
                          {report.status === 'resolved' ? (
                              <CheckCircle className="mr-1.5 h-4 w-4" />
                          ) : (
                              <XCircle className="mr-1.5 h-4 w-4" />
                          )}
                            {report.status === 'resolved' ? 'Resolved' : 'Dismissed'}
                            {report.resolvedAt && ` on ${format(new Date(report.resolvedAt), 'MMM dd, yyyy')}`}
                        </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {report.status === 'pending' ? (
                                <div className="ml-5 flex-shrink-0 flex space-x-2">
                                    <button
                                        onClick={() => onResolveReport(report.id, 'resolve')}
                                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                    >
                                        <CheckCircle className="h-4 w-4 mr-1" />
                                        Résoudre
                                    </button>
                                    <button
                                        onClick={() => onResolveReport(report.id, 'dismiss')}
                                        className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        <XCircle className="h-4 w-4 mr-1" />
                                        Rejeter
                                    </button>
                                </div>
                            ) : (
                                <div className="ml-5 flex-shrink-0">
                                    <button
                                        className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        <ExternalLink className="h-4 w-4 mr-1" />
                                        Voir
                                    </button>
                                </div>
                            )}
                        </div>
                    </li>
                ))}
            </ul>

            {/* Empty state */}
            {filteredReports.length === 0 && (
                <div className="py-12 text-center">
                    <div className="mx-auto h-12 w-12 text-gray-400">
                        <Flag className="h-full w-full" />
                    </div>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun rapport trouvé</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        {statusFilter === 'pending'
                            ? 'Il n\'y a pas de rapport en attente à modérer.'
                            : 'Essayez d\'ajuster votre recherche ou votre filtre pour trouver ce que vous cherchez.'}
                    </p>
                </div>
            )}
        </div>
    );
};

export default ReportsList;