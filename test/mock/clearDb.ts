import { createConnection } from 'src/db';
const exec = require('child-process-promise').exec;

export async function clearDb() {
    console.info(`Clearing DB`);
    const connection = await createConnection();
    await connection.manager.query('DROP TABLE IF EXISTS migrations CASCADE');
    await connection.manager.query('DROP TABLE IF EXISTS profile CASCADE');

    await exec('npm run migrations:run');
    console.info(`Successfully cleared DB`);

    return connection;
}
