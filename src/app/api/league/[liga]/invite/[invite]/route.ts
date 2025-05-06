import { NextRequest, NextResponse } from "next/server";
import { ApiKey } from "@/lib/utils";
import { prisma } from "@/prisma";

export async function POST(req: NextRequest, { params }: { params: Promise<{ liga: string, invite: string }> }) {
	const { liga, invite } = (await params);

	const { user_id, apikey } = await req.json();

	if (!apikey) return NextResponse.json({ error: "API key is missing" }, { status: 400 });

	if (apikey !== ApiKey) return NextResponse.json({ error: "Invalid API key" }, { status: 401 });

	if (req.headers.get("content-type") !== "application/json") return NextResponse.json({ error: "Content must be application/json" }, { status: 415 });

	if (!/^[a-fA-F0-9]{24}$/.test(invite)) return NextResponse.json({ error: "Invite ID must be a 24-character hexadecimal string" }, { status: 400 });

	if (!/^[a-fA-F0-9]{24}$/.test(liga)) return NextResponse.json({ error: "League ID must be a 24-character hexadecimal string" }, { status: 400 });

	const ligaObj = await prisma.liga.findFirst({
		where: {
			id: liga
		}
	});

	const inviteObj = await prisma.invitacion.findFirst({
		where: {
			id: invite,
			id_liga: liga
		}
	})

	if (!inviteObj) return NextResponse.json({ error: "No invitation found with the provided ID" }, { status: 404 });

	if (inviteObj.usosRestantes <= 0) return NextResponse.json({ error: "No remaining uses for this invitation" }, { status: 403 });

	if (!ligaObj) return NextResponse.json({ error: "No league found with the provided ID" }, { status: 404 });

	if (ligaObj.privada) {
		await prisma.invitacion.update({
			where:{
				id: invite
			},
			data: {
				invitados: {
					connect: {
						id: user_id
					}
				},
				Usuarios_pendientes: {
					connect: {
						id: user_id
					}
				},
				usosRestantes: inviteObj.usosRestantes - 1,
			}
		})

		return NextResponse.json({ message: "User pending" }, { status: 200 });
	}

	await prisma.liga.update({
		where :{
			id: liga
		},
		data: {
			Usuarios: {
				connect: {
					id: user_id
				}
			}
		}
	})

	await prisma.invitacion.update({
		where:  {
			id: invite,
			id_liga: liga
		},
		data: {
			usosRestantes: inviteObj.usosRestantes - 1,
			Usuarios_aceptados: {
				connect: {
					id: user_id
				}
			},
			invitados: {
				connect: {
					id: user_id
				}
			}

		}
	})

	return NextResponse.json({ message: "User added" }, { status: 200 });
}
