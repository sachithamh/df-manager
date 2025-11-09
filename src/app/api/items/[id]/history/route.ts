import { NextResponse } from "next/server";
import { db } from "../../../../../firebase";
import { collection, addDoc, getDocs, doc, getDoc } from "firebase/firestore";

// POST /api/items/[id]/history - add a history record for an item
export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const { change, note } = await req.json();
    if (typeof change !== "number") {
      return NextResponse.json({ error: "Missing or invalid change" }, { status: 400 });
    }
    const itemRef = doc(db, "items", params.id);
    const itemSnap = await getDoc(itemRef);
    if (!itemSnap.exists()) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }
    const historyRef = collection(itemRef, "history");
    const record = {
      change,
      note: note || "",
      timestamp: Date.now(),
    };
    await addDoc(historyRef, record);
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

// GET /api/items/[id]/history - get all history records for an item
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const itemRef = doc(db, "items", params.id);
    const historyRef = collection(itemRef, "history");
    const snap = await getDocs(historyRef);
    const history = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json(history);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
