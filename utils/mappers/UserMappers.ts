import { UserInfo } from '@utils/models/UserInfo.model';
import { NestedUserJson, UserListJson, FlatUserJson } from '@utils/interfaces/UserInfo.interface';
import { createUniqueEmail } from '@utils/helpers/common';

export class UserMappers {

    public static mapNestedUserJson(userJson: NestedUserJson): UserInfo {
        const userInfo = new UserInfo();

        userInfo.setFirstName(userJson.name.firstName);
        userInfo.setLastName(userJson.name.lastName);
        userInfo.setEmail(userJson.login.email);
        userInfo.setPassword(userJson.login.password);
        userInfo.setCompany(userJson.company);

        return userInfo;
    }

    public static mapFlatUserJson(userJson: FlatUserJson, browserName: string): UserInfo {
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
