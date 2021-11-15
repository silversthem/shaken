/*
	This class represents the focused result element
	it emits 2 app events, addTag and unfocusResult
	and uses tags and the cocktails list as data
*/

import {Component} from '/js/app/Component.mjs'

// The amount of pixel the transition moves by every 33msecs
const PAS = 10

export class FocusedResult extends Component {
	mount() {
		// current focused cocktail name
		this.cocktailName = null
		// intervals for animation
		this.openInterval = false
		this.closeInterval = false
	}
	// returns a domstring parsing the ingredient
	parseIngredient(ingredient) {
		let ingStr = ''
		switch(ingredient.type) {
			case 'cl':
				ingStr += ingredient.quantity + 'cl of '
			break;
			case 'spoon':
				ingStr += ingredient.quantity
				ingStr += ' ' + ingredient.spoon
				ingStr += (ingredient.quantity == 1) ? '' : 's'
				ingStr += ' of '
			break;
			case 'dash':
				ingStr += ingredient.quantity + ' '
				ingStr += (ingredient.quantity == 1) ? 'dash of ' : 'dashes of '
			break;
			case 'drop':
				ingStr += ingredient.quantity + ' '
				ingStr += (ingredient.quantity == 1) ? 'drop of ' : 'drops of '
			break;
			case 'part':
				ingStr += ingredient.quantity + ' '
				ingStr += (ingredient.quantity == 1) ? 'part ' : 'parts '
			break;
			case 'nonnumeric':

			break;
		}
		ingStr += ingredient.ingredient
		return ingStr
	}
	// returns right glass icon
	getGlassIcon(glassType) {
		let src = '/css/assets/icons/'
		let types = {
			'poco grande': src + 'poco_grande.svg',
			'copper mug': src + 'mug.svg',
			'cocktail': src + 'cocktail.svg',
			'aperol spritz': src + 'spritz.svg',
			'champagne flute': src + 'flute.svg',
			'hurricane': src + 'hurricane.svg',
			'rocks': src + 'old_fashioned.svg',
			'zombie': src + 'collins.svg',
			'highball': src + 'highball.svg',
			'tumbler': src + 'tumbler.svg',
			'collins': src + 'collins.svg',
			'old fashioned': src + 'old_fashioned.svg',
			'wine': src + 'wine.svg',
			'irish coffee mug': src + 'hot_mug.svg',
			'margarita': src + 'margarita.svg'
		}
		let icon = document.createElement('img')
		icon.classList.add('glass-icon')
		if(glassType in types) {
			icon.src = types[glassType]
			icon.alt = glassType
		} else {
			// @TODO:
		}
		return icon
	}
	// Create a focused div
	createFocusedDiv() {
		// data
		let cocktail = this.dataController.cocktails[this.cocktailName]
		let details = this.dataController.cocktailsDetails[this.cocktailName]
		// assembling title
		let titleDiv = document.createElement('h1')
		titleDiv.innerText = this.cocktailName
		// assembling icon & garnish
		let glassIcon = this.getGlassIcon(details['glass'])
		let garnishDiv = document.createElement('div')
		garnishDiv.innerHTML = 'Garnish : ' + details['garnish']
		// assembling cocktail preparation div
		let prepTitle = document.createElement('h3')
		prepTitle.innerText = 'Preparation'
		let prepDiv = document.createElement('div')
		prepDiv.innerText = details['prep']
		// assembling ingredient list
		let ingredientsTitle = document.createElement('h3')
		ingredientsTitle.innerText = 'Ingredients'
		let ingList = document.createElement('ul')
		for (const ingredient of cocktail) {
			let ingLi = document.createElement('li')
			ingLi.innerText = this.parseIngredient(ingredient)
			ingList.appendChild(ingLi)
		}
		// assembling unfocus button
		let unfocus = document.createElement('div')
		unfocus.classList.add('unfocus-button')
		unfocus.addEventListener('click', () => this.eventsCaller.unfocusResult())
		// assembling div
		let div = document.createElement('div')
		div.appendChild(titleDiv)
		div.appendChild(glassIcon)
		details['garnish'] && div.appendChild(garnishDiv)
		div.appendChild(ingredientsTitle)
		div.appendChild(ingList)
		div.appendChild(prepTitle)
		div.appendChild(prepDiv)
		div.appendChild(unfocus)
		return div
	}
	// displays the result with the animation
	// if the cocktail was already being displayed, not touching a thing
	displayResult(cocktailName) {
		this.cocktailName = cocktailName
		this.showFocusResultDiv()
	}
	// closes up the focused result div with the animation
	close() {
		this.cocktailName = null
		this.closeFocusDivRollup()
	}

	/* Animation related */

	// changes the height of the focusedDiv container
	// somehow changing the height doesnt work but this does
	// im not sure why, maybe look into it
	changeHeight(newHeight) {
		this.focusedResultDiv.style.minHeight = newHeight + 'px';
		this.focusedResultDiv.style.maxHeight = newHeight + 'px';
	}

	// closes focused div
	closeFocusDivRollup() {
		if(this.focusedResultDiv.style.display == 'none') return;
		this.openInterval && clearInterval(this.openInterval) // stopping open interval before close interval
		this.closeInterval = setInterval(() => {
			const currentHeight = parseInt(this.focusedResultDiv.style.maxHeight)
			const newHeight = currentHeight - PAS
			if(newHeight < 0) {
				this.changeHeight(0)
				this.focusedResultDiv.style.display = 'none'
				clearInterval(this.closeInterval)
				this.closeInterval = false
			} else {
				this.changeHeight(newHeight)
			}
		}, 33)
	}

	// Transitions between different heights for the focused element div
	startFocusDivRollup(previousHeight, nextHeight) {
		// not enough of a difference to transition
		if (Math.abs(previousHeight - nextHeight) <= PAS) {
			this.changeHeight(nextHeight)
			return
		}
		this.changeHeight(previousHeight)
		const iterator = (previousHeight > nextHeight) ? -PAS : PAS
		let counter = previousHeight
		this.closeInterval && clearInterval(this.closeInterval) // stopping close interval before open interval
		this.openInterval = setInterval(() => {
			if (Math.abs(counter - nextHeight) <= PAS) {
				this.changeHeight(nextHeight)
				clearInterval(this.openInterval)
				this.openInterval = false
				return
			}
			counter += iterator
			this.changeHeight(counter)
		}, 33)
	}

	// Creates the dom for a focused result in the main content
	showFocusResultDiv(name, cocktail) {
		// getting the current height of the div
		const currentHeight = this.focusedResultDiv.offsetHeight
		// displaying the div
		this.focusedResultDiv.style.display = 'block'
		// creating the result div to display
		const div = this.createFocusedDiv()
		div.classList.add('focused-result-div')
		// creating a fake div, inserting it as a hidden absolute container
		// in the body to get a default height for the result div container
		// this is dumb but it works so...
		const fakeDiv = document.createElement('div')
		fakeDiv.style.visibility = 'hidden'
		fakeDiv.style.position = 'absolute'
		// fakeDiv.style.paddingBottom = '20px'
		fakeDiv.appendChild(div)
		document.body.appendChild(fakeDiv)
		div.style.paddingBottom = '32px' // adding space for the closing button
		const nextHeight = fakeDiv.offsetHeight
		document.body.removeChild(fakeDiv)
		// showing the result div and starting the transition between the heights
		this.focusedResultDiv.innerHTML = ''
		this.focusedResultDiv.appendChild(div)
		this.startFocusDivRollup(currentHeight, nextHeight)
	}
}