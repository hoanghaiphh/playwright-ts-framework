import { UserInfo } from '@utils/models/UserInfo.model';
import { NestedUserJson, UserListJson, FlatUserJson } from '@utils/interfaces/UserInfo.interface';
import { JsonDataService } from '@utils/services/JsonDataService';
import { UserMappers } from '@utils/mappers/UserMappers';

export class UserFactory {

    public static getUserFromJson1(): UserInfo {

        const rawUserObject = JsonDataService.loadJsonObject<NestedUserJson>('test-data/users/user-info-1.json');

        if (rawUserObject === undefined) throw new Error("JSON data null");

        return UserMappers.mapNestedUserJson(rawUserObject);
    }

    public static getAllUsersFromJson2(browserName: string): UserInfo[] {

        const rawDataObject = JsonDataService.loadJsonObject<UserListJson>('test-data/users/user-info-2.json');

        if (rawDataObject === undefined) throw new Error("JSON data null");

        const rawUsersArray: FlatUserJson[] = rawDataObject.users;

        return rawUsersArray.map(rawUser => UserMappers.mapFlatUserJson(rawUser, browserName));
    }

    public static getAllUsersFromJson3(browserName: string): UserInfo[] {

        const rawUsersArray = JsonDataService.loadJsonArray<FlatUserJson>('test-data/users/user-info-3.json');

        return rawUsersArray.map(rawUser => UserMappers.mapFlatUserJson(rawUser, browserName));
    }

}
