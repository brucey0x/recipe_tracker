import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from "$env/static/public"
import { createSupabaseLoadClient } from "@supabase/auth-helpers-sveltekit"
import type { User } from "@supabase/supabase-js"
import { user } from "../stores/authStore.js"
import { recipes } from "../stores/recipeStore.js"
import type { Database } from "../types/supabase.js"

export const load = async ({ fetch, data, depends }) => {
	recipes.set(data.initialRecipes)

	depends("supabase:auth")

	const supabase = createSupabaseLoadClient<Database>({
		supabaseUrl: PUBLIC_SUPABASE_URL,
		supabaseKey: PUBLIC_SUPABASE_ANON_KEY,
		event: { fetch },
		serverSession: data.session
	})

	const {
		data: { session }
	} = await supabase.auth.getSession()

	const initialUser: User | null = session?.user ?? null
	user.set(initialUser)

	return { supabase, session, initialUser }
}
