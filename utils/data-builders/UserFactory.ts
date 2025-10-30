import { UserInfo } from '@utils/data-contracts/UserInfo.model';
import { NestedJson, FlatInNestedJson, FlatJson } from '@utils/data-contracts/UserInfo.interface';
import { UserMappers } from '@utils/data-builders/UserMappers';
import { JsonDataService } from '@utils/services/JsonDataService';

export class UserFactory {

    public static getUserFromJson1(): UserInfo {
        const relativePath = 'test-data/user-info/user-info-1.json';
        const rawUserObject = JsonDataService.loadJsonObject<NestedJson>(relativePath);

        if (rawUserObject === undefined) throw new Error("JSON data null");

        return UserMappers.mapNestedJson(rawUserObject);
    }

    public static getAllUsersFromJson2(browserName: string): UserInfo[] {
        const relativePath = 'test-data/user-info/user-info-2.json';
        const rawDataObject = JsonDataService.loadJsonObject<FlatInNestedJson>(relativePath);

        if (rawDataObject === undefined) throw new Error("JSON data null");

        const rawUsersArray: FlatJson[] = rawDataObject.users;

        return rawUsersArray.map(rawUser => UserMappers.mapFlatJson(rawUser, browserName));
    }

    public static getAllUsersFromJson3(browserName: string): UserInfo[] {
        const relativePath = 'test-data/user-info/user-info-3.json';
        const rawUsersArray = JsonDataService.loadJsonArray<FlatJson>(relativePath);

        return rawUsersArray.map(rawUser => UserMappers.mapFlatJson(rawUser, browserName));
    }

}
