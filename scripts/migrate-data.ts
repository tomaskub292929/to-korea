/**
 * Data Migration Script
 * Migrates mock school data from schools.ts to Firestore
 * 
 * Run with: npx tsx scripts/migrate-data.ts
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';
import { mockSchools } from '../src/data/schools';

// Firebase configuration
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function migrateData() {
    console.log('🚀 Starting data migration...');
    console.log(`📊 Total schools to migrate: ${mockSchools.length}`);
    console.log('');

    let successCount = 0;
    let errorCount = 0;

    for (const school of mockSchools) {
        try {
            // Remove the id field as Firestore will generate it
            const { id, ...schoolData } = school;

            // Add timestamps
            const dataWithTimestamps = {
                ...schoolData,
                createdAt: Timestamp.now(),
                updatedAt: Timestamp.now(),
            };

            // Add to Firestore
            const docRef = await addDoc(collection(db, 'schools'), dataWithTimestamps);

            successCount++;
            console.log(`✅ Migrated: ${school.name} (ID: ${docRef.id})`);
        } catch (error) {
            errorCount++;
            console.error(`❌ Failed to migrate: ${school.name}`, error);
        }
    }

    console.log('');
    console.log('📈 Migration Summary:');
    console.log(`   ✅ Success: ${successCount}`);
    console.log(`   ❌ Errors: ${errorCount}`);
    console.log(`   📊 Total: ${mockSchools.length}`);
    console.log('');
    console.log('🎉 Migration complete!');

    process.exit(0);
}

// Run migration
migrateData().catch((error) => {
    console.error('💥 Migration failed:', error);
    process.exit(1);
});
