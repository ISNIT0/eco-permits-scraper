import axios from 'axios';
import { Entry } from 'src/models/Entry.model';
import { EntryType } from '.';

export async function populateWaterQualityExemptions() {
    const { data: { items } } = await axios.get(`https://environment.data.gov.uk/public-register/water-discharge-exemptions/registration.json?_limit=9999999`);

    await Promise.all(
        items.map(async (item: any) => {
            const { site: { location: { ["@id"]: locId } } } = item;

            const entry = new Entry();
            const { data: { items: [{ lat, long }] } } = await axios.get((locId as string) + '.json');
            entry.originalRecord = JSON.stringify(item);
            entry.itemUrl = item['@id'];
            entry.type = EntryType.WATERQUALITYEXEMPTION;

            entry.point = {
                type: 'Point',
                coordinates: [lat, long]
            };
            return entry.save();
        })
    );
}