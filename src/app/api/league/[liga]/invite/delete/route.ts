import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma";
import { ApiKey } from "@/lib/utils";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ liga: string }> }) {

	const liga = (await params).liga;
	const { id, apiKey } = await req.json()

	if (!req.headers.get("content-type")?.includes("application/json")) return NextResponse.json({ error: "Invalid content type" }, { status: 400 });

	if (!id || !liga || !apiKey) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

	if (apiKey !== ApiKey) return NextResponse.json({ error: "Invalid API key" }, { status: 401 });

	if (!/^[a-fA-F0-9]{24}$/.test(liga)) return NextResponse.json({ error: "Invalid league ID" }, { status: 400 });

	const invitacion = await prisma.invitacion.findFirst({
		where: {
			id: id,
			id_liga: liga
		}
	})

	if (!invitacion) return NextResponse.json({ error: "Invitation not found" }, { status: 404 });

	if (invitacion.id_usuarios_pendientes.length > 0) return NextResponse.json({ error: "Cannot delete invitation with pending users" }, { status: 400 });

	await prisma.invitacion.delete({
		where: {
			id: id,
			id_liga: liga
		}
	})

	return NextResponse.json({ message: "Invitation deleted successfully" }, { status: 200 });

}