
/*
	Contains all the main functions of the page
*/

//	Called everytime the input on the search bar changes, updates the autocomplete for the ingredients
function autocompleteIngredients() {
	// clearing autocomplete list
	let autocompleted = document.getElementById('autocomplete-list')
	autocompleted.innerHTML = ''
	// searching tags matching current input
	let input = document.getElementById('cocktail-add-ingredient')
	let value = input.value
	let founds = []
	if(value.length > 0) {
		for(tag of tags) {
			if(tag.indexOf(value) == 0) {
				founds.push(tag)
			}
		}
	}
	// printing autocomplete
	for(const found of founds) {
		// on a click on an autocompleted div, we add the tag to the search and reset the input
		let action = () => {addSearchTag(found); input.value = ''}
		autocompleted.appendChild(createAutocompletedDiv(found, action))
	}
}


// Adds a tag to the search & updates the search
function addSearchTag(tag) {
	// Adding the tag & setting the delete action on the button with the tag
	let list = document.getElementById('selected-ingredients')
	let deleteAction = () => {deleteSearchTag(tag)}
	list.appendChild(createSearchTagDiv(tag, deleteAction))
	// updating the search
	searchCocktails()

}

// Deletes a tag from the search & updates search
function deleteSearchTag(tag) {
	let list = document.getElementById('selected-ingredients')
	for(const node of list.childNodes) {
		if(node.nodeType == Node.ELEMENT_NODE && node.dataset.value == tag) {
			list.removeChild(node)
		}
	}
	// updates search
	searchCocktails()
}

// Returns all tags as an array of string from the searchbar (#selected-ingredients div)
function readSearchTags() {
	let ingredientsDiv = document.getElementById('selected-ingredients')
	let ingredients = []
	for(const node of ingredientsDiv.childNodes) {
		if(node.nodeType == Node.ELEMENT_NODE) {
			ingredients.push(node.dataset.value)
		}
	}
	return ingredients
}

// Searches data by tags, and prints results based on most coherent (has most tags in common)
function searchCocktails() {
	// getting tags
	let taggedIngredients = readSearchTags()
	// searching cocktails
	let results = []
	for(const name in cocktails) {
		let cocktail = cocktails[name]
		// we make an object of all the ingredients to find, 0 if not found 1 if found
		let matchedIngredients = {}
		for(const ingredient of taggedIngredients) {
			matchedIngredients[ingredient] = 0
		}
		// we search the ingredients
		for(const ingredient of cocktail) {
			if(ingredient["tag"] in matchedIngredients) {
				matchedIngredients[ingredient["tag"]] = 1
			}
		}
		// we check the state of the search object
		let score = 0
		for(const ingredient in matchedIngredients) {
			score += matchedIngredients[ingredient]
		}
		// Adding all positive score to the results
		if(score > 0) {
			results.push({"name": name, "score":score, "matches":matchedIngredients})
		}
	}
	// sorting results by score, descending order
	results.sort((a,b) => b.score - a.score)
	// printing results
	let resultsDiv = document.getElementById('results')
	resultsDiv.innerHTML = ''
	let perfectScore = taggedIngredients.length
	for(const result of results) {
		resultsDiv.appendChild(createResultDiv(result.name, result.matches, perfectScore == result.score))
	}
}