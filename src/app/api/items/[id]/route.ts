import { NextResponse } from "next/server";
import { db } from "../../../../firebase";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";

// GET /api/items/[id] - get item by id
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const itemRef = doc(db, "items", params.id);
    const itemSnap = await getDoc(itemRef);
    if (!itemSnap.exists()) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }
    return NextResponse.json({ id: itemSnap.id, ...itemSnap.data() });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

// PATCH /api/items/[id] - update item quantity
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const { quantity } = await req.json();
    if (typeof quantity !== "number") {
      return NextResponse.json({ error: "Missing or invalid quantity" }, { status: 400 });
    }
    const itemRef = doc(db, "items", params.id);
    await updateDoc(itemRef, { quantity });
    return NextResponse.json({ id: params.id, quantity });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

// DELETE /api/items/[id] - delete item
export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    const itemRef = doc(db, "items", params.id);
    await deleteDoc(itemRef);
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
