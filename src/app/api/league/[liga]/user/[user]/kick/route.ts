import { NextRequest, NextResponse } from "next/server";
import { ApiKey } from "@/lib/utils";
import { prisma } from "@/prisma";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ liga: string, user: string }> }) {
	const { liga, user } = (await params);

	const { apiKey } = await req.json()

	if (!req.headers.get('content-type')?.includes('application/json')) return NextResponse.json({ error: 'Invalid content type' }, { status: 400 });

	if (!liga || !user || !apiKey) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

	if (apiKey !== ApiKey) return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });

	if (!/^[a-fA-F0-9]{24}$/.test(liga)) return NextResponse.json({ error: 'Invalid league ID' }, { status: 400 });

	if (!/^[a-fA-F0-9]{24}$/.test(user)) return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });

	const league = await prisma.liga.findFirst({
		where: {
			id: liga
		}
	})

	if (!league) return NextResponse.json({ error: 'League not found' }, { status: 404 });

	if (!league.IdsUsuarios.includes(user)) return NextResponse.json({ error: 'User not found in league' }, { status: 404 });

	const usuario = await prisma.user.findFirst({
		where: {
			id: user
		}
	})

	if (!usuario) return NextResponse.json({ error: 'User not found' }, { status: 404 });

	await prisma.liga.update({
		where: {
			id: liga
		},
		data: {
			IdsUsuarios: {
				set: league.IdsUsuarios.filter((i) => i !== user)
			}
		}
	})

	await prisma.user.update({
		where: {
			id: user
		},
		data: {
			IdsLigas: {
				set: usuario.IdsLigas.filter((i) => i !== liga)
			}
		}
	})

	await prisma.invitacion.deleteMany({
		where: {
			id_liga: liga,
			id_invitador: user
		}
	})

	return NextResponse.json({ message: 'User kicked from league successfully' }, { status: 200 });

}