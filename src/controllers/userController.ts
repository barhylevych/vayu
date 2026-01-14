import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/userService';
import { GroupService } from '../services/groupService';
import type { PaginationQuery, RemoveUserFromGroupParams } from '../types';

class UserController {
  async getAllUsers(
    req: Request<Record<string, any>, any, any, PaginationQuery>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const pagination = req.query;
      const result = await UserService.getAllUsers(pagination);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async removeUserFromGroup(
    req: Request<RemoveUserFromGroupParams, any, any, any>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.params.userId;
      const groupId = req.params.groupId;

      const user = await UserService.getUserById(userId);
      if (!user) return res.status(404).json({ error: 'User not found' });

      const group = await GroupService.getGroupById(groupId);
      if (!group) return res.status(404).json({ error: 'Group not found' });

      await UserService.removeUserFromGroup(userId, groupId);

      const memberCount = await GroupService.getGroupMemberCount(groupId);

      if (memberCount === 0)
        await GroupService.updateGroupStatus(groupId, 'Empty');

      return res.status(204).send();
    } catch (error) {
      return next(error);
    }
  }
}

const userController = new UserController();
export { userController as UserController };
