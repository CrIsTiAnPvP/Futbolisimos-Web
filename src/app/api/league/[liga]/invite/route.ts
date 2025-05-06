import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/prisma";

export async function GET(req: NextRequest, { params }: { params: Promise<{ liga: string }> }) {
	const liga = (await params).liga;
	const id = req.nextUrl.searchParams.get("id");

	if (!id) {
		return NextResponse.json({ error: "No se ha enviado el id de la invitacion" }, { status: 400 });
	}

	if (req.headers.get("content-type") !== "application/json") {
		return NextResponse.json({ error: "El contenido debe ser application/json" }, { status: 415 });
	}

	if (!/^[a-fA-F0-9]{24}$/.test(id)) {
		return NextResponse.json({ error: "El id debe ser un string hexadecimal de 24 caracteres" }, { status: 400 });
	}

	const invite = await prisma.invitacion.findFirst({
		where: {
			id: id,
			id_liga: liga
		}
	})

	if (!invite) {
		return NextResponse.json({ error: "No existe una invitacion con ese id" }, { status: 404 });
	}

	return NextResponse.json({ invite }, { status: 200 });

}