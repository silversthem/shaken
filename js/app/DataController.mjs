/*
	Loads and manipulates data inside the app
	Data is fetched using the toFect parameter in the constructor
	Example :
	{"dataName": "dataSource.json"}
	will create a key dataName with the content of the file dataSource.json as value in the controller.
	When the file is loaded, the onLoadedEvent function is called with the key as a argument
	Currently only json files are supported
*/

export class DataController {
	// Creates a data controller, with a function to call when all data is loaded
	constructor(toFetch, {onLoadedEvent, onErrorLoadingEvent, onAllLoadedEvent}) {
		let total = Object.keys(toFetch).length
		let counter = 0
		Object.keys(toFetch).forEach(key => {
			fetch(toFetch[key]).then(response => {
				if(!response.ok) {
					//@TODO: http error
					return
				}
				// @TODO: handle more than json
				return response.json()
			}).then(rep => {
				// saving fetched data inside the class and calling the onLoaded event
				counter += 1
				this[key] = rep
				onLoadedEvent(key)
				// when all loaded calling the onAllLoadedEvent callback
				if(counter == total) onAllLoadedEvent();
			}).catch(error => {
				// @TODO: data error
			})
		})
	}
}