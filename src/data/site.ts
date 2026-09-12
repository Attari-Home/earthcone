// Single source of truth for business data referenced across the site
// (nav, footer, JSON-LD, contact page). Replace the TODO values with
// confirmed details before launch — do not duplicate these elsewhere.

export const site = {
    name: 'Earth Cone Building Contracting',
    shortName: 'Earth Cone',
    tagline: 'Construction & maintenance contracting across the UAE',
    description:
        'Earth Cone is a Dubai-headquartered building construction and maintenance contractor, licensed to operate across all seven Emirates.',

    // TODO: confirm and replace before launch.
    phone: '+971-XX-XXX-XXXX',
    whatsapp: '+971XXXXXXXXX',
    email: 'info@earthcone.ae',
    address: {
        street: 'TODO',
        city: 'Dubai',
        country: 'United Arab Emirates',
    },
    license: {
        authority: 'TODO',
        number: 'TODO',
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
