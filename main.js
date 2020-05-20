class TodoApp {
	constructor() {
		this._bodyLayout = document.body.querySelector('template[data-app-body]');
		this._cardLayout = document.body.querySelector('template[data-task-card]');

		this._tasksList = [];
		this.locations = []; // list of DOM nodes where this app is rendered

		// this._searchInput; // stores search input to render it over all of the app instances

		// creates a couple of example tasks
		this._addExampleTasks();
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
		console.log('pushed target location: ' + target)

		// adds event listener for creating a new task

		// renders tasks (built in method)
		this._renderTasks(target, this._tasksList);

		// adds event listener on tasks container for checkinng, editing and deleting tasks

		// adds event listener for searching through the tasks and filtering

	}

	_renderTasks(target, tasksList) {
		// target: HTMLElement;
		// tasksList: list (of TaskObject(s));
		// renders the list of cards inside app(s) that are rendered inside target element(s);
		// is designed to render tasks depending on filtering and the search input;

		// renders cards
		let container = target.querySelector('div[data-tasks-container]');

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
		console.log(`description: ${description.value} due date: ${dueDate.value}`)
		description.value = taskObject.description;
		dueDate.value = taskObject.date;

		return card;
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
			this._renderTasks();
		}

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
		this._addTask('Try to mark me completed', new Date, false);
		this._addTask('Click on this text to edit', new Date, false);
		this._addTask('Try to remove me', new Date, false);
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








