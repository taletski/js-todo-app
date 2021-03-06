class TodoApp {
	constructor() {
		this._bodyLayout = document.body.querySelector('template[data-get-template-app-body]');
		this._cardLayoutIncomplete = document.body.querySelector('template[data-get-template-task-incomplete]');
		this._cardLayoutCompleted = document.body.querySelector('template[data-get-template-task-completed]')

		this._tasksList = [];
		this._locations = []; // list of DOM nodes where this app is rendered

		this._delayForCSSAnimation = 200 // ms

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

		// adds event listener for adding a new task
		target.querySelector('form[data-get-new-task-form]').addEventListener('submit', (event) => {
			event.preventDefault();
			console.log('submit!');
			this._onTaskSubmit(event);
		});

		// adds event listeners on tasks container for marking completed, editing and deleting tasks
		target.querySelector('div[data-get-tasks-container]').addEventListener('click', (event) => {
			if ( !event.target.closest('div[data-delete-button]') ) {
				return;
			}

			let targetCardProperties = this._getChangedCardProperties(event);
			this._onDeleteClick(targetCardProperties);
		});

		target.querySelector('div[data-get-tasks-container]').addEventListener('change', (event) => {
			
			let targetCardProperties = this._getChangedCardProperties(event);

			switch (event.target.type) {
				case 'checkbox':
					this._onCheckboxChange(targetCardProperties);
					break;
				case 'text':
					// this works when focus is leaving the text field
					this._onTextFocusLeave(targetCardProperties);
					break;
				default:
					break;
			}

		});

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
		let layout = taskObject.status === 'incomplete' ? this._cardLayoutIncomplete : this._cardLayoutCompleted;
		let card = layout.content.cloneNode(true);
		let [description, dueDate] = card.querySelectorAll('input[type="text"]');

		// __refactor
		description.value = taskObject.description;
		dueDate.value = taskObject.date;

		card.firstElementChild.hidden = taskObject.isHidden;

		return card;
	}

	_clearTasks(appDOMElement) {
		appDOMElement.querySelector('div[data-get-tasks-container]').innerHTML = '';
	}

	_reRenderTasks(appDOMElement, tasksList) {
		this._clearTasks(appDOMElement);
		this._renderTasks(appDOMElement, tasksList);
	}

	_renderPopTask(mode, container, taskObject, delay=0) {
		// assemble and append an invisible task
		let task = this._assembleTask(taskObject);
		
		setTimeout(() => {
			task.firstElementChild.style.opacity = 0;
			if (mode === 'append') {
				container.append(task);
				// make the task visible with css animation
				container.lastElementChild.style.opacity = 1;
			} else if (mode === 'prepend') {
				container.prepend(task);
				// make the task visible with css animation
				container.firstElementChild.style.opacity = 1;
			}
		}, delay);	
	}

	_renderRemoveTask(container, taskIdx, delay, interval=this._delayForCSSAnimation) {
		// delay: integer
			// sets time (ms) needed to delay start of the animation rendering
		// interval: integer
			// sets time between animations during the rendering;

		let cardToDelete = container.querySelectorAll('div[data-get-task-card]')[taskIdx];
		
		// makes task invisible using css
		setTimeout(() => {
			cardToDelete.style.opacity = 0;

			setTimeout(() => {
				// removes task card container element from DOM
				cardToDelete.parentNode.removeChild(cardToDelete);
			}, interval);
		}, delay);
	}

	_renderMarkTaskCompleted(container, taskIdx, delay=0) {
		let cardToMark = container.querySelectorAll('div[data-get-task-card]')[taskIdx];

		setTimeout(() => {
			// adds .card-completed class
			cardToMark.className += ' card-completed';

			// lightens borders and font
			cardToMark.className.replace('border-dark', 'border-light');
			cardToMark.querySelectorAll('input[type="text"]').forEach(inputField => inputField.className += ' text-secondary');
		}, delay);
	}

	_renderMarkTaskIncomplete(container, taskIdx, delay=0) {
		let cardToUnmark = container.querySelectorAll('div[data-get-task-card]')[taskIdx];

		setTimeout(() => {
			// adds .card-completed class
			cardToUnmark.className.replace(' card-completed', '');

			// lightens borders and font
			cardToUnmark.className.replace('border-light', 'border-dark');
			cardToUnmark.querySelectorAll('input[type="text"]').forEach( inputField => inputField.className.replace(' text-secondary', '') );
		}, delay);
	}

	_addTask(description, date) {
		// this method is mainly for an event handler which 
		// creates and adds task to the task list
		// returns a pointer to the added task

		// input validation

		// adds task
		this._tasksList.push( new TaskObject(description, date) );

	}

	_addExampleTasks() {
		let today = new Date();
		today = today.toDateString().replace(/\d{4}/g, ''); // removes year from date string

		this._addTask('Try to mark me completed', today);
		this._addTask('Click on this text to edit', today);
		this._addTask('Try to remove me', today);
	}


	// event handlers: search and filter

	_onSearch(event) {
		let searchQuery = event.target.value;

		this._tasksList.forEach((taskObject) => taskObject.isHidden = ! taskObject.description.includes(searchQuery));

		this._unifyView(event, (appDOMElement) => {
			let searchField = appDOMElement.querySelector('input[data-get-search-field]');

			searchField.value = searchQuery;
			this._reRenderTasks(appDOMElement, this._tasksList);
		});
	}

	_onFilterChoice(event) {
		let selectedValue = event.target.value;

		if (selectedValue === 'all') {
			this._tasksList.forEach((taskObject) => taskObject.isHidden = false);
		} else {
			this._tasksList.forEach((taskObject) => taskObject.isHidden = taskObject.status !== selectedValue);
		}
		
		this._unifyView(event, (appDOMElement) => {
			let filterMenu = appDOMElement.querySelector('select[data-get-filter]');
			filterMenu.value = selectedValue;
			this._reRenderTasks(appDOMElement, this._tasksList);
		});
	}

	// event handlers: on change task card
	_getChangedCardProperties(event) {

		let currentTasksList = event.target.closest('div[data-get-tasks-container]').querySelectorAll('div[data-get-task-card]');
		let targetTaskCard = event.target.closest('div[data-get-task-card]');
		let targetTaskIdx = Array.prototype.indexOf.call(currentTasksList, targetTaskCard);

		return {
			event,
			currentTasksList,
			targetTaskCard,
			targetTaskIdx,
		}
	}

	_onCheckboxChange(targetCardProperties) {

		let targetTaskIdx = targetCardProperties.targetTaskIdx;

		// model: updates status of the task
		let targetTaskObject = this._tasksList[targetTaskIdx];
		
		switch (targetTaskObject.status) {
			case 'incomplete':
				this._markCompleted(targetCardProperties);
				break;
			case 'completed':
				this._markIncomplete(targetCardProperties);
				break;
			default:
				break;
		}

	}

	_markCompleted(targetCardProperties) {

		let {event, currentTasksList, targetTaskCard, targetTaskIdx} = targetCardProperties;
		let targetTaskObject = this._tasksList[targetTaskIdx];

		targetTaskObject.status = 'completed';

		// model: moves the task to the end of the tasks list
		this._tasksList.splice(targetTaskIdx, 1);
		this._tasksList.push(targetTaskObject);

		// updates view in all instances of the app
		this._unifyView(event, (appDOMElement) => {
			let tasksContainer = appDOMElement.querySelector('div[data-get-tasks-container]');
			let delay = this._delayForCSSAnimation;

			this._renderMarkTaskCompleted(tasksContainer, targetTaskIdx);
			this._renderRemoveTask(tasksContainer, targetTaskIdx, delay, delay);
			this._renderPopTask('append', tasksContainer, targetTaskObject, delay*3);
		});

	}

	_markIncomplete(targetCardProperties) {

		let {event, currentTasksList, targetTaskCard, targetTaskIdx} = targetCardProperties;
		let targetTaskObject = this._tasksList[targetTaskIdx];

		targetTaskObject.status = 'incomplete';

		// model: moves the task object to the end of the tasks list
		this._tasksList.splice(targetTaskIdx, 1);
		this._tasksList.unshift(targetTaskObject);

		// updates view in all instances of the app
		this._unifyView(event, (appDOMElement) => {
			let tasksContainer = appDOMElement.querySelector('div[data-get-tasks-container]');
			let delay = this._delayForCSSAnimation;

			this._renderMarkTaskIncomplete(tasksContainer, targetTaskIdx);
			this._renderRemoveTask(tasksContainer, targetTaskIdx, delay, delay);
			this._renderPopTask('prepend', tasksContainer, targetTaskObject, delay*3);
		});

	}

	_onTextFocusLeave(targetCardProperties) {
		let {event, currentTasksList, targetTaskCard, targetTaskIdx} = targetCardProperties;
		let fieldType = event.target.dataset.inputType;
		let enteredValue = event.target.value

		// model: change content of the task
		this._tasksList[targetTaskIdx][fieldType] = enteredValue;

		this._unifyView(event, (appDOMElement) => {
			let taskCard = appDOMElement.querySelectorAll('div[data-get-task-card]')[targetTaskIdx];
			taskCard.querySelector(`input[data-input-type="${fieldType}"]`).value = enteredValue;
		});
	}

	_onDeleteClick(targetCardProperties) {
		let {event, currentTasksList, targetTaskCard, targetTaskIdx} = targetCardProperties;

		// model: remove task from the list of tasks
		this._tasksList.splice(targetTaskIdx, 1);

		this._unifyView(event, (appDOMElement) => {
			// render remove from tasks list
			let delay = 0; // dont need delay for css animation this time
			let tasksContainer = appDOMElement.querySelector('div[data-get-tasks-container]');
			this._renderRemoveTask(tasksContainer, targetTaskIdx, delay);
		});
	}

	_onTaskSubmit(event) {
		let description = event.target.description.value;
		let date = event.target.date.value;

		let newTask = new TaskObject(description, date);
		// model: appends new task to the list
		this._tasksList.unshift(newTask);

		// view: rendering the new task in all app instances
		this._unifyView(event, (appDOMElement) => {
			let tasksContainer = appDOMElement.querySelector('div[data-get-tasks-container]');
			this._renderPopTask('prepend', tasksContainer, newTask);
		});
	}

	// event handlers: on event rendering the same view in all app instances

	_unifyView(event, runFunction) {
		// event: EventTarget;
		// runFunction: function;
		// finds all instances of the app and runs runFunction() for that instances;
		// this function is used by event handlers to view exactly the same changes in all app instances;
		let currentDOMElement = event.target.closest('div[get-app-container]');

		for (let appDOMElement of this._locations) {
			runFunction(appDOMElement);
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
		this._isHidden = false;
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
		this._date = input;
	}

	get date() {
		return this._date;
	}

	get status() {
		return this._status;
	}

	set status(value) {
		this._status = value;
	}

	get isHidden() {
		return this._isHidden;
	}

	set isHidden(value) {
		this._isHidden = value;
	}
}


let todo = new TodoApp();
let div1 = document.body.firstElementChild;
let div2 = target2;
let div3 = target3;

todo.render(div1);
todo.render(div2);

// setTimeout(() => { todo._renderRemoveTask(div1.querySelector('div[data-get-tasks-container]'), 1); }, 2000);


// re-style on checking the task
// move down on checking the task
	// add id's to task objects and representations

// delete a single task (with a css animation)
	// add 'hidden' property







