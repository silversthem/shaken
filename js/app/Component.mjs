/*
	Represents an app component,
	basically linking every component to the data controller and events caller
	Also giving the components the corresponding dom elements it'll use
*/

export class Component {
	// builds component
	constructor(domElements, dataController, eventsCaller) {
		this.dataController = dataController
		this.eventsCaller = eventsCaller
		Object.keys(domElements).forEach(key => {this[key] = domElements[key]})
		this.mount()
	}
	// empty by default
	mount() {}
}