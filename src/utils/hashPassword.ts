import bcrypt from 'bcryptjs';
import { ArgumentValidationError } from 'type-graphql';
import zxcvbn from 'zxcvbn';

export const hashPassword = async (
  userInfo: { firstName?: string; lastName?: string; city?: string },
  password: string
): Promise<string> => {
  const info = [userInfo.firstName, userInfo.lastName, userInfo.city].filter(s =>
    Boolean(s)
  ) as string[];

  const result = zxcvbn(password, info);

  if (result.score < 2) {
    let msg = '';
    if (result.feedback.warning.length > 0) {
      msg += result.feedback.warning + '. ';
    }
    msg += result.feedback.suggestions.join(' ');

    if (msg.length === 0) {
      msg = 'Password is too easy to guess. Try a sentence with spaces.';
    }

    throw new ArgumentValidationError([
      {
        property: 'password',
        constraints: {
          password: msg,
        },
        children: [],
      },
    ]);
  }

  return bcrypt.hash(password, 12);
};
