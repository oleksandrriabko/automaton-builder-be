import {getRepository, In} from "typeorm";
import {NextFunction, Request, Response} from "express";
import { Group } from "../entity/Group";
import { validate } from 'class-validator';
import { GroupNotFoundException, LabNotFoundException } from '../exceptions/NotFoundException';
import { HttpException } from '../exceptions/HttpException';
import { Lab } from "../entity/Lab";
import { User } from "../entity/User";

export class GroupController {

    private groupRepository = getRepository(Group);
    private labRepository = getRepository(Lab);
    private userRepository = getRepository(User);

    async listAll():Promise<Group[]> {
        return await this.groupRepository.find({relations: ['users', 'labs']});
    }

    async findOne(request: Request, response:Response, next:NextFunction ):Promise<Group> {
        if (!request.params.id) {
            return next(new GroupNotFoundException());
        }
        return await this.groupRepository.findOne(request.params.id, {relations: ['users', 'labs'] });
    }

    async createOne(request: Request, response: Response, next: NextFunction):Promise<Group> {
        const { title } = request.body;
        
        const group = new Group();
        group.title= title;

        const errors = await validate(group, { validationError: { target: false, value: false } });
        if (errors.length) {
            return next(new HttpException(400, 'Validation Error', errors));
          }

        const createdGroup = await this.groupRepository.save(group);
        response.status(200).json({group: createdGroup });
    }

    async removeOne(request: Request):Promise<Group> {
        const groupToRemove = await this.groupRepository.findOne(request.params.id);
        return await this.groupRepository.remove(groupToRemove);
    };

    async updateOne(request: Request, response: Response, next: NextFunction):Promise<Group> {
        const groupToUpdate = await this.groupRepository.findOne(request.body.id, { relations: ['labs', 'users']});
        
        if (!request.body.id || !groupToUpdate) return next(new GroupNotFoundException());
      

        const groupToValidate= new Group();
        groupToValidate.title = groupToUpdate.title;

        const { title, lab, users } = request.body;

        if (title) {
            groupToValidate.title = title;
        }

        
        if (lab) {
            const labToAdd = await this.labRepository.findOne(lab);
            if(!labToAdd) return next(new LabNotFoundException());
            groupToValidate.labs = [...groupToUpdate.labs, labToAdd]
        }

        if(users) {
            const usersToAdd = await this.userRepository.find({where: { id: In(users)}});
            groupToValidate.users = [...groupToUpdate.users, ...usersToAdd];
        }

        const errors = await validate(groupToValidate, { validationError: { target: false, value: false }});
        if (errors.length) {
            return next(new HttpException(500, 'Validation Error', errors));
        }
      
        const updated =  await this.groupRepository.save({...groupToUpdate, ...groupToValidate});
        response.status(200).json({group: updated });
    };

    async allAvailableLabs(request: Request, response: Response, next: NextFunction):Promise<Lab[]> {
        const groupIdToExlude = request.params.id;
        if (!groupIdToExlude || !await this.groupRepository.findOne(request.params.id)) return next(new GroupNotFoundException());
        return await this.labRepository.createQueryBuilder('lab')
        .leftJoin('lab.groups', 'group')
        .where('group.id != :id', {id: groupIdToExlude})
        .orWhere('group.id IS null')
        .distinctOn(['lab.id'])
        .execute();
    };

    async deleteLab(request: Request, response: Response, next: NextFunction):Promise<Group> {
        const { labId, groupId} = request.params;

        if (!groupId) return next(new GroupNotFoundException());
         
        const groupToUpdate = await this.groupRepository.findOne(request.params.groupId, { relations: ['labs']});
       
        if (!groupToUpdate) return next(new GroupNotFoundException());
    
        if (labId) {
            groupToUpdate.labs = groupToUpdate.labs.filter((lab:Lab) => lab.id !== labId)
        }

      
        const updated =  await this.groupRepository.save({...groupToUpdate});
        response.status(200).json({group: updated });
    };

    async deleteUser(request: Request, response: Response, next: NextFunction):Promise<Group> {
        const { userId, groupId} = request.params;

        if (!groupId) return next(new GroupNotFoundException());
         
        const groupToUpdate = await this.groupRepository.findOne(request.params.groupId, { relations: ['users']});
       
        if (!groupToUpdate) return next(new GroupNotFoundException());
    
        if (userId) {
            groupToUpdate.users = groupToUpdate.users.filter((user:User) => user.id !== userId)
        }
      
        const updated =  await this.groupRepository.save({...groupToUpdate});
        response.status(200).json({group: updated });
    };

    async searchUserToAdd(request: Request):Promise<User[]> {
        const { search } = request.query;
        return await this.userRepository
            .createQueryBuilder('user')
            .where('user.group IS null')
            .andWhere("user.username like :username", { username:`%${search}%`})
            .select(['user.id id', 'user.username username'])
            .execute();
    };
}