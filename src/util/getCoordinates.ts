import { proj4 } from './proj4';
import GRCodes from './gridReferenceCodes';

export function getCoordinates(location: any) {
    if (!location) {
        throw new Error(`No location provided`);
    }
    if (location.easting && location.northing) {
        return proj4('EPSG:27700', 'EPSG:4326', [location.easting, location.northing]);
    } else if (location.gridReference) {
        const gridReference = (location.gridReference as string).replace(/[^A-z0-9]/g, '');
        const grCode = gridReference.slice(0, 2).toLocaleUpperCase();
        const grVals = (GRCodes as any)[grCode] as number[];

        const eastingNorthing = gridReference.slice(2);
        const partLength = Math.floor(eastingNorthing.length / 2);
        const easting = eastingNorthing.slice(0, partLength);
        const northing = eastingNorthing.slice(partLength, partLength * 2);

        const fullEasting = grVals[0].toString() + easting;
        const fullNorthing = grVals[1].toString() + northing;

        return proj4('EPSG:27700', 'EPSG:4326', [Number(fullEasting), Number(fullNorthing)]);
    } else {
        throw new Error(`No recognised location data on object: \n\n${JSON.stringify(location, null, '\t')}`);
    }
}
