"use client";

import { useState, useEffect } from 'react';
import { collection, doc, getDoc, getDocs, query, setDoc, writeBatch, where } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import type { ContentMap } from '@/types/content';
import { useLanguage } from '@/context/language-context';
import { defaultContent } from '@/lib/data/default-content';

const contentCache = new Map<string, any>();

/**
 * Chunks an array into smaller arrays of a specified size.
 * @param arr The array to chunk.
 * @param size The size of each chunk.
 * @returns An array of chunks.
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
 * @param obj1 First object to compare.
 * @param obj2 Second object to compare.
 * @returns True if objects are different, false otherwise.
 */
const isContentDifferent = (obj1: any, obj2: any): boolean => {
    if (!obj1 || !obj2) return true; // If one doesn't exist, they are different
    const keys1 = Object.keys(obj1).filter(k => k !== 'version');
    const keys2 = Object.keys(obj2).filter(k => k !== 'version');
    if (keys1.length !== keys2.length) return true;
    for (const key of keys1) {
        if (obj1[key] !== obj2[key]) return true;
    }
    return false;
}


/**
 * Fetches localized content from Firestore. If content is not found,
 * it seeds it from the local default-content.ts file.
 * Handles Firestore's 30-item limit for 'in' queries by chunking requests.
 */
export const useContent = (ids: string[]) => {
  const { language } = useLanguage();
  const [content, setContent] = useState<ContentMap>({});
  const [loading, setLoading] = useState(true);

  const t = (id: string): string => {
    return content[id] || ``;
  };

  useEffect(() => {
    const fetchContent = async () => {
      if (!ids || ids.length === 0) {
        setLoading(false);
        return;
      }
      setLoading(true);

      const fetchedContent: ContentMap = {};
      let idsToFetchFromDb: string[] = [];
      const idsFoundInCache = new Set<string>();

      // Check cache first
      ids.forEach(id => {
        if (contentCache.has(id)) {
          const data = contentCache.get(id);
          const defaultItem = defaultContent[id];
          // If content is different, it needs to be updated, so we don't consider it "found in cache" for DB logic
          if (!isContentDifferent(data, defaultItem)) {
             fetchedContent[id] = data[language] || data['se-lat'];
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

              // Force update if content is different, regardless of version
              if (defaultItem && isContentDifferent(data, defaultItem)) {
                docsToUpdate.set(docId, defaultItem);
                contentCache.set(docId, defaultItem);
                fetchedContent[docId] = defaultItem[language] || defaultItem['se-lat'];
              } else {
                // DB version is up-to-date and content matches
                contentCache.set(docId, data);
                fetchedContent[docId] = data[language] || data['se-lat'];
              }
            });

            // Seed missing IDs
            const missingIds = chunk.filter(id => !foundIdsInChunk.has(id));
            if (missingIds.length > 0) {
                for (const id of missingIds) {
                    if (defaultContent[id]) {
                        docsToUpdate.set(id, defaultContent[id]);
                        contentCache.set(id, defaultContent[id]);
                        fetchedContent[id] = defaultContent[id][language] || defaultContent[id]['se-lat'];
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
        }
      }

      // Final fallback for safety
      ids.forEach(id => {
        if (!fetchedContent[id]) {
          const defaultText = defaultContent[id]?.[language] || defaultContent[id]?.['se-lat'];
          fetchedContent[id] = defaultText || `[${id}]`;
        }
      });

      setContent(fetchedContent);
      setLoading(false);
    };

    const uniqueIds = Array.from(new Set(ids));
    fetchContent();
  }, [JSON.stringify(ids), language]);

  return { content, loading, t };
};
