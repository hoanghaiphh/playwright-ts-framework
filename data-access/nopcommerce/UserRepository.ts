import { test } from '@playwright/test';
import sqlServiceInstance from '@services/sql-server.service';
import * as sql from 'mssql';

interface UserRecord {
    Email: string;
    FirstName: string;
    LastName: string;
    Company: string;
}

export class UserRepository {

    async getUserFromDatabaseByEmail(email: string): Promise<UserRecord | null> {
        const query =
            `SELECT [Email],[FirstName],[LastName],[Company] FROM [nopcommerce].[dbo].[Customer] WHERE [Email] = @email`;
        const parameters = [
            { name: 'email', type: sql.NVarChar(255), value: email }
        ];

        let result;
        await test.step(`Executed query: ${query} (${email})`, async () => {
            result = await sqlServiceInstance.executeParameterizedQuery<UserRecord>(query, parameters);
        });

        const recordSetLength = result!.recordset.length;
        switch (recordSetLength) {
            case 0: return null;
            case 1: return result!.recordset[0];
            default: throw new Error(`Logic Error: Found ${recordSetLength} results for unique email query.`);
        };
    }

    mapUser(email: string, firstName: string, lastName: string, company: string): UserRecord {
        return {
            Email: email,
            FirstName: firstName,
            LastName: lastName,
            Company: company
        };
    }

    async deleteUserFromDatabaseByEmail(email: string): Promise<void> {
        const query = `DELETE FROM [nopcommerce].[dbo].[Customer] WHERE [Email] = @email`;

        const parameters = [
            { name: 'email', type: sql.NVarChar(255), value: email }
        ];

        await sqlServiceInstance.executeParameterizedQuery(query, parameters);
    }

}

const userRepository = new UserRepository();

export default userRepository;