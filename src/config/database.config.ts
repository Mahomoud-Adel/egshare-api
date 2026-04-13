import { registerAs } from "@nestjs/config";

export default registerAs('database', () => ({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    autoLoadEntities: true,
    synchronize: process.env.NODE_ENV === 'development',
    logging: process.env.NODE_ENV === 'development',
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    extra: {
        max: 10,
        connectionTimeoutMillis: 10000,
        idleTimeoutMillis: 30000,
        keepalive: true,
        ...(process.env.NODE_ENV === 'production' && {
            ssl: {
                rejectUnauthorized: false,
            },
        }),
    },
}))