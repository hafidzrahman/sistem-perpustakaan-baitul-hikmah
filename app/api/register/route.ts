import { User } from "@/app/class/user";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log(body);

    const dataUser = await User.addUser(body);

    return NextResponse.json(dataUser, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Gagal menambahkan data user", details: error },
      { status: 405 }
    );
  }
}
