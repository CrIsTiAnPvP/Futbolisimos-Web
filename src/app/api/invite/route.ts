import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/prisma";

export async function GET(req: NextRequest) {

	const id = req.nextUrl.searchParams.get("id");

	if (!id) return NextResponse.json({ error: "No se ha enviado el id de la invitacion" }, { status: 400 });

	if (req.headers.get("content-type") !== "application/json") return NextResponse.json({ error: "El contenido debe ser application/json" }, { status: 415 });

	if (!/^[a-fA-F0-9]{24}$/.test(id)) return NextResponse.json({ error: "El id debe ser un string hexadecimal de 24 caracteres" }, { status: 400 });

	const invite = await prisma.invitacion.findFirst({
		where: {
			id: id,
		},
		include: {
			invitador: {
				select: {
					id: true,
					name: true,
					image: true,
					PartidosJugados: true,
					PartidosGanados: true,
					PartidosPerdidos: true,
					PartidosEmpatados: true,
					PuntosTotales: true,
					GolesFavor: true,
					GolesContra: true,
					InvitacionesRecibidasId: true,
					InvitacionesPendientesId: true,
					InvitacionesAceptadasId: true,
					IdsLigas: true,
					createdAt: true,
					updatedAt: true,
				}
			}
		}
	})

	if (!invite) return NextResponse.json({ error: "No existe una invitacion con ese id" }, { status: 404 });

	return NextResponse.json({ invite }, { status: 200 });

}