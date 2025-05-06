import { DataSource, Repository } from 'typeorm';
import { AdminModel } from './admin';
import { UserModel } from './user';

export class Models {
  static async new(dataSource: DataSource): Promise<Models> {
    return new Models(
      dataSource.getRepository(AdminModel),
      dataSource.getRepository(UserModel)
    );
  }

  constructor(
    readonly admin: Repository<AdminModel>,
    readonly user: Repository<UserModel>
  ) {}
}
