import { MetadataRoute } from 'next';
import { defaultArticlesData } from '@/lib/data/content/articles';

const URL = 'https://ginekologija.palmoticeva.com';
const languages = ['en', 'se', 'ru', 'sr'];
const pages = ['', '/about', '/pricelist', '/faq', '/promotions', '/appointments', '/articles'];

export default function sitemap(): MetadataRoute.Sitemap {
  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Add static pages for each language
  languages.forEach(lang => {
    pages.forEach(page => {
      sitemapEntries.push({
        url: `${URL}/${lang}${page}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: page === '' ? 1 : 0.8,
      });
    });
  });

  // Add article pages for each language
  languages.forEach(lang => {
    defaultArticlesData.articles.forEach(article => {
      sitemapEntries.push({
        url: `${URL}/${lang}/articles/${article.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      });
    });
  });


  return sitemapEntries;
}

    
