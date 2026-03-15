import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: 'E-Mail and Passwort sind erforderlich' },
                { status: 400 }
            );
        }

        // Tier 1: Master Admin Fallback (from .env)
        const masterAdminEmail = process.env.AUTH_EMAIL;
        const masterAdminPassword = process.env.AUTH_PASSWORD;

        if (email === masterAdminEmail && password === masterAdminPassword) {
            const response = NextResponse.json(
                { message: 'Login successful' },
                { status: 200 }
            );

            response.cookies.set('auth_token', 'mock_token_admin', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 60 * 60 * 24, // 1 day
                path: '/',
            });

            return response;
        }

        // Tier 2: Database Users (Team Members)
        await connectToDatabase();
        const user = await User.findOne({ email: email.toLowerCase() });

        if (user) {
            // Verify password using bcrypt
            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (isPasswordValid) {
                const response = NextResponse.json(
                    { message: 'Login successful' },
                    { status: 200 }
                );

                // Set a mock cookie for middleware to detect
                response.cookies.set('auth_token', 'mock_token_' + user._id, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'strict',
                    maxAge: 60 * 60 * 24, // 1 day
                    path: '/',
                });

                return response;
            }
        }

        return NextResponse.json(
            { error: 'Ungültige E-Mail oder Passwort' },
            { status: 401 }
        );
    } catch (error: any) {
        console.error('Login Auth Error:', error);
        return NextResponse.json(
            { error: 'Etwas ist schief gelaufen' },
            { status: 500 }
        );
    }
}
