import axios from 'axios';
import { Entry } from 'src/models/Entry.model';
import { EntryType } from '.';

export async function populateWasteExemptions() {
    const { data: { items } } = await axios.get(`https://environment.data.gov.uk/public-register/waste-exemptions/registration.json?_limit=99999999`);

    await Promise.all(
        items.map(async (item: any) => {
            const [{ location }] = item.site;
            const entry = new Entry();
            const { data: { items: [{ lat, long }] } } = await axios.get((location['@id'] as string) + '.json');
            entry.originalRecord = JSON.stringify(item);
            entry.itemUrl = item['@id'];
            entry.type = EntryType.WASTEEXEMPTION;

            entry.point = {
                type: 'Point',
                coordinates: [lat, long]
            };
            return entry.save();
        })
    );
}