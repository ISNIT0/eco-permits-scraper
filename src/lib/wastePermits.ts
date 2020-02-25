import axios from 'axios';
import { Entry } from 'src/models/Entry.model';
import { EntryType } from '.';
import { proj4 } from '../util/proj4';
import { getCoordinates } from 'src/util/getCoordinates';

export async function populateWastePermits() {
    const { data: { items } } = await axios.get(`https://environment.data.gov.uk/public-register/waste-operations/registration.json?_limit=999999999`);

    console.info(`Saving [${items.length}] items`);

    await Promise.all(
        items.filter((a: any) => a).map(async (item: any) => {
            try {
                const location = item.site?.location;

                const entry = new Entry();
                entry.originalRecord = JSON.stringify(item);
                entry.itemUrl = item['@id'];
                entry.type = EntryType.WASTEPERMIT;


                if (location) {
                    entry.point = {
                        type: 'Point',
                        coordinates: getCoordinates(location),
                    };
                }
                entry.startDate = item.effectiveDate;
                entry.siteAddress = item.site?.siteAddress?.address;
                entry.summary = `${item.holder?.name} - ${item.register?.label}`;
                entry.description = `Company: ${item.holder?.name}
Description: ${item.register?.label}
Registration Number: ${item.registrationNumber}
Waste Management Licence Number: ${item.wasteManagementLicenceNumber}`;

                return await entry.save();
            } catch (err) {
                console.error(`Failed to insert record [${item['@id']}]`, err);
            }
        })
    );
}