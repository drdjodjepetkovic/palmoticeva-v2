import { NextRequest, NextResponse } from 'next/server';

// Live-fetch article HTML from palmoticeva.com.
// Extracts <main id="main-content"> content, strips H1 (rendered by ArticleHero)
// and "Povezane usluge" (related services) section. Rewrites relative URLs.
//
// Cache: 1h revalidate. Called from articles/[slug]/page.tsx.

const BASE_URL = 'https://www.palmoticeva.com';

function buildLiveUrl(slug: string, locale: string): string {
  if (locale === 'en') return `${BASE_URL}/en/${slug}`;
  if (locale === 'ru') return `${BASE_URL}/ru/${slug}`;
  return `${BASE_URL}/${slug}`;
}

function extractMainContent(html: string): string | null {
  // Match <main ...>...</main> (non-greedy, handles attrs)
  const mainMatch = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i);
  return mainMatch ? mainMatch[1] : null;
}

function stripFirstH1(html: string): string {
  return html.replace(/<h1\b[^>]*>[\s\S]*?<\/h1>/i, '');
}

function stripRelatedServices(html: string): string {
  // Cut everything from a "Povezane usluge" / "Related services" / similar heading onwards.
  // palmoticeva.com uses headings like <h2>Povezane usluge</h2> or similar.
  const markers = [
    /<h2\b[^>]*>\s*Povezane usluge[\s\S]*/i,
    /<h2\b[^>]*>\s*Related services[\s\S]*/i,
    /<h2\b[^>]*>\s*Связанные услуги[\s\S]*/i,
    /<section\b[^>]*class="[^"]*service-thumbs[^"]*"[\s\S]*/i,
  ];
  let result = html;
  for (const re of markers) {
    result = result.replace(re, '');
  }
  return result;
}

function rewriteUrls(html: string): string {
  // Rewrite src="/foo" and href="/foo" to absolute palmoticeva.com URLs.
  // Leaves fully qualified URLs (http://, https://, //, data:, #) untouched.
  return html
    .replace(/\b(src|href)=(['"])\/(?!\/)/g, `$1=$2${BASE_URL}/`);
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug');
  const locale = searchParams.get('locale') || 'se-lat';

  if (!slug) {
    return NextResponse.json({ error: 'Missing slug' }, { status: 400 });
  }

  const url = buildLiveUrl(slug, locale);

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; PalmoticevaPortal/1.0)',
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Upstream ${res.status}`, url },
        { status: res.status },
      );
    }

    const html = await res.text();
    const main = extractMainContent(html);
    if (!main) {
      return NextResponse.json(
        { error: 'No <main> content found', url },
        { status: 502 },
      );
    }

    let content = stripFirstH1(main);
    content = stripRelatedServices(content);
    content = rewriteUrls(content);

    return NextResponse.json({ html: content, source: url });
  } catch (err) {
    return NextResponse.json(
      { error: String(err), url },
      { status: 500 },
    );
  }
}

export const revalidate = 3600;
