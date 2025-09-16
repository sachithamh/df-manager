import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../../../firebase";
import { collection, doc, updateDoc, getDoc, arrayUnion } from "firebase/firestore";

// PATCH: Update a variant (name, sku, etc.)
export async function PATCH(req: NextRequest, { params }: { params: { id: string, variantId: string } }) {
  try {
    const { name, sku } = await req.json();
    const productRef = doc(collection(db, "products"), params.id);
    const productSnap = await getDoc(productRef);
    if (!productSnap.exists()) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    const product = productSnap.data();
    const variants = product.variants || [];
    const idx = variants.findIndex((v: any) => v.id === params.variantId);
    if (idx === -1) {
      return NextResponse.json({ error: "Variant not found" }, { status: 404 });
    }
    if (name) variants[idx].name = name;
    if (sku) variants[idx].sku = sku;
    await updateDoc(productRef, {
      variants,
      history: arrayUnion({
        type: "variant_update",
        variantId: params.variantId,
        updatedBy: "unknown",
        updatedAt: Date.now(),
        name,
        sku,
      }),
      updatedAt: Date.now(),
    });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Unknown error" }, { status: 500 });
  }
}
