<script lang="ts">
	import { applyAction, enhance } from "$app/forms"
	import { page } from "$app/stores"
	import { Alert } from "flowbite-svelte"

	let email: string
	let password: string
</script>

<div class="flex flex-col mt-6">
	<h2 class=" text-xl font-bold mx-auto mb-4">Login</h2>
	<p class="mb-4 text-center w-1/2 sm:w-1/5 mx-auto">
		Login below or create an account to get started.
	</p>
	<form
		method="POST"
		action="/auth?/login"
		class="flex flex-col w-1/2 sm:w-1/4 mx-auto gap-2"
		use:enhance={({ formElement }) => {
			return async ({ result, update }) => {
				if (result.status === 200) {
					formElement.reset()
				}

				if (result.status === 500) {
					await applyAction(result)
					formElement.reset()
				}
				update()
			}
		}}
	>
		<input
			type="email"
			name="email"
			bind:value={email}
			placeholder="your@email.com"
			class="w-full px-3 bg-white border border-slate-300 rounded-md text shadow-sm placeholder-slate-400
      focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
      invalid:border-pink-500 invalid:text-pink-600
      focus:invalid:border-pink-500 focus:invalid:ring-pink-5000"
		/>
		<input
			type="password"
			name="password"
			bind:value={password}
			placeholder="password"
			class="w-full px-3 bg-white border border-slate-300 rounded-md text shadow-sm placeholder-slate-400
      focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500
      invalid:border-pink-500 invalid:text-pink-600
      focus:invalid:border-pink-500 focus:invalid:ring-pink-5000"
		/>
		<button
			class="shadow text-white p-1 rounded-lg bg-orange-500 border-none hover:bg-orange-600"
			>Login</button
		>
		<div class="flex flex-col sm:flex-row gap-2">
			<a href="/auth/register" class="w-full sm:w-1/2">
				<button
					class="shadow py-1 w-full text-center text-white rounded-lg bg-orange-400 border-none hover:bg-orange-500"
					>Create account</button
				>
			</a>
			<a href="/auth/reset" class="w-full sm:w-1/2">
				<button
					class="shadow py-1 w-full text-center text-white rounded-lg bg-orange-400 border-none hover:bg-orange-500"
					>Reset password</button
				>
			</a>
		</div>
		{#if $page.status === 500}
			<Alert dismissable>
				<span class="">{$page.form?.message}</span>
			</Alert>
		{/if}
	</form>
</div>
