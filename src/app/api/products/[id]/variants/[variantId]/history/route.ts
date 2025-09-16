import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../../../../firebase";
import { doc, getDoc, updateDoc, collection, addDoc, serverTimestamp, getDocs } from "firebase/firestore";

// PATCH: Update variant quantity and add to history subcollection
export async function PATCH(req: NextRequest, { params }: { params: { id: string, variantId: string } }) {
  try {
    const { newQuantity, user } = await req.json();
    const variantRef = doc(db, "products", params.id, "variants", params.variantId);
    const variantSnap = await getDoc(variantRef);
    if (!variantSnap.exists()) {
      return NextResponse.json({ error: "Variant not found" }, { status: 404 });
    }
    const prevQuantity = variantSnap.data().quantity;
    await updateDoc(variantRef, {
      quantity: newQuantity,
      updatedAt: serverTimestamp(),
    });
    // Add to history subcollection
    await addDoc(collection(variantRef, "history"), {
      prevQuantity,
      newQuantity,
      updatedBy: user || "unknown",
      updatedAt: serverTimestamp(),
    });
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Unknown error" }, { status: 500 });
  }
}

// GET: Get variant history
export async function GET(req: NextRequest, { params }: { params: { id: string, variantId: string } }) {
  try {
    const historyCol = collection(db, "products", params.id, "variants", params.variantId, "history");
    const snapshot = await getDocs(historyCol);
    const history = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json(history);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Unknown error" }, { status: 500 });
  }
}
