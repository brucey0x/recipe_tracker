import type { SupabaseClient } from "@supabase/supabase-js"
import { v4 as uuidv4 } from "uuid"

const cdnUrl =
	"https://kfzeokcflwatdsxiprwl.supabase.co/storage/v1/object/public/meal-pics/scrambled-eggs-1bd9e5da-1220-4cf9-a01c-e07cc1bada8c"

export function toSlug(str: string) {
	return (
		str
			// Convert to lowercase
			.toLowerCase()
			// Replace spaces with hyphens
			.replace(/\s+/g, "-")
			// Remove all non-word chars
			.replace(/[^\w\-]+/g, "")
			// Replace multiple hyphens with a single hyphen
			.replace(/\-\-+/g, "-")
	)
}

export async function handleFileInput(event, recipeName: string, supabase: SupabaseClient) {
	const recipeSlug: string = toSlug(recipeName)

	const file = event.target.files[0]
	if (!file) {
		console.error("No file uploaded.")
		return
	}

	const { data, error } = await supabase.storage
		.from("meal-pics")
		.upload(recipeSlug + "-" + uuidv4(), file)

	if (data) {
		// something to pull the image and upload it on the recipe.
		console.log("File uploaded successfully. Data: ", data)
		return await getImage(data.path, supabase)
	}
	if (error) {
		console.error(error)
		return
	}
}

async function getImage(path: string, supabase: SupabaseClient) {
	const { data } = await supabase.storage.from("meal-pics").getPublicUrl(path)

	if (data) {
		// something to pull the image and upload it on the recipe.
		console.log("Image URL successfully pulled: ", data)
		return data.publicUrl
	}
}

export async function deleteImage(imageName: string, SupabaseClient: SupabaseClient) {
	const { error } = await SupabaseClient.storage.from("meal-pics").remove(imageName)

	if (error) {
		console.error(error)
		return
	}
}
