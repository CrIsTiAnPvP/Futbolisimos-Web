import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/prisma';
import { ApiKey } from '@/lib/utils';

async function handleInvite(id_liga: string, privada: boolean, usos: number, id_user: string) {

	if (privada) {
		const invite = await prisma.invitacion.findFirst({
			where: {
				id_liga: id_liga

			}
		})
		if (invite) return undefined
	}

	const invite = await prisma.invitacion.create({
		data: {
			id_liga: id_liga,
			id_invitador: id_user,
			usosMaximos: usos,
			usosRestantes: usos
		}
	})

	return invite
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ liga: string }> }) {

	const liga = (await params).liga;
	const { id, apiKey, privada, usos } = await req.json()

	if (!req.headers.get('content-type')?.includes('application/json')) return NextResponse.json({ error: 'Invalid content type' }, { status: 400 });
	if (!id || !liga || !apiKey || !privada || !usos) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
	if (apiKey !== ApiKey) return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });

	if (!/^[a-fA-F0-9]{24}$/.test(liga)) return NextResponse.json({ error: 'Invalid league ID' }, { status: 400 });

	const invitacion = await handleInvite(liga, privada, usos, id)

	if (!invitacion) return NextResponse.json({ error: 'No changes made' }, { status: 400 });

	return NextResponse.json({ message: 'Invitation created successfully', invitacion }, { status: 200 });
}