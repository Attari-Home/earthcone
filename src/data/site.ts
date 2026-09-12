// Single source of truth for business data referenced across the site
// (nav, footer, JSON-LD, contact page). Replace remaining TODO values with
// confirmed details before launch — do not duplicate these elsewhere.

export interface Contact {
    label: string;
    /** Machine-usable form: E.164 for tel:, digits-only (no +) for wa.me links, raw address for email. */
    value: string;
    /** Human-formatted string for on-page display. Falls back to `value` if omitted. */
    display?: string;
    primary: boolean;
}

export const site = {
    name: 'Earth Cone Building Contracting L.L.C.',
    shortName: 'Earth Cone',
    tagline: 'Construction & maintenance contracting across the UAE',
    description:
        'Earth Cone is a Dubai-headquartered building construction and maintenance contractor, licensed to operate across all seven Emirates.',

    contacts: {
        phones: [
            {
                label: 'Muhammad Irfan',
                value: '+971547720586',
                display: '+971 54 772 0586',
                primary: true,
            },
        ] as Contact[],
        whatsapp: [
            {
                label: 'Muhammad Irfan',
                value: '971547720586',
                display: '+971 54 772 0586',
                primary: true,
            },
        ] as Contact[],
        emails: [
            {
                label: 'General enquiries',
                value: 'earthcone786@gmail.com',
                primary: true,
            },
        ] as Contact[],
    },

    address: {
        street: 'Office No. 206, Al Bahar Building',
        area: 'Deira',
        city: 'Dubai',
        country: 'United Arab Emirates',
    },

    // TODO: confirm real license number with client — business card shows a
    // partial, illegible "NP.05.0700..."-style number. Do not guess it.
    license: {
        authority: 'TODO — confirm with client',
        number: 'TODO — confirm with client',
    },

    emirates: [
        'Dubai',
        'Abu Dhabi',
        'Sharjah',
        'Ajman',
        'Ras Al Khaimah',
        'Fujairah',
        'Umm Al Quwain',
    ],

    socials: {
        instagram: '',
        facebook: '',
        linkedin: '',
    },
} as const;

function primaryOf(contacts: readonly Contact[]): Contact {
    const found = contacts.find((c) => c.primary);
    if (!found) {
        throw new Error('Expected exactly one primary contact in this list.');
    }
    return found;
}

export const primaryPhone = primaryOf(site.contacts.phones);
export const primaryWhatsapp = primaryOf(site.contacts.whatsapp);
export const primaryEmail = primaryOf(site.contacts.emails);
