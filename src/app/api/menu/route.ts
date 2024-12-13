import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const menus = await prisma.menu.findMany();
    return NextResponse.json(menus, { status: 200 });
  } catch (error) {
    console.error("Error fetching menus:", error);
    return NextResponse.json({ error: error.message || "An unexpected error occurred" }, { status: 500 });
  }
}

// POST: Create a new menu
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, price, description, image, promo, type } = body;
    const newMenu = await prisma.menu.create({
      data: { name, price, description, image, promo, type },
    });
    return NextResponse.json(newMenu, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create menu" }, { status: 500 });
  }
}

// GET, PUT, DELETE for specific menu (dynamic route handling)

export async function GET_BY_ID(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const menu = await prisma.menu.findUnique({ where: { id: id } });
    if (!menu) return NextResponse.json({ error: "Menu not found" }, { status: 404 });
    return NextResponse.json(menu, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch menu" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await req.json();
    const { name, price, description, image, promo, type } = body;
    const updatedMenu = await prisma.menu.update({
      where: { id: id },
      data: { name, price, description, image, promo, type },
    });
    return NextResponse.json(updatedMenu, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update menu" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    await prisma.menu.delete({ where: { id: id } });
    return NextResponse.json(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete menu" }, { status: 500 });
  }
}