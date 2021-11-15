/*
	This class represents the catalog, a display of all the cocktails in alphabetical order
	it takes on event from the app, onFocusEvent and it takes the cocktails data
*/

import {Component} from './../../app/Component.mjs'

export class Catalog extends Component {
	mount() {
		// creating buckets
		this.buckets = {}
		'abcdefghijklmnopqrstuvwxyz#'.split('').forEach(x => this.buckets[x] = []);
		this.sortCocktails()
	}
	// Sorts cocktails by buckets using the first letter in their name (cocktails not starting with a letter will go in the # bucket)
	sortCocktails() {
		for(const cocktailName in this.dataController.cocktails) {
			const firstLetter = cocktailName[0]
			if(firstLetter.toLowerCase() in this.buckets) {
				this.buckets[firstLetter.toLowerCase()].push(cocktailName)
			} else {
				this.buckets['#'].push(cocktailName)
			}
		}
	}
	// Creates a div from a bucket
	createBucketDiv(name, bucket) {
		let div = document.createElement('div')
		div.classList.add('catalog-bucket')
		let h3 = document.createElement('h3')
		h3.innerText = name.toUpperCase()
		div.appendChild(h3)
		for(const cocktail of bucket) {
			div.appendChild(this.createEntry(cocktail))
		}
		return div
	}
	// Creates an entry for a cocktail 
	createEntry(cocktailName) {
		let entry = document.createElement('div')
		entry.classList.add('catalog-entry')
		entry.innerText = cocktailName
		// binding clickEvent
		entry.addEventListener('click', () => {this.eventsCaller.focusResult(cocktailName)})
		return entry
	}
	// Hides catalog
	hide() {
		this.catalogDiv.innerHTML = ''
	}
	// Displays catalog
	displayCatalog() {
		this.catalogDiv.innerHTML = ''
		for(const bucket in this.buckets) {
			if(this.buckets[bucket].length > 0) {
				let div = this.createBucketDiv(bucket, this.buckets[bucket])
				this.catalogDiv.appendChild(div)
			}
		}
	}
}