import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/prisma";

export async function GET(req: NextRequest) {

	const name = req.nextUrl.searchParams.get("name");

	if (!name) {
		return NextResponse.json({ error: "No se ha enviado el nombre de la liga" }, { status: 400 });
	}

	try {
		await req.json()
	} catch (error) {
		return NextResponse.json({ error: "No se ha enviado el body" }, { status: 400 });
	}

	const { key } = await req.json()

	if (key !== process.env.API_KEY) {
		return NextResponse.json({ error: "API Key incorrecta" }, { status: 401 });
	}	


	const liga = await prisma.liga.findFirst({
		where: {
			nombre: name
		}
	})

	if (!liga) {
		return NextResponse.json({ error: "No existe una liga con ese nombre" }, { status:  404});
	}

	return NextResponse.json({ liga }, { status: 200 });

}