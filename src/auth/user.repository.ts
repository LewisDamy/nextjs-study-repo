import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersRepository extends Repository<User> {
  //
}

/* STACKOVERFLOW SOLUTION: */
// @Injectable()
// export class UsersRepository extends Repository<UsersEntity> {
//   constructor(private dataSource: DataSource) {
//     super(UsersEntity, dataSource.createEntityManager());
//   }
// }
