export const confirm = () => '/two-factor-challenge';
export const secretKey = () => '/user/two-factor-secret-key';
export const recoveryCodes = () => '/user/recovery-codes';
export const regenerateRecoveryCodes = () => '/user/recovery-codes';
export const qrCode = () => '/user/two-factor-qr-code';

export const twoFactor = {
    confirm,
    secretKey,
    recoveryCodes,
    regenerateRecoveryCodes,
    qrCode,
};

export default twoFactor;
