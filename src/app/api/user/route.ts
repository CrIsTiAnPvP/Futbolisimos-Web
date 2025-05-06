import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/prisma";

export async function GET(req: NextRequest) {

	const id = req.nextUrl.searchParams.get("id");
	
	if (!id) {
		return NextResponse.json({ error: "No se ha enviado el id del usuario" }, { status: 400 });
	}
	
	if (req.headers.get("content-type") !== "application/json") {
		return NextResponse.json({ error: "El contenido debe ser application/json" }, { status: 415 });
	}

	const user = await prisma.user.findFirst({
		where: {
			id: id,
		},
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
	})

	if (!user) {
		return NextResponse.json({ error: "No existe una usuario con ese id" }, { status: 404 });
	}

	return NextResponse.json({ user }, { status: 200 });

}