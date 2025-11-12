import { request, APIRequestContext } from '@playwright/test';
import { currentConfig } from '@env';
import * as fs from 'fs';
import path from 'path';
import logger from '@utils/logger';

const UI_BASE_URL = currentConfig.appUrl;
const LOGIN_ENDPOINT = '/login';
const REGISTER_ENDPOINT = '/register';
const TOKEN_KEY = '__RequestVerificationToken';

async function getCsrfToken(apiContext: APIRequestContext, endpoint: string): Promise<string> {
    const response = await apiContext.get(endpoint);
    const html = await response.text();
    const tokenMatch = html.match(new RegExp(`<input name="${TOKEN_KEY}" type="hidden" value="(.*?)" />`));

    if (!tokenMatch || !tokenMatch[1]) {
        throw new Error(`Could not find CSRF Token on the page ${endpoint}.`);
    }
    return tokenMatch[1];
}

async function performApiLogin(email: string, password: string): Promise<any> {

    const apiContext = await request.newContext({
        baseURL: UI_BASE_URL,
        ignoreHTTPSErrors: true,
        maxRedirects: 0,
    });

    const csrfToken = await getCsrfToken(apiContext, LOGIN_ENDPOINT);

    const finalPayload = {
        Email: email,
        Password: password,
        RememberMe: 'false',
        [TOKEN_KEY]: csrfToken,
    };

    const loginResponse = await apiContext.post(LOGIN_ENDPOINT, {
        form: finalPayload,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    if (loginResponse.status() !== 302) {
        await apiContext.dispose();
        throw new Error(`API Login failed. Status: ${loginResponse.status()}. Email: ${email}`);
    } else {
        const finalStorageState = await apiContext.storageState();
        await apiContext.dispose();
        return finalStorageState;
    }
}

export async function apiLogin(email: string, password: string): Promise<any> {

    const stateDir = path.join(process.cwd(), 'playwright-cache');
    const stateFileName = `${email}.json`.replace('@', '.');
    const statePath = path.join(stateDir, stateFileName);

    if (!fs.existsSync(stateDir)) fs.mkdirSync(stateDir, { recursive: true });

    if (fs.existsSync(statePath)) {
        const stats = fs.statSync(statePath);
        const fileAgeMs = Date.now() - stats.mtimeMs;
        const fileAgeMin = (fileAgeMs / 1000 / 60).toFixed(1);

        if (fileAgeMs < (60 * 60 * 1000)) {
            logger.info(`Cache found for ${email}. State is FRESH (${fileAgeMin} mins old). Loading...`);

            const stateContent = fs.readFileSync(statePath, 'utf-8');
            return JSON.parse(stateContent);
        } else {
            logger.info(`Cache found for ${email}. State is STALE (${fileAgeMin} mins old). Refreshing...`);
        }
    } else {
        logger.info(`No cache file found for ${email}. Performing API login...`);
    }

    const finalStorageState = await performApiLogin(email, password);

    fs.writeFileSync(statePath, JSON.stringify(finalStorageState));
    logger.info(`Login success for ${email}. New state file created in 'playwright-cache/'`);

    return finalStorageState;
}

export async function apiRegister(
    gender: string, firstName: string, lastName: string, company: string, email: string, password: string)
    : Promise<any> {

    const apiContext = await request.newContext({
        baseURL: UI_BASE_URL,
        ignoreHTTPSErrors: true,
        maxRedirects: 0,
    });

    const csrfToken = await getCsrfToken(apiContext, REGISTER_ENDPOINT);

    const finalPayload = {
        Gender: gender,
        FirstName: firstName,
        LastName: lastName,
        Email: email,
        Company: company,
        Password: password,
        ConfirmPassword: password,

        [TOKEN_KEY]: csrfToken,
        'register-button': 'Register',
    };

    const registerResponse = await apiContext.post(REGISTER_ENDPOINT, {
        form: finalPayload,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    if (registerResponse.status() !== 302) {
        await apiContext.dispose();
        throw new Error(`API Registration failed. Status: ${registerResponse.status()}. Email: ${email}`);
    } else {
        const finalStorageState = await apiContext.storageState();
        await apiContext.dispose();
        logger.info(`API Registration successful. Redirect status 302. Email: ${email}`);
        return finalStorageState;
    }
}