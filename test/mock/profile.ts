import * as faker from 'faker';
import { Profile } from 'src/models/Profile.model';

interface ProfileOverrides {
    phoneNumber?: string;
    name?: string;
    email?: string;
}

export async function createProfile(overrides: ProfileOverrides) {
    const profile = new Profile();
    profile.phoneNumber = overrides.phoneNumber ?? faker.phone.phoneNumber(`+447 ### ######`);
    profile.email = overrides.email ?? faker.internet.email();
    profile.name = overrides.name ?? faker.name.findName();
    return await profile.save();
}