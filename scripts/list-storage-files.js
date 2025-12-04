
const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getStorage } = require('firebase-admin/storage');
const fs = require('fs');
const path = require('path');

// Initialize Firebase Admin
if (getApps().length === 0) {
    const serviceAccountPath = path.resolve('./service-account-key.json');
    if (fs.existsSync(serviceAccountPath)) {
        const serviceAccount = require(serviceAccountPath);
        initializeApp({
            credential: cert(serviceAccount),
            storageBucket: 'palmoticeva-portal.firebasestorage.app'
        });
    } else {
        initializeApp({
            storageBucket: 'palmoticeva-portal.firebasestorage.app'
        });
    }
}

async function listFiles() {
    try {
        const bucket = getStorage().bucket();
        const [files] = await bucket.getFiles();

        console.log(`Found ${files.length} files in bucket ${bucket.name}:`);

        for (const file of files) {
            // Get metadata to find the token
            const [metadata] = await file.getMetadata();

            let publicUrl = '';
            if (metadata.metadata && metadata.metadata.firebaseStorageDownloadTokens) {
                const token = metadata.metadata.firebaseStorageDownloadTokens.split(',')[0];
                publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(file.name)}?alt=media&token=${token}`;
            } else {
                // Fallback to signed URL if no token exists
                // Note: This URL expires.
                const [url] = await file.getSignedUrl({
                    action: 'read',
                    expires: '03-09-2491'
                });
                publicUrl = url;
            }

            console.log(`- ${file.name}`);
            console.log(`  URL: ${publicUrl}`);
            console.log('---');
        }
    } catch (error) {
        console.error('Error listing files:', error);
    }
}

listFiles();
