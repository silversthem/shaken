/*
    Contains all functions related to the searchbar
*/

import * as HTML from '/js/html.mjs'
import {cocktails} from '/data/cocktails_iba_final.mjs'
import {tags} from '/data/tags.mjs'

// dom elements of the searchbar
export const autocompleted_list = document.getElementById('autocomplete-list')
export const searchbar_input = document.getElementById('cocktail-add-ingredient')
export const selected_ingredients_list = document.getElementById('selected-ingredients')

//	Called everytime the input on the search bar changes, updates the autocomplete for the ingredients
export function autocompleteIngredients() {
	// clearing autocomplete list
	autocompleted_list.innerHTML = ''
	// searching tags matching current input
	let value = searchbar_input.value
	let founds = []
	if(value.length > 0) {
		for(const tag of tags) {
			if(tag.indexOf(value) == 0) {
				founds.push(tag)
			}
		}
	} else { // empty value, display everything
		founds = tags
	}
	// printing autocomplete
	for(const found of founds) {
		// on a click on an autocompleted div, we add the tag to the search and reset the input and the autocomplete list
		let action = () => {addSearchTag(found); searchbar_input.value = ''; autocompleted_list.innerHTML = '';}
		autocompleted_list.appendChild(HTML.createAutocompletedDiv(found, action))
	}
	// adjusting autocomplete data
	autocompleted_list.total = founds.length
	autocompleted_list.current = 0
	setFocusAutocompletedDiv(0)
}

// closes autocomplete div
/* we do this on a delay because the autocomplete div is supposed to disappear when the search input loses focus
but that happens when we click on an autocompletion suggestion, so it needs a little time for the click event to
happen before the div closes */
export function closeAutocomplete() {
	setTimeout(() => {
		autocompleted_list.innerHTML = ''
	}, 100)
}

// sets the nth autocomplete suggestion as active and returns it
function setFocusAutocompletedDiv(nth) {
	// removing focus from node if any
	if(autocompleted_list.currentFocusedDiv) {
		autocompleted_list.currentFocusedDiv.classList.remove('active-autocomplete')
	}
	autocompleted_list.currentFocusedDiv = null
	// finding node to focus on
	let i = 0
	for(const node of autocompleted_list.childNodes) {
		if(node.nodeType == Node.ELEMENT_NODE) {
			if(i == nth) { // node found
				autocompleted_list.current = nth
                autocompleted_list.currentFocusedDiv = node
				node.classList.add('active-autocomplete')
				node.scrollIntoView({block: "nearest"})
				break
			}
			i++;
		}
	}
}

// sets the nth-1 autocompleted suggestion as active
export function scrollUpAutocompletedDiv() {
    if(autocompleted_list.current == 0) { // if we're at the first element we go back to the last
        autocompleted_list.current = autocompleted_list.total - 1
    } else { // else we go back by one
        autocompleted_list.current = autocompleted_list.current - 1
    }
    setFocusAutocompletedDiv(autocompleted_list.current)
}

// sets the nth+1 autocompleted suggestion as active
export function scrollDownAutocompletedDiv() {
    if(autocompleted_list.current == (autocompleted_list.total - 1)) { // if we're at the last element we go back to the first
        autocompleted_list.current = 0
    } else { // else we go next by one
        autocompleted_list.current = 1 + autocompleted_list.current
    }
    setFocusAutocompletedDiv(autocompleted_list.current)
}

// fills up the input with the completed div value
export function fillWithAutocompletedDiv() {
    if(autocompleted_list.currentFocusedDiv) {
        searchbar_input.value = autocompleted_list.currentFocusedDiv.innerText
        autocompleteIngredients() // re starting the search
    }
}

// validates the active suggestion
export function validateCurrentAutocompletedDiv() {
    if(autocompleted_list.currentFocusedDiv) {
        autocompleted_list.currentFocusedDiv.click() // hitting enter on a selected div is the same as clicking on it
    }
}

// Returns all tags as an array of string from the searchbar (#selected-ingredients div)
function readSearchTags() {
	let ingredients = []
	for(const node of selected_ingredients_list.childNodes) {
		if(node.nodeType == Node.ELEMENT_NODE) {
			ingredients.push(node.dataset.value)
		}
	}
	return ingredients
}

// Adds a tag to the search & updates the search
export function addSearchTag(tag) {
	// not adding a tag already in the list
	if(readSearchTags().includes(tag)) {
		return;
	}
	// Adding the tag & setting the delete action on the button with the tag
	let deleteAction = () => {deleteSearchTag(tag)}
	selected_ingredients_list.appendChild(HTML.createSearchTagDiv(tag, deleteAction))
	// updating the search
	searchCocktails()

}

// Deletes a tag from the search & updates search
export function deleteSearchTag(tag) {
	for(const node of selected_ingredients_list.childNodes) {
		if(node.nodeType == Node.ELEMENT_NODE && node.dataset.value == tag) {
			selected_ingredients_list.removeChild(node)
		}
	}
	// updates search
	searchCocktails()
}

// Searches data by tags, and prints results based on most coherent (has most tags in common)
export function searchCocktails() {
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
	// creates a callback to call when a tag gets clicked
	const tagClickEvent = (tag) => {return () => {addSearchTag(tag)}}
	for(const result of results) {

		resultsDiv.appendChild(HTML.createResultDiv(result.name, result.matches, tagClickEvent, perfectScore == result.score))
	}
}