export const home = () => '/';
export const dashboard = () => '/dashboard';
export const accounts = () => '/accounts';
export const transactions = () => '/transactions';
export const ledger = () => '/ledger';
export const payments = () => '/payments';
export const cards = () => '/cards';
export const admin = () => '/admin';
export const login = () => '/login';
export const register = () => '/register';
export const logout = () => '/logout';
export const forgotPassword = () => '/forgot-password';
export const resetPassword = (token?: string) => token ? `/reset-password/${token}` : '/reset-password';
export const confirmPassword = () => '/confirm-password';
export const verifyEmail = () => '/verify-email';
export const twoFactorChallenge = () => '/two-factor-challenge';

export const routes = {
    home,
    dashboard,
    accounts,
    transactions,
    ledger,
    payments,
    cards,
    admin,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    confirmPassword,
    verifyEmail,
    twoFactorChallenge,
};

export default routes;
