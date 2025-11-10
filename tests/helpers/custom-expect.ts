import { expect, test } from '@playwright/test';
import logger from '@utils/logger';

const typedExpect: any = expect;

async function assertStep(stepTitle: string,
    assertionCallback: () => void, isSoft: boolean = false): Promise<void> {

    logger.info(stepTitle);
    await test.step(stepTitle, async () => {
        try {
            const beforeErr = test.info().errors.length;
            assertionCallback();
            if (isSoft) {
                const afterErr = test.info().errors.length;
                if (afterErr > beforeErr) logger.error('Soft Assertion Failed !!!');
            };
        } catch (error) {
            logger.error(error);
            throw error;
        }
    })
}

export async function expectToBe<T>(actual: T, expected: T, isSoft: boolean = false): Promise<void> {
    const stepTitle = `Assert [toBe]: Actual: '${String(actual)}' / Expected: '${String(expected)}'`;

    if (!isSoft) {
        await assertStep(stepTitle, () => { typedExpect(actual).toBe(expected) });
    } else {
        await assertStep(stepTitle, () => { typedExpect.soft(actual).toBe(expected) }, true);
    }
}

export async function expectToEqual<T>(actual: T, expected: T, isSoft: boolean = false): Promise<void> {
    const actualLog =
        typeof actual === 'object' && actual !== null ? JSON.stringify(actual) : String(actual);
    const expectedLog =
        typeof expected === 'object' && expected !== null ? JSON.stringify(expected) : String(expected);

    const stepTitle = `Assert [toEqual]: 
            - Actual: ${actualLog} 
            - Expect: ${expectedLog}`;

    if (!isSoft) {
        await assertStep(stepTitle, () => { typedExpect(actual).toEqual(expected) });
    } else {
        await assertStep(stepTitle, () => { typedExpect.soft(actual).toEqual(expected) }, true);
    }
}

export async function expectToContain(actual: string | Array<any>, expected: string | any, isSoft: boolean = false): Promise<void> {
    const stepTitle = `Assert [toContain]: Actual: '${String(actual)}' expected to contain: '${String(expected)}'`;

    if (!isSoft) {
        await assertStep(stepTitle, () => { typedExpect(actual).toContain(expected) });
    } else {
        await assertStep(stepTitle, () => { typedExpect.soft(actual).toContain(expected) }, true);
    }
}

export async function expectTrue(actual: any, isSoft: boolean = false): Promise<void> {
    const stepTitle = `Assert [toBeTruthy]: Actual: '${String(actual)}'`;

    if (!isSoft) {
        await assertStep(stepTitle, () => { typedExpect(actual).toBeTruthy() });
    } else {
        await assertStep(stepTitle, () => { typedExpect.soft(actual).toBeTruthy() }, true);
    }
}

export async function expectFalse(actual: any, isSoft: boolean = false): Promise<void> {
    const stepTitle = `Assert [toBeFalsy]: Actual: '${String(actual)}'`;

    if (!isSoft) {
        await assertStep(stepTitle, () => { typedExpect(actual).toBeFalsy() });
    } else {
        await assertStep(stepTitle, () => { typedExpect.soft(actual).toBeFalsy() }, true);
    }
}

export async function expectNotNull(actual: any, isSoft: boolean = false): Promise<void> {
    const stepTitle = `Assert [not.toBeNull]: Actual: '${String(actual)}' expected NOT to be null`;

    if (!isSoft) {
        await assertStep(stepTitle, () => { typedExpect(actual).not.toBeNull() });
    } else {
        await assertStep(stepTitle, () => { typedExpect.soft(actual).not.toBeNull() }, true);
    }
}