import { NextResponse } from "next/server";
import connectToDatabase from "../../../lib/db"; // Agar @/lib/db kaam na kare toh ye relative path use karein

export async function GET() {
  try {
    await connectToDatabase();
    return NextResponse.json(
      { message: "Zabardast! MongoDB Connected Successfully! 🎉" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("DB Connection Error:", error);
    return NextResponse.json(
      { message: "Database Connection Failed!", error: error.message },
      { status: 500 }
    );
  }
}