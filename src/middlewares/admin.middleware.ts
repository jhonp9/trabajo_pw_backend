import { Request, Response, NextFunction } from 'express';
import { RequestHandler } from 'express';

export const authorizeAdmin : RequestHandler = async (req, res, next) => {
  if (req.user?.role !== 'ADMIN') {
    res.status(403).json({ message: 'Admin access required' });
    return ;
  }
  next();
};