class TodoApp {
	constructor() {
		this._bodyLayout = document.body.querySelector('template .app-layout');
		this._cardLayout = document.body.querySelector('template .task-card-layout');

		this._taskList = [];
		this.locations; // keeps locations in html document where this app is rendered

		this._searchInput; // stores search input to render it over all of the app instances

		// creates a couple of example tasks
	}

	render(target) {
		// target: HTMLElement;
		// renders app inside the target DOM element;

		// renders body

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

	_renderTask() {
		// creates layout of a single task card;
	}


	_addTask() {
		// adds task to the task list
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

}

// let todo = new TodoApp();
// console.log(todo.bodyLayout);