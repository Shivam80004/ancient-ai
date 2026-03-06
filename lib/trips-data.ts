// Shared data for Retreats / Trips

export interface TripData {
    slug: string;
    title: string;
    label: string;
    image: string; // Used for main hero and card
    description: string;
    longDescription?: string;
    highlights: string[];
    duration: string;
    groupSize: string;
    price?: string;
    dates?: string;
    galleryImages?: string[];
    itinerary?: { day: string; title: string; description: string }[];
}

export const TRIPS_DATA: Record<string, TripData> = {
    'vrindavan-yatra': {
        slug: 'vrindavan-yatra',
        title: 'Vrindavan Yatra',
        label: 'Experience 001',
        image: '/images/trips/vrindavan/6.png',
        description: 'Walk through the sacred land where Lord Krishna performed His divine pastimes. Guided by seasoned practitioners who know the land intimately, you will hear ancient pastimes narrated at the very locations they took place. This yatra takes you through the twelve forests of Vrindavan, offering a perfect balance of guided exploration, philosophy, and personal contemplative time.',
        highlights: [
            'Visit the seven major temples established by the Six Goswamis',
            'Barefoot Parikrama (circumambulation) of Govardhan Hill',
            'Ecstatic early morning mangal aarti at Banke Bihari & Radha Raman',
            'Serene boat ride and Yamuna Aarti at dusk',
            'Guided Japa meditation sessions at Ter Kadamba and other sacred groves',
        ],
        duration: '7 Days / 6 Nights',
        groupSize: '15-25 participants',
        price: '₹24,500',
        dates: 'Next batch: Nov 15th - Nov 21st, 2026',
        galleryImages: [
            '/images/trips/vrindavan/2.png',
            '/images/trips/vrindavan/3.png',
            '/images/trips/vrindavan/4.png',
            '/images/trips/vrindavan/5.png',
            // '/images/trips/vrindavan/6.png',
            '/images/trips/vrindavan/7.png',
            '/images/trips/vrindavan/8.png',
        ],
        itinerary: [
            { day: 'Day 1', title: 'Arrival & Welcoming the Dham', description: 'Arrive in Vrindavan, settle into the ashram. Evening orientation and introductory kirtan by the Yamuna.' },
            { day: 'Day 2', title: 'The Heart of Vrindavan', description: 'Mangal Aarti at ISKCON Krishna Balaram Mandir, followed by visits to Radha Raman, Radha Damodar, and Seva Kunja.' },
            { day: 'Day 3', title: 'Govardhan Parikrama', description: 'Begin the 21km barefoot walk around the sacred Govardhan Hill, hearing pastimes at Radha Kund and Shyama Kund.' },
        ]
    },
    'mayapur-retreat': {
        slug: 'mayapur-retreat',
        title: 'Mayapur Retreat',
        label: 'Experience 002',
        image: '/images/trips/vrindavan/2.png',
        description: 'Join us for an immersive retreat in the spiritual capital of the world. Set amidst the lush green fields of Bengal and the flowing waters of the Ganges, this retreat offers a profound immersion into the Gaudiya Vaishnava tradition.',
        highlights: [
            'Exclusive guided tour inside the new Temple of Vedic Planetarium',
            'Participation in world-famous Mayapur ecstatic kirtans',
            'Visit to Yogapitha — the exact birthplace of Lord Chaitanya',
            'Navadvipa Dham Parikrama by boat across the Ganges',
            'Authentic Bengali Vaishnava prasadam (cooking class included)',
        ],
        duration: '5 Days / 4 Nights',
        groupSize: '20-30 participants',
        price: '₹18,000',
        dates: 'Next batch: Feb 10th - Feb 14th, 2026',
        galleryImages: [
            '/images/trips/vrindavan/3.png',
            '/images/trips/vrindavan/4.png',
            '/images/trips/vrindavan/5.png',
            '/images/trips/vrindavan/6.png'
        ],
        itinerary: [
            { day: 'Day 1', title: 'Arrival in the Holy City', description: 'Check-in to the Mayapur guest house. Evening darshan and introductory philosophy session.' },
            { day: 'Day 2', title: 'The TOVP & Kirtan', description: 'Morning program, comprehensive tour of the TOVP construction, and afternoon kirtan immersion.' },
            { day: 'Day 3', title: 'Navadvipa Island Boat Tour', description: 'Cross the Ganges by boat to visit ancient islands, hearing the histories of each unique temple.' },
        ]
    },
    'himalayan-trek': {
        slug: 'himalayan-trek',
        title: 'Himalayan Trek',
        label: 'Experience 003',
        image: '/images/trips/vrindavan/4.png',
        description: 'Combine meditation and trekking through the pristine Himalayan trails. From Rishikesh to Badrinath, this journey blends physical adventure with deep spiritual practice in the abode of the Devas.',
        highlights: [
            'Trek through the breathtaking Hemkund Sahib trail',
            'Silent meditation at sunrise in the Valley of Flowers',
            'Darshan at the ancient Badrinath Temple and holy hot springs',
            'Experience the powerful evening Ganga Aarti in Rishikesh',
            'Daily Yoga and Pranayama sessions with experienced practitioners',
        ],
        duration: '10 Days / 9 Nights',
        groupSize: '10-15 participants',
        price: '₹35,000',
        dates: 'Next batch: June 5th - June 14th, 2026',
        galleryImages: [
            '/images/trips/vrindavan/5.png',
            '/images/trips/vrindavan/6.png',
            '/images/trips/vrindavan/7.png',
            '/images/trips/vrindavan/1.png'
        ],
    },
    'govardhan-parikrama': {
        slug: 'govardhan-parikrama',
        title: 'Govardhan Parikrama',
        label: 'Experience 004',
        image: '/images/trips/vrindavan/6.png',
        description: 'Circumambulate the sacred Govardhan Hill. This parikrama is a deeply meditative experience, walking barefoot on the ancient path while hearing the pastimes associated with every kunda and temple along the way.',
        highlights: [
            'Complete the full 21km traditional barefoot parikrama',
            'Extended visit and midnight meditation at Radha Kunda and Shyama Kunda',
            'Special Darshan at Daan Ghati Temple',
            'Immersive storytelling by experienced guides at various stops',
            'Delicious, traditional Vraja prasadam served at historic temples',
        ],
        duration: '3 Days / 2 Nights',
        groupSize: '20-40 participants',
        price: '₹12,000',
        dates: 'Next batch: Oct 20th - Oct 22nd, 2026',
        galleryImages: [
            '/images/trips/vrindavan/7.png',
            '/images/trips/vrindavan/8.png',
            '/images/trips/vrindavan/3.png',
            '/images/trips/vrindavan/2.png'
        ],
    },
    'sacred-ganga-aarti': {
        slug: 'sacred-ganga-aarti',
        title: 'Sacred Ganga Aarti',
        label: 'Experience 005',
        image: '/images/trips/vrindavan/8.png',
        description: 'Witness the magnificent Ganga Aarti ceremony at the ghats of Varanasi. This experience takes you through the ancient city of Kashi, exploring its timeless temples and the deeply spiritual culture that revolves around Mother Ganga.',
        highlights: [
            'VIP seating for the Evening Ganga Aarti at Dashashwamedh Ghat',
            'Silent sunrise boat ride along the Ganges ghats',
            'VIP Darshan at the Kashi Vishwanath Jyotirlinga Temple',
            'Guided walking tour of the ancient ghats and their profound history',
            'Exclusive demonstration by master Banarasi silk weavers',
        ],
        duration: '4 Days / 3 Nights',
        groupSize: '15-25 participants',
        price: '₹14,500',
        dates: 'Next batch: Dec 1st - Dec 4th, 2026',
        galleryImages: [
            '/images/trips/vrindavan/1.png',
            '/images/trips/vrindavan/4.png',
            '/images/trips/vrindavan/7.png',
            '/images/trips/vrindavan/5.png'
        ],
    },
};
