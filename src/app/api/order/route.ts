// GET: Fetch an order with details by code
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();


export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    if (!code) return NextResponse.json({ error: "Order code is required" }, { status: 400 });
  
    try {
      const order = await prisma.order.findUnique({
        where: { code: (code) },
        include: { OrderDetail: { include: { Menu: true } } },
      });
      if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
      return NextResponse.json(order, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
    }
  }
  
  // POST: Create a new order with details
  export async function POST(req: Request) {
    try {
      const body = await req.json();
      const { code, total, details } = body;
  
      if (!details || !Array.isArray(details)) {
        return NextResponse.json({ error: "Order details are required" }, { status: 400 });
      }
  
      const newOrder = await prisma.order.create({
        data: {
          code: (code),
          total: (total),
          OrderDetail: {
            create: details.map((detail: { menuId: number; quantity: number }) => ({
              menu_id: detail.menuId,
              quantity: detail.quantity,
            })),
          },
        },
        include: { OrderDetail: true },
      });
  
      return NextResponse.json(newOrder, { status: 201 });
    } catch (error) {
      return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
    }
}