/*
	This class represents the displayed results
	It takes the selected tags and all the available cocktails from the app
	and emits 2 app event, focusResult and addTag
*/

import {Component} from '/js/app/Component.mjs'

export class ResultsDisplay extends Component {
	mount() {
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
		title.addEventListener('click', () => this.eventsCaller.focusResult(name))
		// printing ingredients & result
		let tagsDiv = document.createElement('div')
		// printing all ingredients of the cocktails, bolding the ones matching the search
		for (const ingredient of this.dataController.cocktails[name]) {
			let tag = document.createElement('span')
			tag.innerText = ingredient.ingredient
			tag.dataset.value = this.dataController.tags.indexOf(ingredient.tag)
			if (ingredient.tag in matches && matches[ingredient.tag]) {
				tag.classList.add('is-in')
			} else {
				tag.classList.add('is-not-mentionned')
				// adding action to add the tag on click
				tag.addEventListener('click', () => this.eventsCaller.addTag(tag.dataset.value))
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
		// saving new tags to avoid researching the same tags
		this.selectedTags = new Set(selectedTags)
		let results = this.dataController.searchCocktailsByTags(this.selectedTags)
		this.resultsDiv.innerHTML = ''
		let perfectScore = selectedTags.size
		for (const result of results) {
			this.resultsDiv.appendChild(this.createResultDiv(result.name, result.matches, perfectScore == result.score))
		}
	}
}