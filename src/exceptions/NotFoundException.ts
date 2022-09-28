import {HttpException} from './HttpException';

export class UserNotFoundException extends HttpException {
  constructor(username: string) {
    super(404, `User with username ${username} not found`);
  }
}

export class GroupNotFoundException extends HttpException {
  constructor() {
    super(404, `Group wasn't not found`);
  }
}

export class LabNotFoundException extends HttpException {
  constructor() {
    super(404, `Lab wasn't not found`);
  }
}