import { MetadataRoute } from 'next'
import { articlesData } from '@/features/content/data/articles'

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://ginekologija.palmoticeva.com'
    const languages = ['sr', 'en', 'ru']
    const staticPages = ['', '/about', '/services', '/prices', '/contact', '/appointments']

    const sitemapEntries: MetadataRoute.Sitemap = []

    // Add static pages
    languages.forEach(lang => {
        staticPages.forEach(page => {
            sitemapEntries.push({
                url: `${baseUrl}/${lang}${page}`,
                lastModified: new Date(),
                changeFrequency: page === '' ? 'weekly' : 'monthly',
                priority: page === '' ? 1 : 0.8,
            })
        })
    })

    // Add article pages
    languages.forEach(lang => {
        articlesData.forEach(article => {
            sitemapEntries.push({
                url: `${baseUrl}/${lang}/articles/${article.slug}`,
                lastModified: new Date(), // Ideally this would come from the article data
                changeFrequency: 'monthly',
                priority: 0.7,
            })
        })
    })

    return sitemapEntries
}
