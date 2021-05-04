/*
	This class represents the displayed results
	It takes the selected tags and all the available cocktails from the app
	and emits 2 app event, focusResult and addTag
*/

export class ResultsDisplay {
	// creates the component
	constructor(resultsDiv, tags, cocktailsList, onFocusEvent, onTagClickEvent) {
		this.tags = tags
		this.cocktails = cocktailsList
		this.resultsDiv = resultsDiv
		this.onFocusEvent = onFocusEvent
		this.onTagClickEvent = onTagClickEvent
		this.selectedTags = new Set()
	}
	// creates a result div
	createResultDiv(name, matches, isPerfectScore) {
		let div = document.createElement('div')
		div.classList.add('result')
		div.dataset.resultCocktailName = name
		if (isPerfectScore) {
			div.classList.add('perfect-match')
		} else {
			div.classList.add('partial-match')
		}
		// making title
		let title = document.createElement('h3')
		title.innerText = name
		// Adding click event on title
		title.addEventListener('click', () => this.onFocusEvent(name))
		// printing ingredients & result
		let tagsDiv = document.createElement('div')
		// printing all ingredients of the cocktails, bolding the ones matching the search
		for (const ingredient of this.cocktails[name]) {
			let tag = document.createElement('span')
			tag.innerText = ingredient.ingredient
			tag.dataset.value = this.tags.indexOf(ingredient.tag)
			if (ingredient.tag in matches && matches[ingredient.tag]) {
				tag.classList.add('is-in')
			} else {
				tag.classList.add('is-not-mentionned')
				// adding action to add the tag on click
				tag.addEventListener('click', () => this.onTagClickEvent(tag.dataset.value))
			}
			tagsDiv.appendChild(tag)
		}
		// printing all the ingredients searched not in the cocktail
		for (const match in matches) {
			if (matches[match] == 0) {
				let tag = document.createElement('span')
				tag.innerText = match
				tag.classList.add('is-not-in')
				tagsDiv.appendChild(tag)
			}
		}
		div.appendChild(title)
		div.appendChild(tagsDiv)
		return div
	}
	// checks if the new selected tags are equivalent to the previous ones
	haveTagsChanged(selectedTags) {
		// different length means change
		if(selectedTags.size != this.selectedTags.size) {
			return true
		}
		// if any element in the first set is not in the second set, elements have changed
		// it's not possible for 2 sets to be the same size and the same unless all the
		// elements from the first are also in the second (duh.)
		for(let i = 0; i < selectedTags.size; i++) {
			if(!this.selectedTags.has(selectedTags[i])) {
				return true
			}
		}
		return false
	}
	// Hides results
	hide() {
		this.resultsDiv.innerHTML = ''
	}
	// updates search
	updateSearch(selectedTags) {
		// only updating tags if they have changed
		if(!this.haveTagsChanged(selectedTags)) return;
		// listing all tag names to search
		// we make a copy of the selected tags set because we want to compare them by content
		// and have this set not mutate when the other one does, otherwise it's pointless
		this.selectedTags = new Set(selectedTags)
		let tags = [] // this is a map of the tags where the name is the key, it's used to translate back to it later
		for(const tagid of this.selectedTags) {
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
		// printing results
		this.resultsDiv.innerHTML = ''
		let perfectScore = tags.length
		for (const result of results) {
			this.resultsDiv.appendChild(this.createResultDiv(result.name, result.matches, perfectScore == result.score))
		}
	}
}