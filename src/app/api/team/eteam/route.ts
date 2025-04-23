import { prisma } from "@/prisma";
import { NextResponse } from "next/server";

export async function GET() {
	const teams = await prisma.equipo.findMany({
		orderBy: {
			Valor: "desc"
		},
		take: 10
	});

	if (!teams) {
		return NextResponse.json({ error: "No teams found" }, { status: 404 });
	}

	return NextResponse.json(teams, { status: 200 });
}