import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers"

/**
 * サーバーコンポーネント用supabase
 * @returns supabase
 */
export const supabaseServer = () => {
    cookies().getAll();
    return createServerComponentClient({ cookies });
}