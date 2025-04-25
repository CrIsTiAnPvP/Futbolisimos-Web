import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma";
import { ApiKey } from "@/lib/utils";

export async function GET(req: NextRequest) {
	const id = req.nextUrl.searchParams.get('id')
	if (!id) return NextResponse.json({ error: 'No id provided' }, { status: 400 });

	const user = await prisma.user.findUnique({
		where: { id: id }
	})

	if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

	return NextResponse.json({ user }, { status: 200 });

}

export async function POST(req: NextRequest) {
	const { id, name, apiKey } = await req.json()

	if (!req.headers.get('content-type')?.includes('application/json')) return NextResponse.json({ error: 'Invalid content type' }, { status: 400 });
	if (!id || !name || !apiKey) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

	if (apiKey !== ApiKey) return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });

	const user = await prisma.user.findUnique({
		where: { id: id }
	})

	if (name === user?.name) return NextResponse.json({ error: 'No changes made' }, { status: 400 });

	if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

	if (user.updatedAt && new Date().toDateString() === new Date(user.updatedAt).toDateString()) {
		return NextResponse.json({ error: 'Timeout' }, { status: 403 });
	}

	await prisma.user.update({
		where: { id: id },
		data: {
			name: name,
			updatedAt: new Date()
		}
	})

	return NextResponse.json({ message: 'User updated succesfuly' }, { status: 200 });
}