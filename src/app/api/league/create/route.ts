import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/prisma";
import { ApiKey } from "@/lib/utils";

export async function POST(req: NextRequest) {

	const { id, name, description, image, maxMembers, apiKey, privateLeague } = await req.json()

	if (!req.headers.get('content-type')?.includes('application/json')) return NextResponse.json({ error: 'Invalid content type' }, { status: 400 });
	if (!id || !name || !description || !image || !maxMembers || !apiKey) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
	if (apiKey !== ApiKey) return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });

	const existingLeague = await prisma.liga.findFirst({
		where: {
			nombre: name
		}
	})

	if (existingLeague) return NextResponse.json({ error: 'League already exists' }, { status: 400 });

	const league = await prisma.liga.create({
		data: {
			nombre: name,
			descripcion: description,
			imagen: image,
			usuariosMaximos: maxMembers,
			IdsUsuarios: [id],
			id_creador: id,
			privada: privateLeague,
			Usuarios: {
				connect: { id: id }
			},
			Invitaciones: {
				create: {
					id_invitador: id,
				}
			},
			cantidadMiembros: 1,
		}
	});

	await prisma.mercado.create({
		data: {
			id_liga: league.id
		}
	})

	if (league) return NextResponse.json({ message: 'League created successfully', league }, { status: 200 });
	
	return NextResponse.json({ error: 'No changes made' }, { status: 400 });
}