import { registerAs } from "@nestjs/config";

export default registerAs('database', () => ({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    autoLoadEntities: true,
    synchronize: process.env.NODE_ENV === 'development',
    logging: process.env.NODE_ENV === 'development',
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    extra: {
        max: 20,
        connectionTimeoutMillis: 2000,
        idleTimeoutMillis: 30000,
        ...(process.env.NODE_ENV === 'production' && {
            ssl: {
                rejectUnauthorized: false,
            },
        }),
    },
}))