import {getRepository} from "typeorm";
import {NextFunction, Request, Response} from "express";
import {User} from "../entity/User";
import { GroupNotFoundException, LabNotFoundException, UserNotFoundException } from "../exceptions/NotFoundException";
import { group } from "console";
import { Lab } from "../entity/Lab";
import { UserLab } from "../entity/UserLab";
import { throws } from "assert";

export class UserController {

    private userRepository = getRepository(User);
    private labsRepository = getRepository(Lab);
    private userLabsRepository = getRepository(UserLab);

    async all(request: Request, response: Response, next: NextFunction) {
        return this.userRepository.find();
    }

    async one(request: Request, response: Response, next: NextFunction) {
        return this.userRepository.findOne(request.params.id);
    }

    async save(request: Request, response: Response, next: NextFunction) {
        return this.userRepository.save(request.body);
    }

    async remove(request: Request, response: Response, next: NextFunction) {
        const userToRemove = await this.userRepository.findOne(request.params.id);
        await this.userRepository.remove(userToRemove);
    }

    async getUserGroupLabsList(request: Request, response: Response, next: NextFunction) {
        const { userId } = request.params;
        if(!userId) {
            return response.sendStatus(400);
        }
        const user = await this.userRepository.findOne({relations: ['group'],where: {id: userId}});

        if(!user) {
            return response.sendStatus(400);
        }
      
        if(!user.group) {
            return next(new GroupNotFoundException());
        }

        const labs = await this.labsRepository.createQueryBuilder('lab').leftJoin('lab.groups', 'group')
        .where('group.id = :id', {id: user.group.id})
        .distinctOn(['lab.id'])
        .execute();;
        
        return response.status(200).json({labs});
    }

    async saveUserLab(request: Request, response: Response, next: NextFunction):Promise<UserLab> {
        const { userId, labId, automataCodes} = request.body;

        if (!userId && !labId) {
            return response.sendStatus(400);
        }

        if(!await this.userRepository.findOne(userId)){
            return next(new UserNotFoundException(''));
        }

        if(!await this.labsRepository.findOne(labId)){
            return next(new LabNotFoundException());
        }

        let userLab:UserLab;

        const existed = await this.userLabsRepository.findOne({where: {
            lab: labId,
            user: userId
        }});
        if(existed) {
            userLab = existed;
        } else {
            userLab = new UserLab();
        }
       
        userLab.automataCodes = automataCodes;
        userLab.lab = labId;
        userLab.user = userId;
        userLab.status = '-';

        const savedUserLab = await this.userLabsRepository.save(userLab);
        return response.status(200).json(savedUserLab)
    }

    async getUserLab(request: Request, response: Response, next: NextFunction): Promise<UserLab> {
        const { labId, userId } = request.params;
        if(!userId || !labId) {
            response.sendStatus(400);
        }

        if(!await this.userRepository.findOne(userId)){
            return next(new UserNotFoundException(''));
        }

        if(!await this.labsRepository.findOne(labId)){
            return next(new LabNotFoundException());
        }

        const existed = await this.userLabsRepository.findOne({where: {
            lab: labId,
            user: userId
        }});

        let userLab:UserLab;
        if(existed) {
            userLab = existed;
        } else {
            userLab= new UserLab();
            const lab =  await this.labsRepository.findOne({where: {
                id: labId,
            }});
            userLab.automataCodes = lab.automataCodes;
            userLab.status = '-';
        }

        return response.status(200).json({lab: userLab});
    }
}