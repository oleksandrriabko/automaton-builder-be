export class HttpException extends Error {
    status: number;
    message: string;
    errors: Array<{}> | boolean;

    constructor(status: number, message: string, errors?: Array<{}> | boolean, name?:string) {
      super(message);
      this.status = status;
      this.message = message; 
      this.errors = errors;
      if (name) {
        this.name = name;
      }
    }
  }
