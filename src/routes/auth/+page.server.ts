import { fail, redirect, type Actions } from "@sveltejs/kit"

export const actions: Actions = {
	signup: async ({ request, url, locals: { supabase } }) => {
		const formData = await request.formData()
		const email = formData.get("email") as string
		const password = formData.get("password") as string

		const { error } = await supabase.auth.signUp({
			email,
			password,
			options: {
				emailRedirectTo: `${url.origin}/auth/callback`
			}
		})

		if (error) {
			return fail(500, { message: "Error. Try again.", success: false, email })
		}

		console.log("User signed up with: ", email, password)
		throw redirect(302, "/")

		// return {
		// 	message: "Please check your email for a magic link to log into the website.",
		// 	success: true
		// }
	},
	login: async ({ request, url, locals: { supabase } }) => {
		const formData = await request.formData()
		const email = formData.get("email") as string
		const password = formData.get("password") as string

		const { error } = await supabase.auth.signInWithPassword({
			email,
			password
		})

		if (error) {
			return fail(500, {
				message: "Error. Try again.",
				success: false,
				email,
				type: "failure"
			})
		}

		console.log("User logged in with: ", email)
		throw redirect(302, "/")
		// return {
		// 	success: true
		// }
	},
	logout: async ({ locals: { supabase } }) => {
		const { error } = await supabase.auth.signOut()

		if (error) {
			return fail(500, { message: "Error. Try again.", success: false })
		}

		console.log("User logged out")
		throw redirect(302, "/")

		// return {
		// 	message: "Logged out.",
		// 	success: true
		// }
	},
	reset: async ({ request, url, locals: { supabase } }) => {
		const formData = await request.formData()
		const email = formData.get("email") as string

		const { error } = await supabase.auth.resetPasswordForEmail(email, {
			redirectTo: `${url.origin}/auth/callback?next=/auth/reset/newpw`
		})

		if (error) {
			return fail(500, { message: "Error. Try again.", success: false, email })
		}

		console.log(
			"Password reset email sent with redirect URL:",
			`${url.origin}/auth/callback?next=/auth/reset/newpw`
		)

		alert(
			`Password reset email sent with redirect URL: ${url.origin}/auth/callback?next=/auth/reset/newpw`
		)

		return {
			message: "Please check your email for a magic link to log into the website.",
			success: true
		}
	},
	updatePassword: async ({ request, url, locals: { supabase } }) => {
		const formData = await request.formData()
		const newPassword = formData.get("password") as string

		const { error } = await supabase.auth.updateUser({
			password: newPassword
		})

		if (error) {
			return fail(500, { message: "Server error. Try again later.", success: false })
		}

		console.log("Password updated.")

		return {
			message: "Password updated.",
			success: true
		}
	}
}
