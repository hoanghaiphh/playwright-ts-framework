import { Json1, Json2, Json3 } from '@models/json-schema.interface';
import { UserInfoInterface } from '@models/user-info.interface';
import { JsonDataService } from '@services/json.service';
import { ExcelDataService, DataRow } from '@services/excel.service';
import { createUniqueEmail } from '@utils/common';
import logger from '@utils/logger';

export class UserFactory {

    public static getUserFromJson1(): UserInfoInterface {
        const relativePath = 'test-data/user-info/user-info-1.json';
        const rawUserObject = JsonDataService.loadJsonObject<Json1>(relativePath);

        if (rawUserObject === undefined) throw new Error("JSON data null");

        return {
            firstName: rawUserObject.name.firstName,
            lastName: rawUserObject.name.lastName,
            email: rawUserObject.login.email,
            password: rawUserObject.login.password,
            company: rawUserObject.company,
        };
    }

    public static getAllUsersFromJson2(browserName: string): UserInfoInterface[] {
        const relativePath = 'test-data/user-info/user-info-2.json';
        const rawDataObject = JsonDataService.loadJsonObject<Json2>(relativePath);

        if (rawDataObject === undefined) throw new Error("JSON data null");

        const rawUsersArray: Json3[] = rawDataObject.users;

        return rawUsersArray.map(rawUser => ({
            firstName: rawUser.firstName,
            lastName: rawUser.lastName,
            company: rawUser.company,
            email: createUniqueEmail(`${rawUser.firstName}.${rawUser.lastName}`, browserName),
            password: 'defaultPassword',
        }));
    }

    public static getAllUsersFromJson3(browserName: string): UserInfoInterface[] {
        const relativePath = 'test-data/user-info/user-info-3.json';
        const rawUsersArray = JsonDataService.loadJsonArray<Json3>(relativePath);

        return rawUsersArray.map(rawUser => ({
            firstName: rawUser.firstName,
            lastName: rawUser.lastName,
            company: rawUser.company,
            email: createUniqueEmail(`${rawUser.firstName}.${rawUser.lastName}`, browserName),
            password: 'defaultPassword',
        }));
    }

    public static async getAllUsersFromExcel(sheetName?: string): Promise<UserInfoInterface[]> {
        const relativePath = 'test-data/user-info/user-info.xlsx';
        const excelService = new ExcelDataService();
        const rawUsersArray: DataRow[] = await excelService.readExcelFile(relativePath, sheetName);

        if (rawUsersArray.length === 0) {
            logger.warn(`WARNING: Excel file at ${relativePath} is empty or sheet "${sheetName}" not found.`);
            return [];
        }

        return rawUsersArray.map(rawUser => ({
            firstName: (rawUser.firstname ?? '').toString(),
            lastName: (rawUser.lastname ?? '').toString(),
            company: (rawUser.company ?? '').toString(),
            email: (rawUser.email ?? '').toString(),
            password: (rawUser.password ?? '').toString(),
        }));
    }

}
