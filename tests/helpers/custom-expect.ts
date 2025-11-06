import { expect, test } from '@playwright/test';
import logger from '@utils/logger';

const typedExpect: any = expect;

async function assertStep(stepTitle: string, assertionCallback: () => void): Promise<void> {
    await test.step(stepTitle, async () => {
        try {
            assertionCallback();
            logger.info(stepTitle);
        } catch (error) {
            logger.error(`${stepTitle} - FAILED: ${error}`);
            throw error;
        }
    })
}

export async function expectToBe<T>(actual: T, expected: T): Promise<void> {
    const stepTitle = `Assert [toBe]: Actual: '${String(actual)}' / Expected: '${String(expected)}'`;
    await assertStep(stepTitle, () => { typedExpect(actual).toBe(expected) });
}

export async function expectToEqual<T>(actual: T, expected: T): Promise<void> {
    const actualLog =
        typeof actual === 'object' && actual !== null ? JSON.stringify(actual, null, 2) : String(actual);
    const expectedLog =
        typeof expected === 'object' && expected !== null ? JSON.stringify(expected, null, 2) : String(expected);

    const stepTitle = `Assert [toEqual]: Actual: ${actualLog} / Expected: ${expectedLog}`;
    await assertStep(stepTitle, () => { typedExpect(actual).toEqual(expected) });
}

export async function expectToContain(actual: string | Array<any>, expected: string | any): Promise<void> {
    const stepTitle = `Assert [toContain]: Actual: '${String(actual)}' expected to contain: '${String(expected)}'`;
    await assertStep(stepTitle, () => { typedExpect(actual).toContain(expected) });
}

export async function expectTrue(actual: any): Promise<void> {
    const stepTitle = `Assert [toBeTruthy]: Actual: '${String(actual)}'`;
    await assertStep(stepTitle, () => { typedExpect(actual).toBeTruthy() });
}

export async function expectFalse(actual: any): Promise<void> {
    const stepTitle = `Assert [toBeFalsy]: Actual: '${String(actual)}'`;
    await assertStep(stepTitle, () => { typedExpect(actual).toBeFalsy() });
}

export async function expectNotNull(actual: any): Promise<void> {
    const stepTitle = `Assert [not.toBeNull]: Actual: '${String(actual)}' expected NOT to be null`;
    await assertStep(stepTitle, () => { typedExpect(actual).not.toBeNull() });
}