import { NextResponse } from "next/server";
import prisma from '@/lib/prisma/prisma';

export async function GET() {
    try {
        const users = await prisma.user.findMany();
        const response = NextResponse.json({ users });
        return response;
    } catch (err) {
        console.error('Unexpected error:', err);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}