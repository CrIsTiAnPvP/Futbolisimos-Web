import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {

	const id = (await params).id

	if (!req.headers.get('content-type')?.includes('application/json')) return NextResponse.json({ error: 'Invalid content type' }, { status: 400 });
	if (!id) return NextResponse.json({ error: 'No id provided' }, { status: 400 });

	const ligas_user = await prisma.user.findFirst({
		where: {
			id: id
		},
		include: {
			Ligas: true
		}
	})

	if (!ligas_user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

	const ligas = ligas_user.Ligas

	return NextResponse.json({ ligas }, { status: 200 });
}