export const generateVerificationCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const generateGameKey = (): string => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const segments = [4, 4, 4, 4];
  return segments.map(seg => {
    let part = '';
    for (let i = 0; i < seg; i++) {
      part += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return part;
  }).join('-');
};