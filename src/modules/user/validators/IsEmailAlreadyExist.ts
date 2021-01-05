import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { getManager } from 'typeorm';
import { UserRepository } from '../UserRepsitory';

@ValidatorConstraint({ name: 'isEmailAlreadyExist', async: true })
export class IsEmailAlreadyExistConstraint implements ValidatorConstraintInterface {
  public async validate(email: string): Promise<boolean> {
    const userRepository = getManager().getCustomRepository(UserRepository);
    const user = await userRepository.findByEmail(email);
    return Boolean(user);
  }
}

export function IsEmailAlreadyExist(validationOptions?: ValidationOptions) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return (object: object, propertyName: string): void => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsEmailAlreadyExistConstraint,
    });
  };
}
