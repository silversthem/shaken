/*
	This class represents the tag list on the searchbar
	It takes 1 app event, deleteTag and selected tag data from the app
*/

import {Component} from './../../app/Component.mjs'

export class TagList extends Component {
	mount() {

	}
	// creates a tag div with a delete button inside the tag list
	createTagDiv(tagid, tag) {
		// Creating the div, the span and the button
		let div = document.createElement('div')
		let tagText = document.createElement('span')
		let deleteButton = document.createElement('span')
		tagText.innerText = tag
		// adding the click event to the button
		deleteButton.setAttribute('class', 'delete-button')
		deleteButton.addEventListener('click', () => this.eventsCaller.deleteTag(tagid))
		// updating the div with the tag data and the dom elements
		div.dataset.value = tag
		div.appendChild(tagText)
		div.appendChild(deleteButton)
		return div
	}
	// updates tag list with the list of selected tags
	update(selectedTags) {
		this.tagsDiv.innerHTML = '' // emptying tag list
		// appending tags one by one
		for(const tagid of selectedTags) {
			if(tagid in this.dataController.tags) {
				this.tagsDiv.appendChild(this.createTagDiv(tagid, this.dataController.tags[tagid]))
			} else {
				console.error('No tag with id ' + tagid)
			}
		}
	}
}