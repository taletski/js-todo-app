class TodoApp {
	constructor() {
		this._bodyLayout = document.body.querySelector('template[data-app-body]');
		this._cardLayout = document.body.querySelector('template[data-task-card]');

		this._taskList = [];
		this.locations = []; // keeps locations in html document where this app is rendered

		// this._searchInput; // stores search input to render it over all of the app instances

		// creates a couple of example tasks
		// this._addExampleTasks();
	}

	render(target) {
		// target: HTMLElement;
		// renders app inside the target DOM element;

		// checks if app is already rendered in target
		if (this.locations.length !== 0) {
			if (target in this.locations) {return};
		}

		// renders app inside a target node
		target.append(this._bodyLayout.content.cloneNode(true));
		this.locations.push(target);

		// adds event listener for creating a new task

		// renders tasks (built in method)

		// adds event listener on tasks container for checkinng, editing and deleting tasks

		// adds event listener for searching through the tasks and filtering

	}

	_renderTasks(list=this._taskList) {
		// list: list;
		// renders the list of cards inside app(s) that are rendered inside target element(s);
		// by default, renders all tasksk;
		// is designed to render tasks depending on filtering and the search input;

	}

	_Task() {
		// creates layout of a single task card from TaskObject;
	}


	_addTask() {
		// creates and adds task to the task list
		// returns a pointer to the added task
	}

	_toggleTask() {
		// marks task completed/incompleted
	}

	_removeTask() {
		// removes the target task from the
	}

	_findTasks(request) {
		// request: str;
		// returns the list of visible tasks that satisfy the search request
	}

	_filterTasks() {

	}

	_addExampleTasks() {
		// this._addTask('Try to mark me completed', Date.today);
		// this._addTask('Click on this text to edit', Date.today);
		// this._addTask('Try to remove me', Date.today);
	}

}

class TaskObject {
	constructor(description, date) {
		// description: str;
		// date: Date object;
		this._description = description;
		this._date = date;
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
		return this._date;
	}
}



let todo = new TodoApp();
let div1 = document.body.firstElementChild;
let div2 = target2;
let div3 = target3;

todo.render(div1);
todo.render(div2);


// todo.render(div1);
// console.log(todo._bodyLayout);
// console.log(todo._cardLayout);








