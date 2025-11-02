interface EnvironmentConfig {
    appUrl: string;
    appUsername: string;
    appPassword: string;
    dbUrl: string;
    dbUsername: string;
    dbPassword: string;
}

const environments: Record<string, EnvironmentConfig> = {

    localNopcommerce: {
        appUrl: 'http://localhost:8086',
        appUsername: 'haiph@automationfc.vn',
        appPassword: 'haiph@automationfc.vn',
        dbUrl: 'jdbc:sqlserver://localhost:1433;databaseName=nopcommerce;TrustServerCertificate=True',
        dbUsername: 'sa',
        dbPassword: 'haiph@automationfc.vn',
    },

    dev: {
        appUrl: 'https://www.google.com/',
        appUsername: 'dev_user@automationfc.vn',
        appPassword: 'dev_password_public',
        dbUrl: 'jdbc:sqlserver://localhost:1433;databaseName=nopcommerce_dev',
        dbUsername: 'sa_dev',
        dbPassword: 'dev_db_pass_public',
    },

    test: {
        appUrl: 'https://www.facebook.com',
        appUsername: 'test_user@automationfc.vn',
        appPassword: 'test_password_public',
        dbUrl: 'jdbc:sqlserver://test_server:1433;databaseName=nopcommerce_test',
        dbUsername: 'test_user_db',
        dbPassword: 'test_db_pass_public',
    },

    staging: {
        appUrl: 'https://www.youtube.com/',
        appUsername: 'stage_user@automationfc.vn',
        appPassword: 'stage_password_public',
        dbUrl: 'jdbc:sqlserver://stage_server:1433;databaseName=nopcommerce_stage',
        dbUsername: 'stage_user_db',
        dbPassword: 'stage_db_pass_public',
    },
};

const env = process.env.TEST_ENV || 'localNopcommerce';

export const currentConfig: EnvironmentConfig = environments[env] || environments.localNopcommerce;