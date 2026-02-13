import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const {
    DB_HOST = '127.0.0.1',
    DB_PORT = '3306',
    DB_NAME = 'hotel_booking',
    DB_USER = 'root',
    DB_PASSWORD = '',
    DB_DIALECT = 'mysql',
} = process.env;

export const sequelize = new Sequelize(
    DB_NAME,
    DB_USER,
    DB_PASSWORD,
    {
        host: DB_HOST,
        port: Number(DB_PORT),
        dialect: DB_DIALECT as any,
        logging: false,
        define: {
            underscored: true,
        },
        pool: {
            max: 10,
            min: 0,
            acquire: 30000,
            idle: 10000,
        },
    }
);

export async function testConnection(): Promise<void> {
    try {
        await sequelize.authenticate();
        // eslint-disable-next-line no-console
        console.log('Database connection has been established successfully.');
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Unable to connect to the database:', error);
        throw error;
    }
}

export default sequelize;
