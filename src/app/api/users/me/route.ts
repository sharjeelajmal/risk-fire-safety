import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

// Helper to get user ID from cookie
async function getUserIdFromCookie() {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;
    
    if (!token) return null;
    
    if (token === 'mock_token_admin') {
        return 'admin';
    }
    
    if (token.startsWith('mock_token_')) {
        return token.replace('mock_token_', '');
    }
    
    return null;
}

export async function GET() {
    try {
        const userId = await getUserIdFromCookie();
        
        if (!userId) {
            return NextResponse.json({ error: 'Nicht authentifiziert' }, { status: 401 });
        }

        // Handle Master Admin case
        if (userId === 'admin') {
            return NextResponse.json({
                name: 'Master Admin',
                email: process.env.AUTH_EMAIL,
                role: 'admin',
                isMaster: true
            });
        }

        await connectToDatabase();
        const user = await User.findById(userId).select('-password');
        
        if (!user) {
            return NextResponse.json({ error: 'Benutzer nicht gefunden' }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        return NextResponse.json({ error: 'Serverfehler' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const userId = await getUserIdFromCookie();
        
        if (!userId) {
            return NextResponse.json({ error: 'Nicht authentifiziert' }, { status: 401 });
        }

        if (userId === 'admin') {
            return NextResponse.json({ error: 'Master Admin kann nicht über API geändert werden' }, { status: 403 });
        }

        const { name, email, password } = await request.json();
        
        await connectToDatabase();
        
        // Check if email is already taken by another user
        if (email) {
            const existingUser = await User.findOne({ email: email.toLowerCase(), _id: { $ne: userId } });
            if (existingUser) {
                return NextResponse.json({ error: 'Diese E-Mail-Adresse wird bereits verwendet' }, { status: 400 });
            }
        }

        const updateData: any = {};
        if (name) updateData.name = name;
        if (email) updateData.email = email.toLowerCase();
        
        if (password) {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(password, salt);
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { new: true }
        ).select('-password');

        if (!updatedUser) {
            return NextResponse.json({ error: 'Benutzer nicht gefunden' }, { status: 404 });
        }

        return NextResponse.json(updatedUser);
    } catch (error) {
        return NextResponse.json({ error: 'Update fehlgeschlagen' }, { status: 500 });
    }
}
