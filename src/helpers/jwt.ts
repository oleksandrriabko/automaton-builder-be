import * as jwt from 'jsonwebtoken';
import { UserRole, User } from '../entity/User';

export const getAccessToken = (username: string, role:UserRole):string => {
    return jwt.sign({name: username, role: role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
}

export const getRefreshtoken = (username:string):string => {
    return jwt.sign({name: username}, process.env.REFRESH_TOKEN_SECRET);
}

export const verifyRefreshToken = (refreshToken:string, onSuccess: Function, onError: Function):void => {
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user: User) => {
        if(err) { 
            onError && onError(err); 
            return 
        };
        onSuccess && onSuccess(user);
    });
}


/** TO DO: Replace refresh token list with using DB/Redis implementation. */
export  const refreshTokensList = [];