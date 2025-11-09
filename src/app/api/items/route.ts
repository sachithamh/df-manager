import { NextResponse } from "next/server";
import { db } from "../../../firebase";
import { collection, addDoc, getDocs, doc, getDoc, updateDoc, deleteDoc, query, where } from "firebase/firestore";

// POST /api/items - create item
export async function POST(req: Request) {
  try {
    const { productId, quantity } = await req.json();
    if (!productId || typeof quantity !== "number") {
      return NextResponse.json({ error: "Missing productId or quantity" }, { status: 400 });
    }
    // Check product exists
    const productRef = doc(db, "products", productId);
    const productSnap = await getDoc(productRef);
    if (!productSnap.exists()) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    const itemDoc = await addDoc(collection(db, "items"), {
      productId,
      quantity,
      createdAt: Date.now(),
    });
    return NextResponse.json({ id: itemDoc.id, productId, quantity });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

// GET /api/items - list all items
export async function GET() {
  try {
    const itemsSnap = await getDocs(collection(db, "items"));
    const items = itemsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json(items);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
