import { NextResponse } from "next/server";
import { getFirebaseAdmin } from "@/lib/firebase-admin";

const SUPER_ADMIN_EMAIL = "hitechsoftware03@gmail.com";

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization") || "";
    const idToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
    if (!idToken) {
      return NextResponse.json({ success: false, error: "Missing authorization token." }, { status: 401 });
    }

    const { auth, firestore } = getFirebaseAdmin();

    const decoded = await auth.verifyIdToken(idToken).catch(() => null);
    if (!decoded || decoded.email !== SUPER_ADMIN_EMAIL) {
      return NextResponse.json({ success: false, error: "Super Admin clearance required." }, { status: 403 });
    }

    const data = await req.json();
    const { name, email, password, role, salary, accessiblePortals } = data;

    if (!name || !email || !password) {
      return NextResponse.json({ success: false, error: "Name, email and password are required." }, { status: 400 });
    }

    const newUser = await auth.createUser({
      email,
      password,
      displayName: name,
    });

    await firestore.collection("users").doc(newUser.uid).set({
      uid: newUser.uid,
      email,
      displayName: name,
      role: role || "staff",
      salary: Number(salary) || 0,
      accessiblePortals: Array.isArray(accessiblePortals) ? accessiblePortals : [],
      joinedAt: new Date(),
    });

    return NextResponse.json({ success: true, uid: newUser.uid });
  } catch (err: any) {
    console.error("HITECH Worker Provisioning Error:", err);
    const message = err?.code === "auth/email-already-exists"
      ? "An account with this email already exists."
      : err?.message || "Failed to provision worker.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
