export const home = () => '/';
export const dashboard = () => '/dashboard';
export const accounts = () => '/accounts';
export const transactions = () => '/transactions';
export const ledger = () => '/ledger';
export const payments = () => '/payments';
export const transfers = () => '/transfers';
export const cards = () => '/cards';
export const cardControls = () => '/cards/controls';
export const analytics = () => '/analytics';
export const budgets = () => '/budgets';
export const statements = () => '/statements';
export const referrals = () => '/referrals';
export const support = () => '/support';
export const supportShow = (id: string) => `/support/${id}`;
export const settingsProfile = () => '/settings/profile';
export const settingsSecurity = () => '/settings/security';
export const settingsNotifications = () => '/settings/notifications';
export const settingsKyc = () => '/settings/kyc';
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
    transfers,
    cards,
    cardControls,
    analytics,
    budgets,
    statements,
    referrals,
    support,
    supportShow,
    settingsProfile,
    settingsSecurity,
    settingsNotifications,
    settingsKyc,
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
