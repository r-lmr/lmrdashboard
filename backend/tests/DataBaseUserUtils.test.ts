import { DatabaseUserUtils } from "../irc/utils/db/Users";

test('nicks with roles to be sorted are sorted successfully', () => {
  const users = ['+B', '@B', '+A', 'A', '%A', 'B', '%B', '@A'];
  const sortedUsers = DatabaseUserUtils.getSortedUsersByRoleAndAlphabetically(users);
  expect(sortedUsers).toEqual(['@A', '@B', '%A', '%B', '+A', '+B', 'A', 'B']);
});

test('warning is printed if number of users differ', () => {
  const consoleSpy = jest.spyOn(console, 'warn');
  const users = ['+B', '@B', '+A', 'A', '%A', 'B', '%B', '@A', '@A']; // Notice duplicate user
  const sortedUsers = DatabaseUserUtils.getSortedUsersByRoleAndAlphabetically(users);
  expect(sortedUsers).toEqual(['@A', '@B', '%A', '%B', '+A', '+B', 'A', 'B']);
  expect(consoleSpy).toHaveBeenCalledWith('Sorting users resulted in different number of users');
});
