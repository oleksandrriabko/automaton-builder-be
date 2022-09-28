import * as dotenv from 'dotenv';

import "reflect-metadata";
import { createConnection } from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import { Request, Response } from "express";
import { Routes } from "./routes";
import { User, UserRole } from "./entity/User";
import { Group } from "./entity/Group";
import { Lab } from "./entity/Lab";
import { authMiddleware } from './middleware/auth';
import { errorMiddleware } from './middleware/error';
import { roleMiddleware} from './middleware/role';

dotenv.config();
createConnection()
  .then(async (connection) => {
    // create express app
    const app = express();
    app.use(cors());
    app.use(express.json());

    // register express routes from defined application routes
    Routes.forEach((route) => {
      (app as any)[route.method](route.route, authMiddleware(!!route.withAuth), (req: Request, res: Response, next: Function) => {
        const result = new (route.controller as any)()[route.action](req, res, next);
        if (result instanceof Promise) {
          result.then((result) =>
            result !== null && result !== undefined ? res.send(result) : undefined
          );
        } else if (result !== null && result !== undefined) {
          res.json(result);
        }
      }, errorMiddleware);
    });

    // setup express app here

    // start express server
    app.listen(8080);

  //  const initialGroup =  connection.manager.create(Group, {
  //     name: 'TV-71',
  // });

  // const lab1 =  connection.manager.create(Lab, {
  //   title: 'Lab 1',
  //   automataCode: '"hey":[]'
  // });

  // await connection.manager.save(lab1);

  // await connection.manager.save(initialGroup);

    // insert new users for test
    // await connection.manager.save(connection.manager.create(User, {
    //     firstName: "Alex",
    //     lastName: "Swonson",
    //     username: 'check',
    //     password: '$2a$08$1znSpaTg83Fdz7TOppF5Fua3IJPmXBKHhxkzZEQwnaz7DGLVqsTIm',
    //     role: UserRole.STUDENT,
    // }));

    console.log(
      "Express server has started on port 8080. Open http://localhost:8080/users to see results"
    );
  })
  .catch((error) => console.log(error));
