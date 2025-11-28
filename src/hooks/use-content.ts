"use client";

import { useState, useEffect } from 'react';
import type { ContentMap } from '@/types/content';
import { useLanguage } from '@/context/language-context';
import { ContentService } from '@/lib/services/content-service';

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

      try {
        const rawContent = await ContentService.getContent(ids);
        const localizedContent: ContentMap = {};

        ids.forEach(id => {
          const item = rawContent[id];
          if (item) {
            localizedContent[id] = item[language] || item['sr'] || `[${id}]`;
          } else {
            localizedContent[id] = `[${id}]`;
          }
        });

        setContent(localizedContent);
      } catch (error) {
        console.error("Error in useContent:", error);
      } finally {
        setLoading(false);
      }
    };

    // Create a stable key for dependencies
    const idsKey = ids.sort().join(',');
    fetchContent();
  }, [ids.sort().join(','), language]);

  return { content, loading, t };
};
