import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma";
import { ApiKey } from "@/lib/utils";

export async function POST(req: NextRequest, { params }: { params: Promise<{ liga: string }> }) {

	const liga = (await params).liga;
	const { id, apiKey, user_id } = await req.json()

	console.log("Rejecting invitation", { id, apiKey, user_id, liga });

	if (!req.headers.get("content-type")?.includes("application/json")) return NextResponse.json({ error: "Invalid content type" }, { status: 400 });

	if (!id || !apiKey || !user_id) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

	if (apiKey !== ApiKey) return NextResponse.json({ error: "Invalid API key" }, { status: 401 });

	let invitacion = await prisma.invitacion.findFirst({
		where: {
			id_liga: liga,
			id: id,
			id_invitados: {
				has: user_id
			}
		}
	})

	console.log("Invitation found", { invitacion });

	if (!invitacion) return NextResponse.json({ error: "Invitation not found" }, { status: 404 });

	invitacion = await prisma.invitacion.update({
		where: {
			id: id
		},
		data: {
			id_usuarios_pendientes: {
				set: invitacion.id_usuarios_pendientes.filter((i) => i !== user_id)
			}
		}
	})

	if (invitacion.id_usuarios_pendientes.length === 0 && invitacion.usosRestantes === 0) {
		await prisma.invitacion.delete({
			where: {
				id: id
			}
		})
	}

	return NextResponse.json({ message: "Invitation rejected" }, { status: 200 });

}