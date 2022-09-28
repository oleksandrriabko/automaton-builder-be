import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../entity/User';


export const roleMiddleware = (roles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction) => {

        if(!roles || roles.length === 0) {
            return next();
        }

        const { user } = req;
        console.log(user.role)
        if(user && roles.includes(user.role)) {
            return next();
        }

        res.sendStatus(403);
    }
}