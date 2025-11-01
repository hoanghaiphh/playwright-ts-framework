import { fakerEN, fakerVI } from '@faker-js/faker';
import { createUniqueEmail } from '@utils/helpers/common';
import { UserInfoModel } from '@utils/data-contracts/UserInfo.model';

export class UserGenerator {

    public static generate(browserName: string, overrides?: Partial<UserInfoModel>): UserInfoModel {

        const randomFirstName = fakerVI.person.firstName();
        const randomLastName = fakerVI.person.lastName();
        const randomCompany = fakerEN.company.name();
        const randomPassword = fakerEN.internet.password({ length: 12 });

        const firstName = overrides?.firstName ?? randomFirstName;
        const lastName = overrides?.lastName ?? randomLastName;
        const email = overrides?.email ?? createUniqueEmail(`${firstName}.${lastName}`, browserName);
        const company = overrides?.company ?? randomCompany;
        const password = overrides?.password ?? randomPassword;

        const userInfo = new UserInfoModel();
        userInfo.setFirstName(firstName);
        userInfo.setLastName(lastName);
        userInfo.setEmail(email);
        userInfo.setCompany(company);
        userInfo.setPassword(password);

        return userInfo;
    }

}
