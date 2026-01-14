import { Request, Response, NextFunction } from 'express';
import { GroupService } from '../services/groupService';
import type { PaginationQuery } from '../types';

class GroupController {
  async getAllGroups(
    req: Request<any, any, any, PaginationQuery>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const pagination = req.query;
      const result = await GroupService.getAllGroups(pagination);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}
const groupController = new GroupController();
export { groupController as GroupController };
