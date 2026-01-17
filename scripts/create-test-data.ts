import { apiRegister } from '@apis/nopcommerce.api';
import * as fs from 'fs';
import * as path from 'path';

type UserData = {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    company: string;
    gender: string;
};

async function runApiTest() {
    const jsonPath = path.resolve(__dirname, '../tests/data/nopcommerce-users.json');

    const rawData = fs.readFileSync(jsonPath, 'utf-8');
    const users: Record<string, UserData> = JSON.parse(rawData);

    for (const [key, user] of Object.entries(users)) {
        try {
            await apiRegister(
                user.gender.charAt(0), user.firstName, user.lastName, user.company, user.email, user.password
            );
            console.log(`SUCCESS [${key}] - ${user.email}`);
        } catch (e) {
            console.error(`FAILED  [${key}] - ${user.email}`, e);
        }
    }
}

runApiTest().catch(console.error);