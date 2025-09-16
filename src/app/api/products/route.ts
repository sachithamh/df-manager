import { NextRequest, NextResponse } from "next/server";
import { getFirestore, collection, addDoc, getDocs, doc, updateDoc, getDoc } from "firebase/firestore";
import { auth } from "../../../firebase";
import { getApps } from "firebase/app";

// Helper to get Firestore instance
function getDB() {
  if (!getApps().length) throw new Error("Firebase not initialized");
  return getFirestore();
}

// GET: List all products
export async function GET() {
  const db = getDB();
  const productsCol = collection(db, "products");
  const snapshot = await getDocs(productsCol);
  const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return NextResponse.json(products);
}

// POST: Add a new product
export async function POST(req: NextRequest) {
  const db = getDB();
  const { name, description } = await req.json();
  const docRef = await addDoc(collection(db, "products"), {
    name,
    description,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    variants: [],
    history: [],
  });
  return NextResponse.json({ id: docRef.id });
}
