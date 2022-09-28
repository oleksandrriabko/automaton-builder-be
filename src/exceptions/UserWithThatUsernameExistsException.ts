import {HttpException} from './HttpException';

export class UserWithThatUsernameExistsException extends HttpException {
  constructor(email: string) {
    super(400, `User with username ${email} already exists`);
  }
}