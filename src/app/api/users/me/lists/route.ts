import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import connectToDatabase from '@/lib/db';
import User from '@/models/User';

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
        if (!userId) return NextResponse.json({ error: 'Nicht authentifiziert' }, { status: 401 });

        await connectToDatabase();
        
        let user;
        if (userId === 'admin') {
            const adminEmail = process.env.AUTH_EMAIL || 'admin@admin.com';
            console.log('GET: Searching for admin user:', adminEmail);
            user = await User.findOne({ email: adminEmail });
            
            if (!user) {
                console.log('GET: Admin not found, creating one...');
                user = new User({
                    name: 'Admin User',
                    email: adminEmail,
                    password: 'mock_password_123',
                    role: 'admin',
                    customLists: { auftraggeber: [], participants: [], functions: [], notes: [] }
                });
                await user.save();
                console.log('GET: Admin created and saved.');
            }
        } else {
            try {
                user = await User.findById(userId);
            } catch (e) {
                console.error('GET: Invalid ObjectId format:', userId);
                return NextResponse.json({ error: 'Ungültiger Benutzer-ID-Format' }, { status: 400 });
            }
        }

        if (!user) {
            console.log('GET: User not found in DB:', userId);
            return NextResponse.json({ error: 'Benutzer nicht gefunden' }, { status: 404 });
        }

        console.log(`GET: Returning lists for ${user.email} (${(user.customLists?.auftraggeber?.length || 0)} clients)`);
        return NextResponse.json(user.customLists || { 
            auftraggeber: [], participants: [], functions: [], notes: [] 
        });
    } catch (error) {
        console.error('GET Error:', error);
        return NextResponse.json({ error: 'Serverfehler' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const userId = await getUserIdFromCookie();
        if (!userId) return NextResponse.json({ error: 'Nicht authentifiziert' }, { status: 401 });

        const { type, item } = await request.json();
        console.log(`POST: Request to add "${item}" to "${type}" for user ${userId}`);
        if (!type || !item) return NextResponse.json({ error: 'Typ und Element erforderlich' }, { status: 400 });

        await connectToDatabase();
        
        let user;
        if (userId === 'admin') {
            const adminEmail = process.env.AUTH_EMAIL || 'admin@admin.com';
            user = await User.findOne({ email: adminEmail });
            
            if (!user) {
                console.log('POST: Admin not found, creating one...');
                user = new User({
                    name: 'Admin User',
                    email: adminEmail,
                    password: 'mock_password_123',
                    role: 'admin',
                    customLists: { auftraggeber: [], participants: [], functions: [], notes: [] }
                });
                await user.save();
            }
        } else {
            try {
                user = await User.findById(userId);
            } catch (e) {
                console.error('POST: Invalid ObjectId format:', userId);
                return NextResponse.json({ error: 'Ungültiger Benutzer-ID-Format' }, { status: 400 });
            }
        }

        if (!user) return NextResponse.json({ error: 'Benutzer nicht gefunden' }, { status: 404 });

        // Bulletproof MongoDB update bypassing mongoose document tracking
        const updatePath = `customLists.${type}`;
        console.log(`POST: Updating ${updatePath} with $addToSet "${item}"`);
        await User.updateOne(
            { _id: user._id },
            { $addToSet: { [updatePath]: item } }
        );

        // Fetch fresh data from DB to return
        const updatedUser = await User.findById(user._id);
        console.log('POST: Atomic update completed and fresh data fetched.');
        return NextResponse.json(updatedUser?.customLists || {});
        
    } catch (error) {
        console.error('API POST Error:', error);
        return NextResponse.json({ error: 'Serverfehler' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const userId = await getUserIdFromCookie();
        if (!userId) return NextResponse.json({ error: 'Nicht authentifiziert' }, { status: 401 });

        const { type, item } = await request.json();
        console.log(`DELETE: Request to remove "${item}" from "${type}" for user ${userId}`);
        if (!type || !item) return NextResponse.json({ error: 'Typ und Element erforderlich' }, { status: 400 });

        await connectToDatabase();
        
        let user;
        if (userId === 'admin') {
            const adminEmail = process.env.AUTH_EMAIL || 'admin@admin.com';
            user = await User.findOne({ email: adminEmail });
        } else {
            try {
                user = await User.findById(userId);
            } catch (e) {
                return NextResponse.json({ error: 'Ungültiger Benutzer-ID-Format' }, { status: 400 });
            }
        }

        if (!user) return NextResponse.json({ error: 'Benutzer nicht gefunden' }, { status: 404 });

        // Bulletproof MongoDB pull
        const updatePath = `customLists.${type}`;
        console.log(`DELETE: Updating ${updatePath} with $pull "${item}"`);
        await User.updateOne(
            { _id: user._id },
            { $pull: { [updatePath]: item } }
        );

        const updatedUser = await User.findById(user._id);
        console.log('DELETE: Atomic update completed and fresh data fetched.');
        return NextResponse.json(updatedUser?.customLists || {});
        
    } catch (error) {
        console.error('API DELETE Error:', error);
        return NextResponse.json({ error: 'Serverfehler' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const userId = await getUserIdFromCookie();
        if (!userId) return NextResponse.json({ error: 'Nicht authentifiziert' }, { status: 401 });

        const { type, oldItem, newItem } = await request.json();
        console.log(`PUT: Request to rename "${oldItem}" → "${newItem}" in "${type}" for user ${userId}`);
        if (!type || !oldItem || !newItem) return NextResponse.json({ error: 'Typ, altes und neues Element erforderlich' }, { status: 400 });

        await connectToDatabase();
        
        let user;
        if (userId === 'admin') {
            const adminEmail = process.env.AUTH_EMAIL || 'admin@admin.com';
            user = await User.findOne({ email: adminEmail });
        } else {
            try {
                user = await User.findById(userId);
            } catch (e) {
                return NextResponse.json({ error: 'Ungültiger Benutzer-ID-Format' }, { status: 400 });
            }
        }

        if (!user) return NextResponse.json({ error: 'Benutzer nicht gefunden' }, { status: 404 });

        const updatePath = `customLists.${type}`;
        // Remove old item, then add new item
        await User.updateOne({ _id: user._id }, { $pull: { [updatePath]: oldItem } });
        await User.updateOne({ _id: user._id }, { $addToSet: { [updatePath]: newItem } });

        const updatedUser = await User.findById(user._id);
        console.log('PUT: Rename completed and fresh data fetched.');
        return NextResponse.json(updatedUser?.customLists || {});
        
    } catch (error) {
        console.error('API PUT Error:', error);
        return NextResponse.json({ error: 'Serverfehler' }, { status: 500 });
    }
}

