import React from 'react';
import type {User, VerificationDocument} from '../../types';
import {
    CheckCircle,
    XCircle,
    ExternalLink,
    FileText,
    Calendar
} from 'lucide-react';
import { format } from 'date-fns';

interface VerificationListProps {
    users: User[];
    onApprove: (userId: string) => Promise<void>;
    onReject: (userId: string, reason?: string) => Promise<void>;
}

const VerificationList: React.FC<VerificationListProps> = ({
                                                               users,
                                                               onApprove,
                                                               onReject
                                                           }) => {
    return (
        <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Demandes de vérification en attente
                    <span className="ml-2 text-sm text-gray-500">({users.length})</span>
                </h3>
            </div>

            {users.length > 0 ? (
                <ul className="divide-y divide-gray-200">
                    {users.map((user) => (
                        <li key={user.id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                            <div className="flex flex-wrap md:flex-nowrap items-start">
                                {/* User info */}
                                <div className="w-full md:w-1/3 pr-4 mb-4 md:mb-0">
                                    <div className="flex items-start">
                                        <img
                                            src={user.avatar}
                                            alt={user.name}
                                            className="h-10 w-10 rounded-full mr-3"
                                        />
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-900">{user.name}</h4>
                                            <p className="text-sm text-gray-500">{user.email}</p>
                                            <div className="mt-1 flex items-center text-xs text-gray-500">
                                                <Calendar className="h-3 w-3 mr-1" />
                                                Joined {format(new Date(user.joinDate), 'MMM dd, yyyy')}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Documents */}
                                <div className="w-full md:w-1/3 pr-4 mb-4 md:mb-0">
                                    <h5 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                                        Verification Documents
                                    </h5>

                                    {user.verificationDocuments && user.verificationDocuments.length > 0 ? (
                                        <ul className="space-y-2">
                                            {user.verificationDocuments.map((doc: VerificationDocument) => (
                                                <li key={doc.id} className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10 bg-indigo-50 rounded overflow-hidden">
                                                        <img
                                                            src={doc.imageUrl}
                                                            alt={`${doc.type} document`}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    </div>
                                                    <div className="ml-2">
                                                        <p className="text-sm font-medium text-gray-900 capitalize">{doc.type.replace('_', ' ')}</p>
                                                        <p className="text-xs text-gray-500">
                                                            Submitted on {format(new Date(doc.submittedAt), 'MMM dd, yyyy')}
                                                        </p>
                                                    </div>
                                                    <a
                                                        href={doc.imageUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="ml-2 text-indigo-600 hover:text-indigo-900"
                                                    >
                                                        <ExternalLink className="h-4 w-4" />
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <div className="flex items-center text-sm text-gray-500">
                                            <FileText className="h-5 w-5 mr-1 text-gray-400" />
                                            Aucun document n'a été fourni
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="w-full md:w-1/3">
                                    <h5 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                                        Actions
                                    </h5>
                                    <div className="flex flex-col space-y-2">
                                        <button
                                            onClick={() => onApprove(user.id)}
                                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                        >
                                            <CheckCircle className="h-4 w-4 mr-2" />
                                            Approuver la vérification
                                        </button>
                                        <button
                                            onClick={() => onReject(user.id)}
                                            className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        >
                                            <XCircle className="h-4 w-4 mr-2" />
                                            Rejeter la vérification
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="py-12 text-center">
                    <div className="mx-auto h-12 w-12 text-gray-400">
                        <FileText className="h-full w-full" />
                    </div>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No pending verifications</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        Aucune vérification en cours
                    </p>
                </div>
            )}
        </div>
    );
};

export default VerificationList;