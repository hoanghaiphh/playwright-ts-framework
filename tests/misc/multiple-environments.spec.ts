import { test } from '@playwright/test';
import { currentConfig } from '@configs/env.config';

test('Run_On_Multiple_Environments', async ({ page }) => {

    console.log(`App Url: ${currentConfig.appUrl}`);
    console.log(`App Username: ${currentConfig.appUsername}`);
    console.log(`App Password: ${currentConfig.appPassword}`);
    console.log(`Db Server: ${currentConfig.dbServer}`);
    console.log(`Db Port: ${currentConfig.dbPort}`);
    console.log(`Db Name: ${currentConfig.dbName}`);
    console.log(`Db Username: ${currentConfig.dbUsername}`);
    console.log(`Db Password: ${currentConfig.dbPassword}`);

    await page.goto('/');
    await page.waitForTimeout(2000);
});