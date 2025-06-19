import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import LoginForm from './components/Auth/LoginForm';
import DashboardLayout from './components/Layout/DashboardLayout';
import DashboardPage from './pages/DashboardPage';
import UsersPage from './pages/UsersPage';
import UserDetailPage from './pages/UserDetailPage';
import CreateUserPage from './pages/CreateUserPage';
import EditUserPage from './pages/EditUserPage';
import ModerationPage from './pages/ModerationPage';
import VerificationPage from './pages/VerificationPage';
import RequireAuth from './components/Auth/RequireAuth';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<LoginForm />} />

                    <Route path="/" element={<Navigate to="/dashboard" replace />} />

                    <Route element={<RequireAuth><DashboardLayout /></RequireAuth>}>
                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route path="/users" element={<UsersPage />} />
                        <Route path="/users/create" element={<CreateUserPage />} />
                        <Route path="/users/edit/:id" element={<EditUserPage />} />
                        <Route path="/users/:id" element={<UserDetailPage />} />
                        <Route path="/moderation" element={<ModerationPage />} />
                        <Route path="/verification" element={<VerificationPage />} />
                        <Route path="/reports" element={<DashboardPage />} />
                        <Route path="/settings" element={<DashboardPage />} />
                    </Route>

                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;