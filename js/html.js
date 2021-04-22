/*
    All the functions used to create dom elements
*/


// Creates a div for the autocomplete in the searchbar
function createAutocompletedDiv(tag, action) {
    let div = document.createElement('div')
	div.setAttribute('class', 'autocompleted')
	div.innerText = tag
	// adding event listener
	div.addEventListener('click', action)
    return div
}

// Creates a div for a selected tag in the searchbar
function createSearchTagDiv(tag, buttonAction) {
    // Creating the div, the textnode and the button
    let div = document.createElement('div')
	let tagText = document.createTextNode(tag)
	let deleteButton = document.createElement('button')
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
function createResultDiv(cocktailName, matches, isPerfectScore = False) {
    let div = document.createElement('div')
	div.setAttribute('class', 'result')
	// making link
	let n = document.createElement('a')
	if(isPerfectScore) {
		n.setAttribute('class', 'perfect-match')
	}
	n.setAttribute('href', '#' + cocktailName)
	n.innerText = cocktailName
	// printing tag match results
	let p = document.createElement('p')
	for(const match in matches) {
		let e = document.createElement('span')
		e.innerText = match
		if(matches[match]) { // ingredient is in
			e.setAttribute('class', 'is-in')
		} else {
			e.setAttribute('class', 'is-not-in')
		}
		p.appendChild(e)
	}
	div.appendChild(n)
	div.appendChild(p)
	return div
}

// Creates the dom for a focused result in the main content
function createFocusResultDiv() {

}