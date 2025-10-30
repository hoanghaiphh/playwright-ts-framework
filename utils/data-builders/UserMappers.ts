import { UserInfo } from '@utils/data-contracts/UserInfo.model';
import { NestedJson, FlatJson } from '@utils/data-contracts/UserInfo.interface';
import { createUniqueEmail } from '@utils/helpers/common';

export class UserMappers {

    public static mapNestedJson(userJson: NestedJson): UserInfo {
        const userInfo = new UserInfo();

        userInfo.setFirstName(userJson.name.firstName);
        userInfo.setLastName(userJson.name.lastName);
        userInfo.setEmail(userJson.login.email);
        userInfo.setPassword(userJson.login.password);
        userInfo.setCompany(userJson.company);

        return userInfo;
    }

    public static mapFlatJson(userJson: FlatJson, browserName: string): UserInfo {
        const userInfo = new UserInfo();

        userInfo.setFirstName(userJson.firstName);
        userInfo.setLastName(userJson.lastName);
        userInfo.setCompany(userJson.company);

        const email = createUniqueEmail(`${userJson.firstName}.${userJson.lastName}`, browserName);
        userInfo.setEmail(email);

        const password = 'defaultPassword';
        userInfo.setPassword(password);

        return userInfo;
    }

}
