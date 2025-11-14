
import { NextResponse } from 'next/server';

const EXTERNAL_API_URL = 'https://email-sender-cloud-run-921681439350.europe-central2.run.app';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Data validation (optional but recommended)
    const { name, email, type, phone } = body;
    if (!name || !email || !type || !phone) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const response = await fetch(EXTERNAL_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
        const errorData = await response.text();
        console.error('External API Error:', errorData);
        return NextResponse.json({ error: 'Failed to send email via external service', details: errorData }, { status: response.status });
    }
    
    const responseData = await response.json();
    return NextResponse.json(responseData, { status: 200 });

  } catch (error) {
    console.error('API Route Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
