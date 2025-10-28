export interface UserInfo {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  password: string;
}

export function createUserInfo(overrides?: Partial<UserInfo>): UserInfo {
  const rnd = Math.floor(Math.random() * 100000);
  const firstName = overrides?.firstName ?? `First${rnd}`;
  const lastName = overrides?.lastName ?? `Last${rnd}`;
  const email = overrides?.email ?? `auto${rnd}@example.com`;
  const company = overrides?.company ?? `Company${rnd}`;
  const password = overrides?.password ?? `P@ssw0rd${rnd}`;

  return { firstName, lastName, email, company, password };
}