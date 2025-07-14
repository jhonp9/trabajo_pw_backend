"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateGameKey = exports.generateVerificationCode = void 0;
const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};
exports.generateVerificationCode = generateVerificationCode;
const generateGameKey = () => {
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
exports.generateGameKey = generateGameKey;
