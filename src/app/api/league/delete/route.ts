import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/prisma";
import { ApiKey } from "@/lib/utils";

export async function DELETE(req: NextRequest) {
	const { id, apiKey } = await req.json()

	if (!req.headers.get('content-type')?.includes('application/json')) return NextResponse.json({ error: 'Invalid content type' }, { status: 400 });
	if (!id || !apiKey) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
	if (apiKey !== ApiKey) return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });

	if (!/^[a-fA-F0-9]{24}$/.test(id)) return NextResponse.json({ error: 'Invalid league ID' }, { status: 400 });

	const league = await prisma.liga.findFirst({
		where: {
			id: id
		}
	})

	console.log(league, id, apiKey)

	if (!league) return NextResponse.json({ error: 'League not found' }, { status: 404 });

	await prisma.liga.delete({
		where: {
			id: id
		}
	})

	await prisma.invitacion.deleteMany({
		where: {
			id_liga: id
		}
	})

	await prisma.user.updateMany({
		where: {
			IdsLigas: {
				has: id
			}
		},
		data: {
			IdsLigas: {
				set: league.IdsUsuarios.filter((i) => i !== id)
			}
		}
	})


	return NextResponse.json({ message: 'League deleted successfully' }, { status: 200 });
}