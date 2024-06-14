import { Database } from "@/app/type/database.types";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers"

/**
 * Supabase(API用)
 * @returns createRouteHandlerClient
 */
export const supabaseRouteHandleClient = () => {
    //cookies().getAll();
    //return createRouteHandlerClient<Database>({ cookies });
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        throw new Error('Missing Supabase URL or Anon Key');
    }

    console.log(`Supabase URL: ${supabaseUrl}`);
    console.log(`Supabase Key: ${supabaseKey}`);

    const supabaseClient =  createRouteHandlerClient<Database>({
        cookies: () => cookies()
    }, {
        supabaseUrl,
        supabaseKey
    });

    console.log('Supabase Client initialized', supabaseClient);
    return supabaseClient;
}