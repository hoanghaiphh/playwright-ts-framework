interface EnvironmentConfig {
    appUrl: string;
    appUsername: string;
    appPassword: string;
    dbServer: string;
    dbPort: number;
    dbName: string;
    dbUsername: string;
    dbPassword: string;
}

const environments: Record<string, EnvironmentConfig> = {

    localNopcommerce: {
        appUrl: 'http://localhost:8086',
        appUsername: 'haiph@automationfc.vn',
        appPassword: 'haiph@automationfc.vn',
        dbServer: 'localhost',
        dbPort: 1433,
        dbName: "nopcommerce",
        dbUsername: 'sa',
        dbPassword: 'haiph@automationfc.vn',
    },

    dev: {
        appUrl: 'https://www.google.com/',
        appUsername: 'dev_user@automationfc.vn',
        appPassword: 'dev_password_public',
        dbServer: 'localhost',
        dbPort: 1433,
        dbName: 'dev_db_name',
        dbUsername: 'dev_user_db',
        dbPassword: 'dev_db_pass_public',
    },

    test: {
        appUrl: 'https://www.facebook.com',
        appUsername: 'test_user@automationfc.vn',
        appPassword: 'test_password_public',
        dbServer: 'localhost',
        dbPort: 1433,
        dbName: 'test_db_name',
        dbUsername: 'test_user_db',
        dbPassword: 'test_db_pass_public',
    },

    staging: {
        appUrl: 'https://www.youtube.com/',
        appUsername: 'stage_user@automationfc.vn',
        appPassword: 'stage_password_public',
        dbServer: 'localhost',
        dbPort: 1433,
        dbName: 'stage_db_name',
        dbUsername: 'stage_user_db',
        dbPassword: 'stage_db_pass_public',
    },
};

const env = process.env.TEST_ENV || 'localNopcommerce';

export const currentConfig: EnvironmentConfig = environments[env] || environments.localNopcommerce;