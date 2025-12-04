
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';
import * as fs from 'fs';
import * as path from 'path';

// Initialize Firebase Admin
// Note: This requires GOOGLE_APPLICATION_CREDENTIALS or a service account key file.
// Since we are in a dev environment, we might rely on default credentials or a local key if available.
// If not, this script might fail without a key.
// However, the user asked if I have access. I will try to use the default app if already initialized or init with default creds.

if (getApps().length === 0) {
    // Try to find a service account key in the root or config
    const serviceAccountPath = path.resolve('./service-account-key.json');
    if (fs.existsSync(serviceAccountPath)) {
        const serviceAccount = require(serviceAccountPath);
        initializeApp({
            credential: cert(serviceAccount),
            storageBucket: 'palmoticeva-portal.firebasestorage.app' // Hardcoded based on apphosting.yaml
        });
    } else {
        // Fallback to application default credentials (ADC)
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
            // Get a signed URL for the file to make it accessible
            // Note: Signed URLs have an expiration. For permanent public access, we'd need to make the file public.
            // But the user asked for "url ima token posle", which sounds like a download token or signed URL.

            // We can also construct the public download URL if the object has a metadata token.
            // Let's try to get metadata first.
            const [metadataResponse] = await file.getMetadata();
            const metadata = metadataResponse as any;

            let publicUrl = '';
            if (metadata.metadata && metadata.metadata.firebaseStorageDownloadTokens) {
                const token = metadata.metadata.firebaseStorageDownloadTokens.split(',')[0];
                publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(file.name)}?alt=media&token=${token}`;
            } else {
                // Fallback to signed URL if no token exists
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
