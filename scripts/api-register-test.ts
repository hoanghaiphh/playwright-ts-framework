import { apiRegister } from '@apis/nopcommerce.api';

function generateRandomSuffix(): string {
    return Date.now().toString().slice(-6);
}

async function runApiTest() {

    const gender = 'M';
    const firstName = 'Api';
    const lastName = 'Debug';
    const company = 'Automation FC';
    const email = `api.debug_${generateRandomSuffix()}@nopcommerce.com`;
    const password = 'Abcd@1234';

    try {
        await apiRegister(gender, firstName, lastName, company, email, password);
        console.log(`API Registration SUCCESS: Email: ${email}`);
    } catch (e) {
        console.log(`API Registration FAILED: ${e}`);
    }
}

runApiTest().catch(console.error);