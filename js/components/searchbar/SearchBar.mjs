/*
	This class represents the autocomplete searchbar for ingredients
	It takes 1 app event, addTag
*/

import { Component } from '/js/app/Component.mjs'

export class SearchBar extends Component {
	mount() {
		// binding input field events
		this.input.addEventListener('focus', () => this.autocompleteIngredients())
		this.input.addEventListener('input', () => this.autocompleteIngredients())
		this.input.addEventListener('focusout', () => this.closeAutocomplete())
		// binding keyboard events when autocomplete is focused
		document.addEventListener('keydown', (event) => {
			let key = event.key // Key press, we're looking for arrows and Enter
			let actionObj = {}
			// if the search bar is focused, key presses correspond to action on the autocomplete
			if (document.activeElement == document.getElementById('cocktail-add-ingredient')) {
				actionObj = {
					'ArrowUp': () => this.scrollUpAutocompletedDiv(), // scrolls up one suggestion
					'ArrowDown': () => this.scrollDownAutocompletedDiv(), // scrolls down on suggestion
					'ArrowRight': () => this.fillWithAutocompletedDiv(), // fills autocomplete
					'Enter': () => this.validateCurrentAutocompletedDiv() // validates autocomplete
				}
				// calling the action corresponding to the key
				if (key in actionObj) {
					actionObj[key]()
				}
			}
		})
	}

	/* autocomplete divs creation function */

	// creates the dom for an element inside the autocomplete div
	createAutocompletedDiv(tagid, tag) {
		let div = document.createElement('div')
		div.classList.add('autocompleted')
		div.innerText = tag
		const tagClicked = () => {
			this.eventsCaller.addTag(tagid);
			this.input.value = '';
			this.autocompleteDiv.innerHTML = '';
		}
		div.addEventListener('click', tagClicked)
		div.dataset.value = tagid
		return div
	}

	/* Autocompletion on input function */

	autocompleteIngredients() {
		// clearing autocomplete list
		this.autocompleteDiv.innerHTML = ''
		// searching tags matching current input
		let founds = this.dataController.autocompleteSuggestions(this.input.value)
		// printing autocomplete
		for (const foundid in founds) {
			this.autocompleteDiv.appendChild(this.createAutocompletedDiv(foundid, founds[foundid]))
		}
		// adjusting autocomplete data
		this.autocompleteDiv.total = Object.keys(founds).length
		this.autocompleteDiv.current = 0
		this.setFocusAutocompletedDiv(0)
	}

	// closes autocomplete div when input field out of focus
	// on a timeout because if we click on an element in the div, the input field loses focus
	// and if we close it right away, the click event isn't dispatched
	closeAutocomplete() {
		setTimeout(() => {
			this.autocompleteDiv.innerHTML = ''
		}, 100)
	}

	/* Scrolling down the searchbar functions */

	// sets the nth autocomplete suggestion as active and returns it
	setFocusAutocompletedDiv(nth) {
		// removing focus from node if any
		if (this.autocompleteDiv.currentFocusedDiv) {
			this.autocompleteDiv.currentFocusedDiv.classList.remove('active-autocomplete')
		}
		this.autocompleteDiv.currentFocusedDiv = null
		// finding node to focus on
		let i = 0
		for (const node of this.autocompleteDiv.childNodes) {
			if (node.nodeType == Node.ELEMENT_NODE) {
				if (i == nth) { // node found
					this.autocompleteDiv.current = nth
					this.autocompleteDiv.currentFocusedDiv = node
					node.classList.add('active-autocomplete')
					node.scrollIntoView({ block: "nearest" })
					break
				}
				i++;
			}
		}
	}

	// sets the nth-1 autocompleted suggestion as active
	scrollUpAutocompletedDiv() {
		if (this.autocompleteDiv.current == 0) { // if we're at the first element we go back to the last
			this.autocompleteDiv.current = this.autocompleteDiv.total - 1
		} else { // else we go back by one
			this.autocompleteDiv.current = this.autocompleteDiv.current - 1
		}
		this.setFocusAutocompletedDiv(this.autocompleteDiv.current)
	}

	// sets the nth+1 autocompleted suggestion as active
	scrollDownAutocompletedDiv() {
		if (this.autocompleteDiv.current == (this.autocompleteDiv.total - 1)) { // if we're at the last element we go back to the first
			this.autocompleteDiv.current = 0
		} else { // else we go next by one
			this.autocompleteDiv.current = 1 + this.autocompleteDiv.current
		}
		this.setFocusAutocompletedDiv(this.autocompleteDiv.current)
	}

	// fills up the input with the completed div value
	fillWithAutocompletedDiv() {
		if (this.autocompleteDiv.currentFocusedDiv) {
			this.input.value = this.autocompleteDiv.currentFocusedDiv.innerText
			this.autocompleteIngredients() // re starting the search
		}
	}

	// validates the active suggestion
	validateCurrentAutocompletedDiv() {
		if (this.autocompleteDiv.currentFocusedDiv) {
			this.autocompleteDiv.currentFocusedDiv.click() // hitting enter on a selected div is the same as clicking on it
		}
	}
}