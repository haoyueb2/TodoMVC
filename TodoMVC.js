const CL_COMPLETED = "completed";
let taskId = 1; //use guid
var items = [];
function $(id) {
	return document.getElementById(id);
}

window.onload = function () {
	model.init();
	this.update();
	$("todo").addEventListener("keyup", function (event) {
		if (event.keyCode != 13) return;
		addTodo();
	});
	// 这里赋值const是没有用的，后边用不了
	const taskList = document.querySelector(".tasks-list__list");
	const finishedTaskList = document.querySelector(
		".finished-tasks-list__list"
	);
	const finishedHeader = document.querySelector(".finished-header");
	const finishedContainer = document.querySelector(
		".finished-tasks-list__container"
	);

	taskList.addEventListener("click", clickTask);
	finishedHeader.addEventListener("click", toggleFinished);
	finishedTaskList.addEventListener("click", clickTask);
};
function toggleFinished() {
    const finishedHeader = document.querySelector(".finished-header");
	const chevronIcon = finishedHeader.querySelector("i");
	if (chevronIcon.classList.contains("finished-list-closed")) {
		// console.log("yes");
		chevronIcon.classList.replace(
			"finished-list-closed",
			"finished-list-open"
		);
	} else if (chevronIcon.classList.contains("finished-list-open")) {
		chevronIcon.classList.replace(
			"finished-list-open",
			"finished-list-closed"
		);
	}
	finishedTaskList.classList.toggle("hidden");
}

function clickTask(e) {
    // taskStore = model.data.items;
	// const eventTarget = e.target;
	// if (eventTarget.classList.contains("fa-star")) {
	// 	const parentTask = eventTarget.parentNode.parentNode;
	// 	taskStore = taskStore.map((task) => {
	// 		if (task.taskId === parentTask.id) {
	// 			return { ...task, starred: !task.starred };
	// 		} else {
	// 			return task;
	// 		}
	// 	});
	// }
	// if (eventTarget.classList.contains("fa-check-circle")) {
	// 	finishedContainer.classList.remove("hidden");
	// 	const parentTask = eventTarget.parentNode.parentNode;
	// 	taskStore = taskStore.map((task) => {
	// 		if (task.taskId === parentTask.id) {
	// 			return { ...task, finished: !task.finished };
	// 		} else {
	// 			return task;
	// 		}
	// 	});
    // }
    // update();
	// updateDom(taskStore);
}

function update() {
	model.flush();
	var data = model.data;

	var list = $("list");
	list.innerHTML = "";
	for (var i = 0; i < data.items.length; ++i) {
		(function (index) {
			var it = data.items[index];
			createTodo(it);
		})(i);
	}

	var activeCount = 0;
	data.items.forEach(function (item) {
		if (!item.completed) ++activeCount;
	});
	$("count").innerHTML = activeCount + " items left";

	var taskStore = data.items;
	taskList = document.querySelector(".tasks-list__list");
	finishedTaskList = document.querySelector(".finished-tasks-list__list");
	taskList.innerHTML = "";
	finishedTaskList.innerHTML = "";
	taskStore
		.filter((task) => !task.completed && task.starred)
		.forEach((task) => taskList.append(createDomLi(task)));

	taskStore
		.filter((task) => !task.completed && !task.starred)
		.forEach((task) => taskList.append(createDomLi(task)));

	taskStore
		.filter((task) => task.completed && task.starred)
		.forEach((task) => finishedTaskList.append(createDomLi(task)));

	taskStore
		.filter((task) => task.completed && !task.starred)
		.forEach((task) => finishedTaskList.append(createDomLi(task)));
}

function createTodo(it) {
	var msg = it.msg;
	var item = document.createElement("div");
	var itemContent = document.createElement("div");
	var itemDelete = document.createElement("button");
	item.classList.add("list-item");
	it.completed && item.classList.add(CL_COMPLETED);
	itemContent.innerHTML = msg;
	itemContent.className = "content";
	itemDelete.type = "button";
	itemDelete.innerHTML = " X ";
	itemDelete.className = "delete";
	item.appendChild(itemContent);
	item.appendChild(itemDelete);
	list.insertBefore(item, list.childNodes[0]);

	// bind events
	item.addEventListener("click", function () {
		it.completed = !it.completed;
		update();
	});
	itemDelete.addEventListener("click", function (event) {
		data.items.splice(index, 1);
		update();
		event.stopPropagation();
	});
}
function createDomLi(taskObj) {
	const newLi = document.createElement("li");
	newLi.className = "task-list-item";
	newLi.id = taskObj.taskId;
	const newCheckButton = document.createElement("button");
	newCheckButton.type = "button";
	newCheckButton.className = "tasks-list-item__check-button";
	if (!taskObj.completed) {
		newCheckButton.innerHTML = "<i class='far fa-circle'></i>";
	} else {
		newCheckButton.innerHTML = "<i class='fas fa-check-circle'></i>";
    }

    newCheckButton.addEventListener("click", function (event) {
		taskObj.completed = !taskObj.completed;
		update();
		event.stopPropagation();
    });
    
	const newTaskText = document.createElement("span");
	newTaskText.innerText = taskObj.msg;
    newTaskText.className = "task-text";
    
	const newFavoriteButton = document.createElement("button");
	newFavoriteButton.type = "button";
	newFavoriteButton.className = "task-list-item__favorite-button";
	if (!taskObj.starred) {
		newFavoriteButton.innerHTML = "<i class='far fa-star gray'></i>";
	} else {
		newFavoriteButton.innerHTML = "<i class='fas fa-star'></i>";
    }

    newFavoriteButton.addEventListener("click", function (event) {
		taskObj.starred = !taskObj.starred;
		update();
		event.stopPropagation();
    });

	newLi.append(newCheckButton, newTaskText, newFavoriteButton);
	return newLi;
}

function addTodo() {
	var todo = $("todo");
	var msg = todo.value;
	var data = model.data;
	if (msg == "") {
		console.warn("msg is empty");
		return;
	}

	data.items.push({
        taskId: `task${taskId}`,
		msg: msg,
		completed: false,
		starred: false
    });
    taskId++;
	update();
	todo.value = "";
}
