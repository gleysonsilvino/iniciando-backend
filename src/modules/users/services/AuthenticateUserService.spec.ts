import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import AuthenticateUserService from './AuthenticateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let authenticateUser: AuthenticateUserService;

describe('Authenticate', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    authenticateUser = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to authenticate', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'jondoe@example.com',
      password: '123',
    });

    const response = await authenticateUser.execute({
      email: 'jondoe@example.com',
      password: '123',
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toBe(user);
  });

  it('should not be able authenticate with non existing user', async () => {
    await expect(
      authenticateUser.execute({
        email: 'jondoe@example.com',
        password: '123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate with wrong password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'jondoe@example.com',
      password: '123',
    });

    authenticateUser.execute({
      email: 'jondoe@example.com',
      password: '1234',
    });

    expect(user).toHaveProperty('id');
    await expect(
      authenticateUser.execute({
        email: 'jondoe@example.com',
        password: '1234',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
