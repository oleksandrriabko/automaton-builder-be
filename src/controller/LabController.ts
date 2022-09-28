import { getRepository } from "typeorm";
import { NextFunction, Request, Response } from "express";
import { Lab } from "../entity/Lab";

export class LabController {
  private labRepository = getRepository(Lab);

  async listAll():Promise<Lab[]> {
    return await this.labRepository.find({relations: ['groups', 'userLabs','userLabs.user']});
  }

  async one(request: Request):Promise<Lab> {
    return this.labRepository.findOne(request.params.id);
  }

  async save(request: Request):Promise<Lab> {
    return this.labRepository.save(request.body);
  }

  async remove(request: Request):Promise<void> {
    const userToRemove = await this.labRepository.findOne(request.params.id);
    await this.labRepository.remove(userToRemove);
  }
}
