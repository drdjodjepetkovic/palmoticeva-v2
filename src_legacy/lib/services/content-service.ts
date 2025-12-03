import { collection, doc, getDocs, query, writeBatch, where } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { defaultContent } from '@/lib/data/default-content';

const contentCache = new Map<string, any>();

/**
 * Chunks an array into smaller arrays of a specified size.
 */
function chunkArray<T>(arr: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < arr.length; i += size) {
        chunks.push(arr.slice(i, i + size));
    }
    return chunks;
}

/**
 * Checks if two content items are different, ignoring the version number.
 */
const isContentDifferent = (obj1: any, obj2: any): boolean => {
    if (!obj1 || !obj2) return true;
    const keys1 = Object.keys(obj1).filter(k => k !== 'version');
    const keys2 = Object.keys(obj2).filter(k => k !== 'version');
    if (keys1.length !== keys2.length) return true;
    for (const key of keys1) {
        if (obj1[key] !== obj2[key]) return true;
    }
    return false;
}

export const ContentService = {
    async getContent(ids: string[]): Promise<Record<string, any>> {
        if (!ids || ids.length === 0) return {};

        const fetchedContent: Record<string, any> = {};
        let idsToFetchFromDb: string[] = [];
        const idsFoundInCache = new Set<string>();

        // Check cache first
        ids.forEach(id => {
            if (contentCache.has(id)) {
                const data = contentCache.get(id);
                const defaultItem = defaultContent[id];
                // If content is different from default, it might need update, so fetch from DB/Seed logic
                // But if we just want to read, cache is usually fine unless we want strict sync.
                // The original logic was: if !isContentDifferent(data, defaultItem), use cache.
                // If they ARE different, it implies we might need to re-verify with DB or re-seed.
                // Let's stick to the original logic:
                if (!isContentDifferent(data, defaultItem)) {
                    fetchedContent[id] = data;
                    idsFoundInCache.add(id);
                }
            }
        });

        idsToFetchFromDb = ids.filter(id => !idsFoundInCache.has(id));

        if (idsToFetchFromDb.length > 0) {
            const contentRef = collection(db, 'content');
            const idChunks = chunkArray(idsToFetchFromDb, 29);
            const docsToUpdate = new Map();

            try {
                for (const chunk of idChunks) {
                    if (chunk.length === 0) continue;

                    const q = query(contentRef, where('__name__', 'in', chunk));
                    const querySnapshot = await getDocs(q);
                    const foundIdsInChunk = new Set<string>();

                    querySnapshot.forEach((doc) => {
                        const data = doc.data();
                        const docId = doc.id;
                        foundIdsInChunk.add(docId);
                        const defaultItem = defaultContent[docId];

                        // Force update if content is different
                        if (defaultItem && isContentDifferent(data, defaultItem)) {
                            docsToUpdate.set(docId, defaultItem);
                            contentCache.set(docId, defaultItem);
                            fetchedContent[docId] = defaultItem;
                        } else {
                            contentCache.set(docId, data);
                            fetchedContent[docId] = data;
                        }
                    });

                    // Seed missing IDs
                    const missingIds = chunk.filter(id => !foundIdsInChunk.has(id));
                    if (missingIds.length > 0) {
                        for (const id of missingIds) {
                            if (defaultContent[id]) {
                                docsToUpdate.set(id, defaultContent[id]);
                                contentCache.set(id, defaultContent[id]);
                                fetchedContent[id] = defaultContent[id];
                            }
                        }
                    }
                }

                // Perform batch update/set
                if (docsToUpdate.size > 0) {
                    console.log(`Updating ${docsToUpdate.size} content documents in Firestore...`);
                    const batch = writeBatch(db);
                    docsToUpdate.forEach((data, id) => {
                        const docRef = doc(db, 'content', id);
                        batch.set(docRef, data);
                    });
                    await batch.commit();
                }

            } catch (error) {
                console.error("Error fetching, seeding, or updating content: ", error);
                // On error, try to fall back to defaults for requested IDs that failed
                idsToFetchFromDb.forEach(id => {
                    if (!fetchedContent[id] && defaultContent[id]) {
                        fetchedContent[id] = defaultContent[id];
                    }
                });
            }
        }

        // Ensure all requested IDs have some value (from cache, DB, or default fallback)
        ids.forEach(id => {
            if (!fetchedContent[id]) {
                if (contentCache.has(id)) {
                    fetchedContent[id] = contentCache.get(id);
                } else if (defaultContent[id]) {
                    fetchedContent[id] = defaultContent[id];
                }
            }
        });

        return fetchedContent;
    }
};
