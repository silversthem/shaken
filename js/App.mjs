/*
    Contains the app's features
*/

// importing router
import {Router} from '/js/app/Router.mjs'
// importing components
import {SearchBar} from '/js/components/searchbar/SearchBar.mjs'
import {TagList} from '/js/components/searchbar/TagList.mjs'
import {ResultsDisplay} from '/js/components/mainside/ResultsDisplay.mjs'
import {FocusedResult} from '/js/components/mainside/FocusedResult.mjs'
import {Catalog} from '/js/components/mainside/Catalog.mjs'
// importing data controller
import {AppDataController} from '/js/AppDataController.mjs'

// html dom elements of the app
// search bar
const title_div = document.getElementById('title')
const autocomplete_list = document.getElementById('autocomplete-list')
const searchbar_input = document.getElementById('cocktail-add-ingredient')
const selected_ingredients_list = document.getElementById('selected-ingredients')
// main side
const focused_result = document.getElementById('focused-result')
const results_list = document.getElementById('results')
const catalog_list = document.getElementById('catalog')

export class App {
    // Assembles and runs the app
    constructor() {
		// set of currently searched tags
        this.tagList = new Set()
		// creating router
        this.router = new Router()
		// loading data controller
		this.appDataController = new AppDataController({
			onLoadedEvent: (key) => {},
			onErrorLoadingEvent: (key, type) => {},
			onAllLoadedEvent: () => {this.mount(); this.serve()}
		})
		// listing app events
		this.eventCallers = {
			focusResult: (name) => {this.focusResult(name)},
			unfocusResult: () => {this.unfocusResult()},
			addTag: (tagid) => {this.addTag(tagid)},
			deleteTag: (tagid) => {this.deleteTag(tagid)}
		}
		// adding title onclick event
		title_div.addEventListener('click', () => {Router.go('')})
    }
	// Mounts a component
	mountComponent(component, domElements) {
		// Linking to the app events caller and the DataController and returning the component
		return new component(domElements, this.appDataController, this.eventCallers)
	}
	// Mounts app by mounting all the components, called when all initial data is loaded
	mount() {
		this.searchbar        = this.mountComponent(SearchBar, {'input': searchbar_input, 'autocompleteDiv': autocomplete_list}) 
		this.tagListDiv       = this.mountComponent(TagList, {'tagsDiv': selected_ingredients_list})
		this.resultsDiv       = this.mountComponent(ResultsDisplay, {'resultsDiv': results_list})
		this.focusedResultDiv = this.mountComponent(FocusedResult, {'focusedResultDiv': focused_result})
		this.catalog          = this.mountComponent(Catalog, {'catalogDiv': catalog_list})
	}
    // Adds a tag to the taglist and updates the search
    addTag(tag) {
        this.tagList.add(tag)
        this.updateTagList()
    }
    // Deletes a tag from the taglist and updates the search
    deleteTag(tag) {
        this.tagList.delete(tag)
        this.updateTagList()
    }
    // Updates the tag list in the url
    updateTagList() {
        Router.go('search', {'query': Array.from(this.tagList).join(',')})
    }
    // Updates search and tag list dom from the query string parameter from the url
    updateSearchFromQueryParameter(queryStr) {
        // parsing query string, assembling tag list
        this.tagList = new Set(queryStr.split(',').filter(tag => tag != '').map(tag => parseInt(tag)))
        // updating tag list dom from the tag list
        this.tagListDiv.update(this.tagList)
        // updating search
        this.updateSearch()
    }
	// displaying search results, hiding catalog
	displaySearchResults() {
		this.catalog.hide()
		this.resultsDiv.updateSearch(this.tagList)
	}
	// displaying catalog, hiding search results
	displayCatalog() {
		this.resultsDiv.hide()
		this.catalog.displayCatalog()
	}
    // updates the search
    updateSearch() {
        // if no tags showing catalog
        if(this.tagList.size == 0) {
            this.displayCatalog()
            return
        }
        // updating results div with new results
        this.displaySearchResults()
    }
    // focuses on a result
    focusResult(name) {
        // if we click on the current focused result from the searchbar, it closes it
        if(name == this.focusedResultDiv.cocktailName) {
            return this.unfocusResult()
        }
        // updating url
        Router.go('view', {'name': name, 'query': Array.from(this.tagList).join(',')})
    }
    // unfocuses the focused result
    unfocusResult() {
        // closes focused result box
        this.focusedResultDiv.close()
        // updating url
        Router.go('search', {'query': Array.from(this.tagList).join(',')})
    }
    // Starts the app
    serve() {
		/* appending routes */

        // Searching route gets the searched tags through the query parameter and shows results
        this.router.setRoute('search', (params) => {
            // Parsing taglist from the query parameter and updating search
            if(params.query !== undefined) {
                return this.updateSearchFromQueryParameter(params.query)
            }
        })
        // Viewing route shows the name parameter as a focused result
        // if there's a query parameter it will be used to build a search
        this.router.setRoute('view', (params) => {
            // if there's a query parameter, we parse it and update the search else we show the catalog
            this.updateSearchFromQueryParameter(params.query);
			// setting focused view of the cocktail
            if(params.name !== undefined) {
				this.focusedResultDiv.displayResult(params.name)
				// setting the right search result as the active one
				let r = document.querySelector('div[data-result-cocktail-name="' + params.name + '"]')
				let cr = document.getElementById('active-result')
				if(cr) cr.removeAttribute('id')
				if(r) r.setAttribute('id', 'active-result')
			}
        })
        // default landing route
        this.router.setRoute('', (params) => {
			// hiding cocktail in view
			this.focusedResultDiv.close()
			// updating with an empty query -> displays catalog (same as having an empty query)
			this.updateSearchFromQueryParameter('')
        })

        // starting routing
        this.router.serve()
    }
}