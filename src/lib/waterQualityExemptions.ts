import axios from 'axios';
import { Entry } from 'src/models/Entry.model';
import { EntryType } from '.';
import { getCoordinates } from 'src/util/getCoordinates';

export async function populateWaterQualityExemptions() {
    const { data: { items } } = await axios.get(`https://environment.data.gov.uk/public-register/water-discharge-exemptions/registration.json?_limit=9999999`);

    console.info(`Saving [${items.length}] items`);

    await Promise.all(
        items.filter((a: any) => a).map(async (item: any) => {
            const location = item.site?.location;


            const entry = new Entry();
            entry.originalRecord = JSON.stringify(item);
            entry.itemUrl = item['@id'];
            entry.type = EntryType.WATERQUALITYEXEMPTION;

            if (location) {
                entry.point = {
                    type: 'Point',
                    coordinates: getCoordinates(location),
                };
            }

            entry.startDate = item.exemption?.startDate;
            entry.siteAddress = item.site?.siteAddress?.address;

            entry.summary = `${item.site?.exemption?.registrationType?.comment}`;
            entry.description = `Registration Type: ${item.site?.exemption?.registrationType?.comment}
Register: ${item.register?.label}
Authority Name: ${item.localAuthority?.label}`;

            return entry.save();
        })
    );
}