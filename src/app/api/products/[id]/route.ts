import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../firebase";
import { collection, doc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";

// GET: Get a single product by ID
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const productRef = doc(collection(db, "products"), params.id);
    const productSnap = await getDoc(productRef);
    if (!productSnap.exists()) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ id: productSnap.id, ...productSnap.data() });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Unknown error" }, { status: 500 });
  }
}

// PATCH: Update product (name/description)
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { name, description } = await req.json();
    const productRef = doc(collection(db, "products"), params.id);
    await updateDoc(productRef, {
      ...(name && { name }),
      ...(description && { description }),
      updatedAt: Date.now(),
    });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Unknown error" }, { status: 500 });
  }
}

// PATCH: Update variant quantity and track history
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { variantId, newQuantity, user } = await req.json();
    const productRef = doc(collection(db, "products"), params.id);
    const productSnap = await getDoc(productRef);
    if (!productSnap.exists()) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    const product = productSnap.data();
    const variants = product.variants || [];
    const idx = variants.findIndex((v: any) => v.id === variantId);
    if (idx === -1) {
      return NextResponse.json({ error: "Variant not found" }, { status: 404 });
    }
    const prevQuantity = variants[idx].quantity;
    variants[idx].quantity = newQuantity;
    await updateDoc(productRef, {
      variants,
      history: arrayUnion({
        type: "quantity_update",
        variantId,
        prevQuantity,
        newQuantity,
        updatedBy: user || "unknown",
        updatedAt: Date.now(),
      }),
      updatedAt: Date.now(),
    });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Unknown error" }, { status: 500 });
  }
}
