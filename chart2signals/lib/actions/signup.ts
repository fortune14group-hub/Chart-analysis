"use server";

import { isEmail, isNonEmpty } from "@/lib/utils/validators";
import { redirect } from "next/navigation";

type Form = { name: string; email: string; company?: string; note?: string; website?: string };

export async function submitProSignup(data: Form) {
  if (data.website && data.website.trim().length > 0) redirect("/thanks?m=ok");
  if (!isNonEmpty(data.name, 2)) throw new Error("Ange ett namn (minst 2 tecken).");
  if (!isEmail(data.email)) throw new Error("Ogiltig e-postadress.");
  redirect("/thanks?m=ok");
}
