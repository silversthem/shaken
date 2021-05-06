/*
	This class represents the focused result element
	it emits 2 app events, addTag and unfocusResult
	and uses tags and the cocktails list as data
*/

// The amount of pixel the transition moves by every 33msecs
const PAS = 10

export class FocusedResult {
	// creates the component
	constructor(focusedResultDiv, cocktails, tags, unfocusEvent, addTagEvent) {
		this.cocktailName = null
		this.focusedResultDiv = focusedResultDiv
		this.cocktails = cocktails
		this.tags = tags
		this.unfocusEvent = unfocusEvent
		this.addTagEvent = addTagEvent
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
	// Create a focused div
	createFocusedDiv() {
		let cocktail = this.cocktails[this.cocktailName]
		let div = document.createElement('div')
		let titleDiv = document.createElement('h1')
		let ingredientsTitle = document.createElement('h3')
		ingredientsTitle.innerText = 'Ingredients'
		let unfocus = document.createElement('div')
		unfocus.classList.add('unfocus-button')
		unfocus.addEventListener('click', () => this.unfocusEvent())
		titleDiv.innerText = this.cocktailName
		let ingList = document.createElement('ul')
		for (const ingredient of cocktail) {
			let ingLi = document.createElement('li')
			ingLi.innerText = this.parseIngredient(ingredient)
			ingList.appendChild(ingLi)
		}
		div.appendChild(titleDiv)
		div.appendChild(ingredientsTitle)
		div.appendChild(ingList)
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
		fakeDiv.appendChild(div)
		document.body.appendChild(fakeDiv)
		const nextHeight = fakeDiv.offsetHeight
		document.body.removeChild(fakeDiv)
		// showing the result div and starting the transition between the heights
		this.focusedResultDiv.innerHTML = ''
		this.focusedResultDiv.appendChild(div)
		this.startFocusDivRollup(currentHeight, nextHeight)
	}
}