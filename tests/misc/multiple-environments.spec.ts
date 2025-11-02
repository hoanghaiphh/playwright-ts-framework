import { test, Page } from '@playwright/test';
import { currentConfig } from 'configs/env.config';

test.describe.serial('Run_On_Multiple_Environments', () => {

    test('Test', async ({ browser }) => {

        console.log(`App Url: ${currentConfig.appUrl}`);
        console.log(`App Username: ${currentConfig.appUsername}`);
        console.log(`App Password: ${currentConfig.appPassword}`);
        console.log(`Db Url: ${currentConfig.dbUrl}`);
        console.log(`Db Username: ${currentConfig.dbUsername}`);
        console.log(`Db Password: ${currentConfig.dbPassword}`);

        const page: Page = await browser.newPage();
        await page.goto('/');
        await page.waitForTimeout(2000);
        await page.close();
    });

})
