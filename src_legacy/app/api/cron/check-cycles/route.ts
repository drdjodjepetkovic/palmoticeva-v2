
import { NextResponse, type NextRequest } from 'next/server';
import { checkLateCyclesAndNotify } from '@/lib/actions/cron-actions';

export async function GET(request: NextRequest) {
  // IMPORTANT: This header is set by Firebase App Hosting for cron jobs.
  // It ensures that only the cron service can trigger this endpoint.
  const isCron = request.headers.get('X-App-Hosting-Cron') === 'true';

  // For local testing, you can bypass this check.
  // In production, this ensures security.
  if (!isCron && process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await checkLateCyclesAndNotify();
    if (result.success) {
      return NextResponse.json({ message: result.message }, { status: 200 });
    } else {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }
  } catch (error: any) {
    console.error('API Route Error in /api/cron/check-cycles:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}
