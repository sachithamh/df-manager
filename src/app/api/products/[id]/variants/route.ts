import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../../firebase";
import { collection, addDoc, getDocs, serverTimestamp } from "firebase/firestore";

// GET: List all variants for a product
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const variantsCol = collection(db, "products", params.id, "variants");
    const snapshot = await getDocs(variantsCol);
    const variants = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json(variants);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Unknown error" }, { status: 500 });
  }
}

// POST: Add a new variant to a product
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { name, sku, quantity } = await req.json();
    if (!name || typeof quantity !== "number") {
      return NextResponse.json({ error: "Missing name or quantity" }, { status: 400 });
    }
    const variantDoc = await addDoc(collection(db, "products", params.id, "variants"), {
      name,
      sku: sku || "",
      quantity,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      history: [],
    });
    return NextResponse.json({ success: true, id: variantDoc.id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Unknown error" }, { status: 500 });
  }
}
