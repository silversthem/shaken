/*
    Contains the app's features
*/

// importing router
import {Router} from '/js/Router.mjs'
// importing components
import {SearchBar} from '/js/searchbar/SearchBar.mjs'
import {TagList} from '/js/searchbar/TagList.mjs'
import {ResultsDisplay} from '/js/mainside/ResultsDisplay.mjs'
import {FocusedResult} from '/js/mainside/FocusedResult.mjs'
// importing data
import {cocktails} from '/data/cocktails_iba_final.mjs'
import {tags} from '/data/tags.mjs'

// html dom elements of the app
// search bar
const autocomplete_list = document.getElementById('autocomplete-list')
const searchbar_input = document.getElementById('cocktail-add-ingredient')
const selected_ingredients_list = document.getElementById('selected-ingredients')
// main side
const mainside = document.getElementById('mainside')
const focused_result = document.getElementById('focused-result')
const results_list = document.getElementById('results')

export class App {
    // Creates the app instance, loading all necessary components
    constructor() {
        this.tagList = new Set()
        this.router = new Router()

        /* mounting components */

        const addTagEvent = (tagid) => {this.addTag(tagid)}

        // Seachbar autocomplete
        this.searchbar = new SearchBar(searchbar_input, autocomplete_list, tags, addTagEvent)
        // tag list
        this.tagListDiv = new TagList(selected_ingredients_list, tags, (tagid) => {this.deleteTag(tagid)})
        // main result search results list
        this.resultsDiv = new ResultsDisplay(results_list, tags, cocktails, (name) => {this.focusResult(name)}, addTagEvent)
        // focus result div
        this.focusedResultDiv = new FocusedResult(focused_result, cocktails, tags, () => {this.unfocusResult()}, addTagEvent)
        // catalog list
        
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
            // setting focused view of the cocktail
            if(params.name !== undefined) this.focusedResultDiv.displayResult(params.name)
            // if there's a query parameter, we parse it and update the search else we show the catalog
            this.updateSearchFromQueryParameter(params.query);
        })
        // default landing route
        this.router.setRoute('', (params) => {
            // displaying a catalog of all available cocktails, in alphabetical order
        })
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
        // Updating url without changing the route, if we're in viewing mode we stay that way
        // but the search will update
        // Router.go('search', {'query': Array.from(this.tagList).join(',')})
        Router.update({'query': Array.from(this.tagList).join(',')})
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
    // updates the search
    updateSearch() {
        // if no tags showing catalog
        if(this.tagList.length == 0) {
            // @TODO add catalog
            return
        }
        // updating results div with new results
        this.resultsDiv.updateSearch(this.tagList)
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
        // starting routing
        this.router.serve()
    }
}