import { clearDb } from "./clearDb";
import { createProfile } from './profile';

const testPhoneNumbers = ['+447123123123', '+447321321321'];
export async function mock() {
    console.info(`Starting Mock`);
    await clearDb();

    const profiles = await Promise.all(
        testPhoneNumbers.map(phoneNumber => createProfile({ phoneNumber }))
    );

    console.info(`Made [${profiles.length}] profiles`);

    console.log('💰💰 Go earn some money bro! 💰💰');
}


if (process.env.MOCK_DATA) {
    mock().catch(console.error);
} else {
    console.info(`[process.env.MOCK_DATA=${process.env.MOCK_DATA}], not running`);
}
