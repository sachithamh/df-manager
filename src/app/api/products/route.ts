import { NextRequest, NextResponse } from "next/server";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../../../firebase";

// GET: List all products
export async function GET() {
  const productsCol = collection(db, "products");
  const snapshot = await getDocs(productsCol);
  const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return NextResponse.json(products);
}

// POST: Add a new product
export async function POST(req: NextRequest) {
  try {
    const { name, description, sku } = await req.json();
    if (!name || !description || !sku) {
      return NextResponse.json({ error: "Missing name, description, or sku" }, { status: 400 });
    }
    const docRef = await addDoc(collection(db, "products"), {
      name,
      description,
      sku,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    return NextResponse.json({ id: docRef.id });
  } catch (err: any) {
    console.error("Error creating product:", err);
    return NextResponse.json({ error: err.message || "Unknown error" }, { status: 500 });
  }
}
