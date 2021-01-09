import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    updateProfile = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to update the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'jondoe@example.com',
      password: '123',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'John New',
      email: 'johnNew@example.com',
      old_password: '123',
      password: '123',
    });

    expect(updatedUser.name).toBe('John New');
    expect(updatedUser.email).toBe('johnNew@example.com');
  });

  it('should not be able to change to email to another existing email', async () => {
    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'jondoe@example.com',
      password: '123',
    });

    const user = await fakeUsersRepository.create({
      name: 'Test',
      email: 'test@example.com',
      password: '123',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Tes',
        email: 'jondoe@example.com',
        old_password: '123',
        password: '123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'jondoe@example.com',
      password: '123',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'John New',
      email: 'johnNew@example.com',
      old_password: '123',
      password: '123123',
    });

    expect(updatedUser.password).toBe('123123');
  });

  it('should not be able to update the password without password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'jondoe@example.com',
      password: '123',
    });

    expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'John New',
        email: 'johnNew@example.com',
        old_password: '',
        password: '',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the password without old_password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'jondoe@example.com',
      password: '123',
    });

    expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'John New',
        email: 'johnNew@example.com',
        old_password: '',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the password with wrong old_password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'jondoe@example.com',
      password: '123',
    });

    expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'John New',
        email: 'johnNew@example.com',
        old_password: 'wrong-old-password',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able show the user`s profile non existing', async () => {
    await expect(
      updateProfile.execute({
        user_id: 'non-existing-user-id',
        name: 'Test',
        email: 'test@example.com',
        old_password: '123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
