/* eslint-disable camelcase */
import { v4 as uuid } from 'uuid';

import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';

import UserToken from '../../infra/typeorm/entities/UserToken';

class FakeUserTokensRepository implements IUserTokensRepository {
  private usertokens: UserToken[] = [];

  public async generate(user_id: string): Promise<UserToken> {
    const usertoken = new UserToken();

    Object.assign(usertoken, {
      id: uuid(),
      token: uuid(),
      user_id,
      created_at: new Date(),
      updated_at: new Date(),
    });

    this.usertokens.push(usertoken);

    return usertoken;
  }

  public async findByToken(token: string): Promise<UserToken | undefined> {
    const findUserToken = this.usertokens.find(t => t.token === token);
    return findUserToken;
  }
}

export default FakeUserTokensRepository;
