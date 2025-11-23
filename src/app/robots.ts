import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/api/', '/admin/', '/my-profile/'],
        },
        sitemap: 'https://ginekologija.palmoticeva.com/sitemap.xml',
    };
}
