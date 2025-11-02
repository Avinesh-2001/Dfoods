// Vercel Serverless Function for test email endpoint
// This allows the endpoint to work directly without proxying to external backend

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to } = body;
    const testEmail = to || process.env.EMAIL_USER;

    if (!testEmail) {
      return NextResponse.json(
        { 
          error: 'No email provided. Send { "to": "your-email@example.com" } or set EMAIL_USER in .env' 
        },
        { status: 400 }
      );
    }

    // Import email sending function
    // Note: You may need to copy the sendEmail function here or import from a shared utility
    // For now, we'll proxy to the actual backend if NEXT_PUBLIC_API_URL is set
    
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    
    try {
      const response = await fetch(`${backendUrl}/api/test/test-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ to: testEmail }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        return NextResponse.json(data, { status: response.status });
      }

      return NextResponse.json(data);
    } catch (fetchError: any) {
      // If backend is not reachable, return helpful error
      return NextResponse.json(
        {
          success: false,
          error: 'Backend server not reachable',
          message: 'The backend API is not accessible. Please check your deployment.',
          backendUrl,
          note: 'If backend is deployed separately, make sure NEXT_PUBLIC_API_URL is set correctly in Vercel environment variables'
        },
        { status: 503 }
      );
    }
  } catch (error: any) {
    console.error('Test email error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Internal server error'
      },
      { status: 500 }
    );
  }
}

// GET endpoint for config status
export async function GET() {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    
    try {
      const response = await fetch(`${backendUrl}/api/test/email-config-status`, {
        method: 'GET',
      });

      const data = await response.json();
      
      if (!response.ok) {
        return NextResponse.json(data, { status: response.status });
      }

      return NextResponse.json(data);
    } catch (fetchError: any) {
      return NextResponse.json(
        {
          EMAIL_USER: process.env.EMAIL_USER ? '✅ Set (from Vercel)' : '❌ Missing',
          EMAIL_PASSWORD: process.env.EMAIL_PASSWORD ? '✅ Set (from Vercel)' : '❌ Missing',
          NODE_ENV: process.env.NODE_ENV || 'production',
          note: 'Backend not reachable. Showing Vercel environment variables only.',
          backendUrl,
          error: 'Backend server not accessible'
        },
        { status: 200 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { 
        error: error.message || 'Internal server error'
      },
      { status: 500 }
    );
  }
}

