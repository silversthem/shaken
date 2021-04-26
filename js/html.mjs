/*
    All the functions used to create dom elements
*/

import {cocktails} from '/data/cocktails_iba_final.mjs'

// Creates a div for the autocomplete in the searchbar
export function createAutocompletedDiv(tag, action) {
    let div = document.createElement('div')
	div.setAttribute('class', 'autocompleted')
	div.innerText = tag
	// adding event listener
	div.addEventListener('click', action)
    return div
}

// Creates a div for a selected tag in the searchbar
export function createSearchTagDiv(tag, buttonAction) {
    // Creating the div, the span and the button
    let div = document.createElement('div')
	let tagText = document.createElement('span')
	let deleteButton = document.createElement('button')
	tagText.innerText = tag
    // adding the click event to the button
	deleteButton.setAttribute('class', 'delete-button')
	deleteButton.innerText = 'x'
	deleteButton.addEventListener('click', buttonAction)
    // updating the div with the tag data and the dom elements
	div.dataset.value = tag
	div.appendChild(tagText)
	div.appendChild(deleteButton)
	return div
}

// Creates a search result in the main content
export function createResultDiv(cocktailName, matches, isPerfectScore = False) {
    let div = document.createElement('div')
	div.classList.add('result')
	if(isPerfectScore) {
		div.classList.add('perfect-match')
	} else {
		div.classList.add('partial-match')
	}
	// making title
	let title = document.createElement('h3')
	title.innerText = cocktailName
	// printing ingredients & result
	let tagsDiv = document.createElement('div')
	// printing all ingredients of the cocktails, bolding the ones matching the search
	for(const ingredient of cocktails[cocktailName]) {
		let tag = document.createElement('span')
		tag.innerText = ingredient.tag
		if(ingredient.tag in matches && matches[ingredient.tag]) {
			tag.classList.add('is-in')
		} else {
			tag.classList.add('is-not-mentionned')
			// adding action to add the tag on click
			tag.addEventListener('click', () => {addSearchTag(ingredient.tag)})
		}
		tagsDiv.appendChild(tag)
	}
	// printing all the ingredients searched not in the cocktail
	for(const match in matches) {
		if(matches[match] == 0) {
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

// Creates the dom for a focused result in the main content
export function createFocusResultDiv() {

}