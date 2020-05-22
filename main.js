class TodoApp {
	constructor() {
		this._bodyLayout = document.body.querySelector('template[data-get-template-app-body]');
		this._cardLayout = document.body.querySelector('template[data-get-template-task]');

		this._tasksList = [];
		this._locations = []; // list of DOM nodes where this app is rendered

		// this._searchInput; // stores search input to render it over all of the app instances

		// creates a couple of example tasks
		this._addExampleTasks();
	}

	// view methods

	render(target) {
		// target: HTMLElement;
		// renders app inside the target DOM element;

		// checks if app is already rendered in the 'target' DOM element
		if (this._locations.length !== 0) {
			if (target in this._locations) {return};
		}

		// renders app inside a target node, saves the node into _locations list
		target.append(this._bodyLayout.content.cloneNode(true));
		this._locations.push(target);

		// adds event listener for creating a new task

		// renders tasks (built in method)
		this._renderTasks(target, this._tasksList);

		// adds event listener on tasks container for checkinng, editing and deleting tasks

		// adds event listeners for searching through the tasks and filtering
		target.querySelector('input[data-get-search-field]').addEventListener('keyup', (event) => {
			this._onSearch(event);
		});

		target.querySelector('select[data-get-filter]').addEventListener('change', (event) => {
			this._onFilterChoice(event);
		});
	}

	_renderTasks(appDOMElement, tasksList) {
		// target: HTMLElement;
		// tasksList: list (of TaskObject(s));
		// renders the list of cards inside app(s) that are rendered inside target element(s);
		// is used by filter and the search event handlers;

		// renders cards
		let container = appDOMElement.querySelector('div[data-get-tasks-container]');

		for (let task of tasksList) {
			container.append(this._assembleTask(task));
		}
	}

	_assembleTask(taskObject) {
		// taskObject: TaskObject;
		// creates layout for rendering a single task card from TaskObject;
		// returns DocumentFragment;
		let card = this._cardLayout.content.cloneNode(true);
		let [description, dueDate] = card.querySelectorAll('input[type="text"]');

		// __refactor
		description.value = taskObject.description;
		dueDate.value = taskObject.date;

		card.firstElementChild.style.opacity = 1;

		return card;
	}

	_clearTasks(appDOMElement) {
		appDOMElement.querySelector('div[data-get-tasks-container]').innerHTML = '';
	}

	_reRenderTasks(appDOMElement, tasksList) {
		this._clearTasks(appDOMElement);
		this._renderTasks(appDOMElement, tasksList);
	}

	_reRenderTasksEverywhere(tasksList) {
		for (let location of this._locations) {
			this._reRenderTasks(location, tasksList);
		}
	}

	_renderAppendTask(container, taskObject) {
		// assemble and append an invisible task
		task = this._assembleTask(taskObject);
		task.style.opacity = 0;
		container.append(task);

		// make the task visible with css
		task.style.opacity = 1;
	}

	_renderRemoveTask(container, taskId) {
		console.log(`removing`)
		let cardToDelete = container.querySelectorAll('div[data-get-task-card]')[taskId];
		
		// makes task invisible using css
		cardToDelete.style.opacity = 0;

		setTimeout(() => {
			// removes task card container element from DOM
			cardToDelete.parentNode.removeChild(cardToDelete);
		}, 200);
	}



	_addTask(description, date, render=true) {
		// this method is mainly for an event handler which 
		// creates and adds task to the task list
		// returns a pointer to the added task

		// input validation

		// adds task
		this._tasksList.push( new TaskObject(description, date) );

		// re-renders
		if (render) {
			// this._renderAppendTask();
		}

	}

	_addExampleTasks() {
		this._addTask('Try to mark me completed', new Date, false);
		this._addTask('Click on this text to edit', new Date, false);
		this._addTask('Try to remove me', new Date, false);
	}


	// event handlers
	_onSearch(event) {
		let searchQuery = event.target.value;

		let searchResult = this._tasksList.filter((task) => {
			return task.description.toLowerCase().includes(searchQuery.toLowerCase()); // && task.visible
		});

		this._unifyView(event, (appDOMElement) => {
			let searchField = appDOMElement.querySelector('input[data-get-search-field]');
			searchField.value = searchQuery;
			this._reRenderTasks(appDOMElement, searchResult);
		});
	}

	_onFilterChoice(event) {
		let selectedElement = event.target;
		let selectedValue = selectedElement.options[selectedElement.selectedIndex].value;

		let filterResults = selectedValue === 'all' ? this._tasksList : this._tasksList.filter((task) => task.status === selectedValue);
		this._reRenderTasksEverywhere(filterResults);
	}

	_unifyView(event, runFunction) {
		// event: EventTarget;
		// runFunction: function;
		// finds all instances of the app and runs runFunction() for that instances;
		// this function is used by event handlers to view exactly the same changes in all app instances;
		let currentDOMElement = event.target.closest('div[get-app-container]');

		for (let appDOMElement of this._locations) {
			if (appDOMElement !== currentDOMElement) {
				runFunction(appDOMElement);
			}
		}	
	}

}

class TaskObject {
	constructor(description, date) {
		// description: str;
		// date: Date object;
		this._description = description;
		this._date = date;
		this._status = 'incomplete'; // may be one of the following: 'incomplete', 'completed';
	}

	set description(input) {
		if (typeof(input) === 'string') {
			this._description = input;
		} else {
			throw TypeError(`in TaskObject trying to set description as ${typeof(input)}, but ${typeof('')} was expected`);
		}
	}

	get description() {
		return this._description;
	}

	set date(input) {
		if (input instanceof Date) {
			this._date = input;
		} else {
			throw TypeError(`in ${this} trying to set date as ${input instanceof Object ? input.constructor.name : typeof(input)}, but ${Date.prototype.constructor.name} was expected`);
		}
	}

	get date() {
		let result = this._date.toDateString();
		result = result.replace(/\d{4}/g, ''); // removes year from date string
		return result;
	}

	get status() {
		return this._status;
	}
}


let todo = new TodoApp();
let div1 = document.body.firstElementChild;
let div2 = target2;
let div3 = target3;

todo.render(div1);
todo.render(div2);

setTimeout(() => { todo._renderRemoveTask(div1.querySelector('div[data-get-tasks-container]'), 1); }, 2000);


// re-style on checking the task
// move down on checking the task
	// add id's to task objects and representations

// delete a single task (with a css animation)
	// add 'hidden' property







