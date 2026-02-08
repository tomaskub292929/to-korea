
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';

// 1. Firebase Configuration (Hardcoded for single-use reliability)
// Sourced from .env.local
const firebaseConfig = {
    apiKey: "AIzaSyBVlPrMaNkWP3kSOIea18eLxbYaeYbzXd8",
    authDomain: "gateway-korea-2026.firebaseapp.com",
    projectId: "gateway-korea-2026",
    storageBucket: "gateway-korea-2026.firebasestorage.app",
    messagingSenderId: "46584294470",
    appId: "1:46584294470:web:13e465564980904bb6ee47"
};

// 2. Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const COLLECTION_NAME = 'schools';

// 3. Mock Data
const mockSchools = [
    {
        id: '1',
        name: 'Seoul National University',
        country: 'South Korea',
        city: 'Seoul',
        description: 'Korea\'s premier university offering world-class education and research opportunities.',
        logoUrl: '/images/schools/snu-logo.png',
        headerImageUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800',
        websiteUrl: 'https://www.snu.ac.kr',
        rating: 4.9,
        studentCount: 28000,
        programs: ['Medicine', 'Engineering', 'Business', 'Computer Science', 'Law'],
        jobOpportunityLevel: 'high',
        region: 'western-europe',
        oneLineFeedback: '"Excellent research facilities and international community"',
    },
    {
        id: '2',
        name: 'Korea University',
        country: 'South Korea',
        city: 'Seoul',
        description: 'One of the oldest and most prestigious universities in Korea with strong industry connections.',
        logoUrl: '/images/schools/ku-logo.png',
        headerImageUrl: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800',
        websiteUrl: 'https://www.korea.ac.kr',
        rating: 4.8,
        studentCount: 24000,
        programs: ['Business', 'Nursing', 'Engineering', 'International Studies'],
        jobOpportunityLevel: 'high',
        region: 'northern-europe',
        oneLineFeedback: '"Great career support and networking opportunities"',
    },
    {
        id: '3',
        name: 'Yonsei University',
        country: 'South Korea',
        city: 'Seoul',
        description: 'Leading research university known for its medical school and global partnerships.',
        logoUrl: '/images/schools/yonsei-logo.png',
        headerImageUrl: 'https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=800',
        websiteUrl: 'https://www.yonsei.ac.kr',
        rating: 4.8,
        studentCount: 26000,
        programs: ['Medicine', 'Nursing', 'Dentistry', 'Engineering', 'Business'],
        jobOpportunityLevel: 'high',
        region: 'eastern-europe',
        oneLineFeedback: '"World-class medical education with modern facilities"',
    },
    {
        id: '4',
        name: 'KAIST',
        country: 'South Korea',
        city: 'Daejeon',
        description: 'Korea\'s leading science and technology university, often called the MIT of Korea.',
        logoUrl: '/images/schools/kaist-logo.png',
        headerImageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800',
        websiteUrl: 'https://www.kaist.ac.kr',
        rating: 4.9,
        studentCount: 10000,
        programs: ['Computer Science', 'AI', 'Robotics', 'Electrical Engineering', 'Bioengineering'],
        jobOpportunityLevel: 'high',
        region: 'russia',
        oneLineFeedback: '"Perfect for tech enthusiasts and researchers"',
    },
    {
        id: '5',
        name: 'POSTECH',
        country: 'South Korea',
        city: 'Pohang',
        description: 'Private research university specializing in science and technology education.',
        logoUrl: '/images/schools/postech-logo.png',
        headerImageUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800',
        websiteUrl: 'https://www.postech.ac.kr',
        rating: 4.7,
        studentCount: 3500,
        programs: ['Physics', 'Chemistry', 'Materials Science', 'IT Convergence'],
        jobOpportunityLevel: 'high',
        region: 'central-asia',
        oneLineFeedback: '"Small but excellent research-focused institution"',
    },
    {
        id: '6',
        name: 'Sungkyunkwan University',
        country: 'South Korea',
        city: 'Seoul',
        description: 'One of the oldest universities in Korea with strong Samsung partnership.',
        logoUrl: '/images/schools/skku-logo.png',
        headerImageUrl: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=800',
        websiteUrl: 'https://www.skku.edu',
        rating: 4.6,
        studentCount: 23000,
        programs: ['Business', 'Law', 'Engineering', 'Pharmacy', 'Medicine'],
        jobOpportunityLevel: 'high',
        region: 'western-europe',
        oneLineFeedback: '"Strong corporate connections, especially with Samsung"',
    },
    {
        id: '7',
        name: 'Hanyang University',
        country: 'South Korea',
        city: 'Seoul',
        description: 'Known for engineering excellence and entrepreneurship programs.',
        logoUrl: '/images/schools/hanyang-logo.png',
        headerImageUrl: 'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?w=800',
        websiteUrl: 'https://www.hanyang.ac.kr',
        rating: 4.5,
        studentCount: 22000,
        programs: ['Engineering', 'Architecture', 'Business', 'Medicine'],
        jobOpportunityLevel: 'medium',
        region: 'northern-europe',
        oneLineFeedback: '"Great for aspiring engineers and entrepreneurs"',
    },
    {
        id: '8',
        name: 'Ewha Womans University',
        country: 'South Korea',
        city: 'Seoul',
        description: 'One of the world\'s largest female educational institutions.',
        logoUrl: '/images/schools/ewha-logo.png',
        headerImageUrl: 'https://images.unsplash.com/photo-1568792923760-d70635a89fdc?w=800',
        websiteUrl: 'https://www.ewha.ac.kr',
        rating: 4.6,
        studentCount: 20000,
        programs: ['International Studies', 'Business', 'Communication', 'Art'],
        jobOpportunityLevel: 'medium',
        region: 'eastern-europe',
        oneLineFeedback: '"Beautiful campus with supportive community"',
    },
    {
        id: '9',
        name: 'Sogang University',
        country: 'South Korea',
        city: 'Seoul',
        description: 'Jesuit university known for humanities and business programs.',
        logoUrl: '/images/schools/sogang-logo.png',
        headerImageUrl: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=800',
        websiteUrl: 'https://www.sogang.ac.kr',
        rating: 4.5,
        studentCount: 14000,
        programs: ['Business', 'Economics', 'Computer Science', 'Philosophy'],
        jobOpportunityLevel: 'medium',
        region: 'russia',
        oneLineFeedback: '"Excellent Korean language programs for international students"',
    },
    {
        id: '10',
        name: 'Kyung Hee University',
        country: 'South Korea',
        city: 'Seoul',
        description: 'Known for medicine, hospitality, and Korean studies programs.',
        logoUrl: '/images/schools/khu-logo.png',
        headerImageUrl: 'https://images.unsplash.com/photo-1580537659466-0a9bfa916a54?w=800',
        websiteUrl: 'https://www.khu.ac.kr',
        rating: 4.4,
        studentCount: 25000,
        programs: ['Medicine', 'Hospitality', 'Korean Studies', 'Physical Therapy'],
        jobOpportunityLevel: 'medium',
        region: 'central-asia',
        oneLineFeedback: '"Beautiful campus and strong hospitality program"',
    },
    {
        id: '11',
        name: 'Chung-Ang University',
        country: 'South Korea',
        city: 'Seoul',
        description: 'Leading university for arts, media, and performance studies.',
        logoUrl: '/images/schools/cau-logo.png',
        headerImageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800',
        websiteUrl: 'https://www.cau.ac.kr',
        rating: 4.3,
        studentCount: 28000,
        programs: ['Film Studies', 'Theater', 'Business', 'Pharmacy'],
        jobOpportunityLevel: 'medium',
        region: 'western-europe',
        oneLineFeedback: '"Best choice for creative and performing arts"',
    },
    {
        id: '12',
        name: 'Inha University',
        country: 'South Korea',
        city: 'Incheon',
        description: 'Strong engineering and logistics programs near Incheon Airport.',
        logoUrl: '/images/schools/inha-logo.png',
        headerImageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800',
        websiteUrl: 'https://www.inha.ac.kr',
        rating: 4.2,
        studentCount: 18000,
        programs: ['Aerospace Engineering', 'Logistics', 'Business', 'IT'],
        jobOpportunityLevel: 'low',
        region: 'northern-europe',
        oneLineFeedback: '"Great for aviation and logistics careers"',
    },
];

// 4. Migrate Function
async function migrateData() {
    console.log('Starting data migration...');

    for (const school of mockSchools) {
        const { id, ...schoolData } = school;
        try {
            await addDoc(collection(db, COLLECTION_NAME), {
                ...schoolData,
                createdAt: Timestamp.now(),
                updatedAt: Timestamp.now(),
            });
            console.log(`Migrated: ${school.name}`);
        } catch (e) {
            console.error(`Failed to migrate ${school.name}:`, e);
        }
    }

    console.log('Migration complete!');
    process.exit(0);
}

migrateData();
