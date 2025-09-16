import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../../firebase";
import { collection, doc, updateDoc, getDoc, arrayUnion } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";

// POST: Add a new variant to a product
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { name, sku, quantity } = await req.json();
    if (!name || typeof quantity !== "number") {
      return NextResponse.json({ error: "Missing name or quantity" }, { status: 400 });
    }
    const productRef = doc(collection(db, "products"), params.id);
    const productSnap = await getDoc(productRef);
    if (!productSnap.exists()) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    const product = productSnap.data();
    const variants = product.variants || [];
    const newVariant = {
      id: uuidv4(),
      name,
      sku: sku || "",
      quantity,
    };
    variants.push(newVariant);
    await updateDoc(productRef, {
      variants,
      history: arrayUnion({
        type: "variant_add",
        variantId: newVariant.id,
        name,
        sku,
        quantity,
        addedBy: "unknown",
        addedAt: Date.now(),
      }),
      updatedAt: Date.now(),
    });
    return NextResponse.json({ success: true, variant: newVariant });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Unknown error" }, { status: 500 });
  }
}
