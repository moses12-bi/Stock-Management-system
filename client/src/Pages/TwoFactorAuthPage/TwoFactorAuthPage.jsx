import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../contexts/useAuth';

const TwoFactorAuthPage = () => {
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const navigate = useNavigate();
    const { verify2FA, resend2FA } = useAuth();

    useEffect(() => {
        // Check if we have a pending authentication
        const pendingAuth = localStorage.getItem('pendingAuth');
        if (!pendingAuth) {
            toast.error('No pending authentication found. Please try logging in again.');
            navigate('/login', { replace: true });
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const pendingAuth = JSON.parse(localStorage.getItem('pendingAuth'));
            if (!pendingAuth || !pendingAuth.email) {
                toast.error('No pending authentication found. Please try logging in again.');
                navigate('/login', { replace: true });
                return;
            }

            const result = await verify2FA(code);
            
            if (!result.success) {
                toast.error(result.error || 'Verification failed. Please try again.');
                return;
            }
            
            toast.success('Verification successful!');
            
            // Ensure we're authenticated before navigating
            if (result.success) {
                // Wait for state updates to complete
                await new Promise(resolve => setTimeout(resolve, 300));
                
                // Check if we're authenticated
                const isAuthenticated = localStorage.getItem('user');
                if (isAuthenticated) {
                    navigate('/dashboard', { replace: true });
                } else {
                    toast.error('Authentication failed. Please try logging in again.');
                    navigate('/login', { replace: true });
                }
            } else {
                toast.error('Authentication failed. Please try again.');
                navigate('/login', { replace: true });
            }
        } catch (error) {
            console.error('2FA verification error:', error);
            toast.error(error.message || 'An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResendCode = async () => {
        setResendLoading(true);
        try {
            const result = await resend2FA();
            if (result.success) {
                toast.success(result.message || 'Verification code has been resent');
            } else {
                toast.error(result.error || 'Failed to resend verification code');
            }
        } catch (error) {
            console.error('Resend code error:', error);
            toast.error('Failed to resend verification code');
        } finally {
            setResendLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Two-Factor Authentication
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Please enter the verification code sent to your email
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="code" className="sr-only">
                                Verification Code
                            </label>
                            <input
                                id="code"
                                name="code"
                                type="text"
                                required
                                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Enter verification code"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                maxLength={6}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col space-y-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                        >
                            {loading ? 'Verifying...' : 'Verify Code'}
                        </button>
                        
                        <button
                            type="button"
                            onClick={handleResendCode}
                            disabled={resendLoading}
                            className="text-sm text-indigo-600 hover:text-indigo-500 focus:outline-none focus:underline"
                        >
                            {resendLoading ? 'Sending...' : 'Resend verification code'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TwoFactorAuthPage; 