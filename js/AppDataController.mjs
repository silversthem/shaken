/*
	Represents all the data in the app
	Basically an extension of the DataController class tailored for the app
*/

import {DataController} from './app/DataController.mjs'

export class AppDataController extends DataController {
	// loads all app data on class construction
	constructor(events) {
		super({
			"cocktails":"./data/cocktails.json",
			"tags":"./data/tags.json",
			"cocktailsDetails": "./data/cocktails_details.json"}, events)
	}

	/* Data Manipulation */

	// Returns a list of tags matching the query for autocompletion
	// sorted by relevance
	autocompleteSuggestions(query) {
		// searching tags matching current input
		let founds = {}
		if (query.length > 0) {
			for (const tagid in this.tags) {
				if (this.tags[tagid].toLowerCase().indexOf(query.toLowerCase()) == 0) {
					founds[tagid] = this.tags[tagid]
				}
			}
		} else { // empty value, display everything
			founds = this.tags
		}
		return founds
	}

	// Searches cocktails matching the tags ids
	// returns a list of all matching cocktails sorted by common tags 
	searchCocktailsByTags(searchTags) {
		let tags = [] // list of tags by name
		for(const tagid of searchTags) {
			tags.push(this.tags[tagid])
		}
		// searching cocktails list
		let results = []
		for (const name in this.cocktails) {
			let cocktail = this.cocktails[name]
			// we make an object of all the ingredients to find, 0 if not found 1 if found
			let matchedIngredients = {}
			for (const ingredient of tags) {
				matchedIngredients[ingredient] = 0
			}
			// we search the ingredients
			for (const ingredient of cocktail) {
				if (ingredient["tag"] in matchedIngredients) {
					matchedIngredients[ingredient["tag"]] = 1
				}
			}
			// we check the state of the search object
			let score = 0
			for (const ingredient in matchedIngredients) {
				score += matchedIngredients[ingredient]
			}
			// Adding all positive score to the results
			if (score > 0) {
				results.push({ "name": name, "score": score, "matches": matchedIngredients })
			}
		}
		// sorting results by score, descending order
		results.sort((a, b) => b.score - a.score)
		return results
	}
}