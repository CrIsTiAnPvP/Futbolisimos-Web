import { prisma } from "@/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
	const leagues = await prisma.liga.findMany({
		orderBy: {
			cantidadMiembros: "desc"
		},
		take: 10
	})

	if (!leagues) {
		return NextResponse.json({ error: "No leagues found" }, { status: 404 });
	}

	return NextResponse.json(leagues, { status: 200 });
}