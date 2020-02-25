import axios from 'axios';
import { Entry } from 'src/models/Entry.model';
import { EntryType } from '.';
import { getCoordinates } from 'src/util/getCoordinates';

export async function populateWasteExemptions() {
    const { data: { items } } = await axios.get(`https://environment.data.gov.uk/public-register/waste-exemptions/registration.json?_limit=99999999`);

    console.info(`Saving [${items.length}] items`);

    await Promise.all(
        items.filter((a: any) => a).map(async (item: any) => {
            const [{ location }] = item.site;

            const entry = new Entry();
            entry.originalRecord = JSON.stringify(item);
            entry.itemUrl = item['@id'];
            entry.type = EntryType.WASTEEXEMPTION;

            if (location && Object.keys(location).length > 1) {
                entry.point = {
                    type: 'Point',
                    coordinates: getCoordinates(location),
                };
            }
            entry.startDate = item.exemption[0]?.registrationDate;
            entry.siteAddress = item.site[0].siteAddress?.address;
            entry.summary = `${item.exemption[0]?.registrationType?.prefLabel}`;
            entry.description = `${item.exemption[0]?.registrationType?.description}
See Also: ${item.exemption[0]?.registrationType?.seeAlso}

Holder: ${item.holder?.name}`;

            return entry.save();
        })
    );
}