
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const supportedLangs = ['en', 'se', 'ru', 'se-lat'];
const defaultLang = 'se-lat';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Prevent middleware from running on API routes or static files
  if (pathname.startsWith('/api/') || pathname.startsWith('/_next/')) {
    return NextResponse.next();
  }

  // Check if the pathname already has a supported language prefix
  const pathnameHasLang = supportedLangs.some(
    (lang) => pathname.startsWith(`/${lang}/`) || pathname === `/${lang}`
  );

  if (pathnameHasLang) {
    return NextResponse.next();
  }

  // Redirect to the default language version
  request.nextUrl.pathname = `/${defaultLang}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  // Matcher to run the middleware on all paths except for specific assets
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
  ],
};
