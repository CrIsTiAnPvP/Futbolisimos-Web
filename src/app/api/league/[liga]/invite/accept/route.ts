import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/prisma";
import { ApiKey } from "@/lib/utils";

export async function POST(req: NextRequest, { params }: { params: Promise<{ liga: string }> }) {

	const liga = (await params).liga;
	const { id, apiKey, user_id } = await req.json()

	if (!req.headers.get("content-type")?.includes("application/json")) return NextResponse.json({ error: "Invalid content type" }, { status: 400 });

	if (!id || !liga || !apiKey || !user_id) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

	if (apiKey !== ApiKey) return NextResponse.json({ error: "Invalid API key" }, { status: 401 });

	if (!/^[a-fA-F0-9]{24}$/.test(liga)) return NextResponse.json({ error: "Invalid league ID" }, { status: 400 });

	let invitacion = await prisma.invitacion.findFirst({
		where: {
			id_liga: liga,
			id: id,
			id_invitados: {
				has: user_id
			}
		}
	})

	if (!invitacion) return NextResponse.json({ error: "Invitation not found" }, { status: 404 });

	const ligaObj = await prisma.liga.findFirst({
		where: {
			id: liga
		}
	})

	if (!ligaObj) return NextResponse.json({ error: "League not found" }, { status: 404 });

	if (ligaObj.IdsUsuarios.length + 1 > ligaObj.usuariosMaximos) return NextResponse.json({ error: "League is full" }, { status: 403 });

	invitacion = await prisma.invitacion.update({
		where: {
			id: id
		},
		data: {
			id_usuarios_pendientes: {
				set: invitacion.id_usuarios_pendientes.filter((i) => i !== user_id)
			},
			id_usuarios_aceptados: {
				set: [...invitacion.id_usuarios_aceptados, user_id]
			}
		}
	})

	await prisma.liga.update({
		where: {
			id: liga
		},
		data: {
			IdsUsuarios: {
				set: [...ligaObj.IdsUsuarios, user_id]
			},
			cantidadMiembros: ligaObj.cantidadMiembros + 1
		}
	})

	await prisma.user.update({
		where: {
			id: user_id
		},
		data: {
			Ligas: {
				connect: {
					id: liga
				}
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
	return NextResponse.json({ message: "Invitation accepted" }, { status: 200 });

}