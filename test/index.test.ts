import test from 'blue-tape';
import { getCoordinates } from 'src/util/getCoordinates';

test('sanity', async (t) => {
    t.ok(true);
});

test('getCoordinates', async (t) => {
    const grLocation = {
        "@id": "http://environment.data.gov.uk/public-register/waste-exemptions/site/21adab4d63c36987c7bfe9aff83792d0/location/0",
        "gridReference": "TQ3573473399"
    };

    const neLocation = {
        "@id": "http://environment.data.gov.uk/public-register/water-discharge-exemptions/registration/AN-PRNNF18843-001/site/0/location/0",
        "easting": 541210,
        "gridReference": "TF4121007770",
        "northing": 307770
    };

    t.deepEquals(
        getCoordinates(grLocation),
        [-0.04832252693857877, 51.44332566762102],
        'Grid Reference passes'
    );

    t.deepEquals(
        getCoordinates(neLocation),
        [0.08589621879580497, 52.649287574819226],
        'Easting northing passes'
    );


});
