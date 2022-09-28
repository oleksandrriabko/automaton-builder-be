import { Response, Request } from 'express';
import { User } from '../entity/User';
import { refreshTokensList, verifyRefreshToken, getAccessToken } from '../helpers/jwt';

export class RefreshTokenController {

    async refresh(req: Request, res: Response): Response {
        const { refreshToken } = req.body;
        if (!refreshToken) return res.sendStatus(400);

        verifyRefreshToken(refreshToken, (user:User) => {
            const accessToken = getAccessToken(user.username, user.role)

            res.status(201).json({accessToken});
        }, () => {
            res.sendStatus(403);
        })
    }
}