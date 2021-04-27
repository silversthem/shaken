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
export function createResultDiv(cocktailName, matches, tagClickEvent, isPerfectScore = False) {
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
	// Adding click event on title
	title.addEventListener('click', () => {showFocusResultDiv(cocktailName, cocktails[cocktailName])})
	// printing ingredients & result
	let tagsDiv = document.createElement('div')
	// printing all ingredients of the cocktails, bolding the ones matching the search
	for(const ingredient of cocktails[cocktailName]) {
		let tag = document.createElement('span')
		tag.innerText = ingredient.ingredient
		tag.dataset.value = ingredient.tag
		if(ingredient.tag in matches && matches[ingredient.tag]) {
			tag.classList.add('is-in')
		} else {
			tag.classList.add('is-not-mentionned')
			// adding action to add the tag on click
			tag.addEventListener('click', tagClickEvent(tag.dataset.value))
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

// Transitions between different heights for the focused element div
function startFocusDivRollup(previousHeight, nextHeight) {
	const resultFocus = document.getElementById('focused-result')
	const PAS = 10
	// somehow changing the height doesnt work but this does
	// im not sure why, maybe look into it
	const changeHeight = (newHeight) => {
		resultFocus.style.minHeight = newHeight + 'px';
		resultFocus.style.maxHeight = newHeight + 'px';
	}
	if(Math.abs(previousHeight - nextHeight) <= PAS) {
		changeHeight(nextHeight)
		return
	}
	changeHeight(previousHeight)
	const iterator = (previousHeight > nextHeight) ? -PAS : PAS
	let counter = previousHeight
	const interval = setInterval(() => {
		if(Math.abs(counter - nextHeight) <= PAS) {
			changeHeight(nextHeight)
			console.log('*', nextHeight)
			clearInterval(interval)
		}
		counter += iterator
		changeHeight(counter)
	}, 25)
}

// Creates the dom for a focused result in the main content
export function showFocusResultDiv(name, cocktail) {
	const resultFocus = document.getElementById('focused-result')
	// getting the current height of the div
	const currentHeight = resultFocus.offsetHeight
	// displaying the div
	resultFocus.style.display = 'block'
	// creating the result div to display
	const div = createFocusResultDiv(name, cocktail)
	// creating a fake div, inserting it as a hidden absolute container
	// in the body to get a default height for the result div container
	// this is dumb but it works so...
	const fakeDiv = document.createElement('div')
	fakeDiv.style.visibility = 'hidden'
	fakeDiv.style.position = 'absolute'
	fakeDiv.appendChild(div)
	document.body.appendChild(fakeDiv)
	const nextHeight = fakeDiv.offsetHeight
	document.body.removeChild(fakeDiv)
	// showing the result div and starting the transition between the heights
	resultFocus.innerHTML = fakeDiv.innerHTML
	console.log(currentHeight, nextHeight)
	startFocusDivRollup(currentHeight, nextHeight)
}

function createFocusResultDiv(name, cocktail) {
	let div = document.createElement('div')
	let titleDiv = document.createElement('h1')
	titleDiv.innerText = name
	let ingList = document.createElement('ul')
	for(const ingredient of cocktail) {
		let ingLi = document.createElement('li')
		ingLi.innerText = ingredient.ingredient
		ingList.appendChild(ingLi)
	}
	div.appendChild(titleDiv)
	div.appendChild(ingList)
	return div
}