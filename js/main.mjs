/*
	Builds the web app
*/

// loads searchbar events & functionalities
import * as SEARCH from '/js/searchbar.mjs'

// just to test stuff
SEARCH.addSearchTag('gin')
SEARCH.addSearchTag('vodka')
SEARCH.searchCocktails()

// searchbar events
SEARCH.searchbar_input.addEventListener('focus', () => SEARCH.autocompleteIngredients())
SEARCH.searchbar_input.addEventListener('input', () => SEARCH.autocompleteIngredients())
SEARCH.searchbar_input.addEventListener('focusout', () => SEARCH.closeAutocomplete())

// keyboard events
document.addEventListener('keydown', (event) => {
    let key = event.key // Key press, we're looking for arrows and Enter
    let actionObj = {}
    // if the search bar is focused, key presses correspond to action on the autocomplete
    if(document.activeElement == document.getElementById('cocktail-add-ingredient')) {
        actionObj = {
            'ArrowUp': () => SEARCH.scrollUpAutocompletedDiv(), // scrolls up one suggestion
            'ArrowDown': () => SEARCH.scrollDownAutocompletedDiv(), // scrolls down on suggestion
            'ArrowRight': () => SEARCH.fillWithAutocompletedDiv(), // fills autocomplete
            'Enter': () => SEARCH.validateCurrentAutocompletedDiv() // validates autocomplete
        }
    }
    // calling the action corresponding to the key
    if(key in actionObj) {
        actionObj[key]()
    }
})