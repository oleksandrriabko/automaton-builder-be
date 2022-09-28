import { getRepository } from "typeorm";
import { Request, Response,  NextFunction } from "express";
import { validate } from 'class-validator';

import { User, UserRole } from "../entity/User";
import { UserNotFoundException } from '../exceptions/NotFoundException';
import { WrongCredentialsException } from '../exceptions/WrongCredentialsException';
import { UserWithThatUsernameExistsException} from '../exceptions/UserWithThatUsernameExistsException';
import { getAccessToken, getRefreshtoken, refreshTokensList } from "../helpers/jwt";
import { HttpException } from "../exceptions/HttpException";


export class AuthController {
  private userRepository = getRepository(User);
 
  async login(req: Request, res: Response, next: NextFunction): Promise<User> {
    const { username, password } = req.body;
    if (!(username && password)) next(new WrongCredentialsException());

    let user = new User();

    try {
      user = await this.userRepository.findOneOrFail({ where: { username } });
    } catch (e) {
      return next(new UserNotFoundException(username))
    }

    if (user && !user.checkIfPasswordValid(password)) {
      return next(new WrongCredentialsException())
    }

    const accessToken = getAccessToken(username, user.role);
    const refreshToken = getRefreshtoken(username);
    refreshTokensList.push(refreshToken);

    res.json({ success: true, 
        accessToken, 
        refreshToken, 
        user: { 
          username: user.username, 
          id: user.id, 
          role: user.role, 
          group: user.group, 
          lastname: user.lastname, 
          firstname: user.firstname 
        }
      });
  }

  
  async register(req: Request, res: Response, next: NextFunction): Promise<User> {
    const {username, password, firstname, lastname, group }: any = req.body;
    
    if (await this.userRepository.findOne({username: username})) {
      return next(new UserWithThatUsernameExistsException(username));
    }
     
      const user = await this.userRepository.create({
        username,
        password, 
        firstname,
        lastname,
        group: group || null,
        role: UserRole.STUDENT
      });
    

    const errors = await validate(user, { validationError: { target: false, value: false } });
    if (errors.length) {
      return next(new HttpException(500, 'Validation Error', errors));
    }

    user.hashPassword();

    let createdUser: any;
    try {
      createdUser = await this.userRepository.save(user);
    } catch (e) {
      return next(new HttpException(400, 'Oops. Error occured on user creation', errors));
    }
  

    const accessToken = getAccessToken(username, UserRole.STUDENT);
    const refreshToken = getRefreshtoken(username);
    refreshTokensList.push(refreshToken);
    
    res.status(200).json({ success: true, 
      accessToken, 
      refreshToken, 
      user: { 
        username: createdUser.username, 
        id: createdUser.id, 
        role: createdUser.role, 
        group: createdUser.group, 
        lastname: createdUser.lastname, 
        firstname: createdUser.firstname 
      }
    });
  }

}
