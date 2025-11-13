import { apiLogin } from '@apis/nopcommerce.api';

async function runApiTest() {

    const email = "playwright.chrome@nopcommerce.com";
    const password = "Abcd@1234";

    try {
        await apiLogin(email, password);
        console.log(`API Login SUCCESS: Email: ${email}`);
    } catch (e) {
        console.log(`API Login FAILED: ${e}`);
    }
}

runApiTest().catch(console.error);