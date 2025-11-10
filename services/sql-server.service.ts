import { currentConfig } from '@configs/env.config';
import logger from '@utils/logger';
import * as sql from 'mssql';

const dbConfig: sql.config = {
    user: currentConfig.dbUsername,
    password: currentConfig.dbPassword,
    server: currentConfig.dbServer,
    port: currentConfig.dbPort,
    database: currentConfig.dbName,
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    },
    options: {
        encrypt: false,
        trustServerCertificate: true,
        connectTimeout: 15000
    }
};

export class SqlServerService {

    private connectionPool: sql.ConnectionPool | undefined;

    async connect(): Promise<void> {
        if (!this.connectionPool) {
            try {
                this.connectionPool = await new sql.ConnectionPool(dbConfig).connect();
                logger.info(`Connected to SQL server ${dbConfig.database} at ${dbConfig.server}:${dbConfig.port}`);
            } catch (error) {
                logger.error('Failed to initialize database connection: ', error);
                throw error;
            }
        }
    }

    async disconnect(): Promise<void> {
        if (this.connectionPool) {
            try {
                await this.connectionPool.close();
                this.connectionPool = undefined;
                logger.info('Database connection closed.');
            } catch (error) {
                logger.error('Failed to close database connection: ', error);
                throw error;
            }
        }
    }

    async executeQuery<T>(query: string): Promise<sql.IResult<T>> {
        if (!this.connectionPool) await this.connect();

        try {
            const result = await this.connectionPool!.request().query<T>(query);
            const rowCount = result.rowsAffected.length > 0
                ? result.rowsAffected[0]
                : result.recordset
                    ? result.recordset.length
                    : 0;

            logger.info(`Executed:
            - Query: ${query}
            - Rows affected/returned: ${rowCount}`);

            return result;
        } catch (error) {
            logger.error(`Failed to execute query: ${query}`, error);
            throw error;
        }
    }

    async executeParameterizedQuery<T>(
        query: string, parameters: { name: string, type: sql.ISqlType, value: any }[])
        : Promise<sql.IResult<T>> {

        if (!this.connectionPool) await this.connect();

        try {
            const request = this.connectionPool!.request();
            parameters.forEach(param => { request.input(param.name, param.type, param.value); });
            const result = await request.query<T>(query);
            const rowCount = result.rowsAffected.length > 0
                ? result.rowsAffected[0]
                : result.recordset
                    ? result.recordset.length
                    : 0;

            logger.info(`Executed:
            - Query: ${query}
            - Parameters: ${JSON.stringify(parameters)}
            - Rows affected/returned: ${rowCount}`);

            return result;
        } catch (error) {
            logger.error(`Failed to execute parameterized query: ${query}`, error);
            throw error;
        }
    }

}

const sqlServiceInstance = new SqlServerService();

export default sqlServiceInstance;