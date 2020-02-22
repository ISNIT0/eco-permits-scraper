import axios from 'axios';
import { Entry } from 'src/models/Entry.model';
import { EntryType } from '.';

export async function populateWastePermits() {
    const { data: { items } } = await axios.get(`https://environment.data.gov.uk/public-register/waste-operations/registration.json?_limit=20`);

    await Promise.all(
        items.map(async (item: any) => {
            try {
                const { site: { location: { ["@id"]: locId } } } = item;

                const entry = new Entry();
                const { data: { items: [{ lat, long }] } } = await axios.get((locId as string) + '.json');
                entry.originalRecord = JSON.stringify(item);
                entry.itemUrl = item['@id'];
                entry.type = EntryType.WASTEPERMIT;

                entry.point = {
                    type: 'Point',
                    coordinates: [lat, long]
                };
                return await entry.save();
            } catch (err) {
                console.error(`Failed to insert record [${item['@id']}]`, err);
            }
        })
    );
}