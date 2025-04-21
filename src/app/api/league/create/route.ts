import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/prisma";

export async function GET(req: NextRequest) {

	try {
		await req.json()
	} catch (error) {
		return NextResponse.json({ error: "No se ha enviado el body" }, { status: 400 });
	}

	const { key } = await req.json()

	if (key !== process.env.API_KEY) {
		return NextResponse.json({ error: "API Key incorrecta" }, { status: 401 });
	}	

	const { name,  userId } = await req.json()

	const liga = await prisma.liga.create({
		data: {
			nombre: name,
			id_creador: userId
		}
	})

	if (!liga) {
		return NextResponse.json({ error: "No se ha podido crear la liga" }, { status:  500});
	}

	return NextResponse.json({ liga }, { status: 201 });

}