var activeCount = 0;
var isEdit = false;
var editId;
function $(id) {
	return document.querySelector(id);
}
var $All = function(id) {
    return document.querySelectorAll(id);
};

window.onload = function () {
	model.init();
	var addBtn = $("#add");
	var outModel = $("#out-model");
	var todo = $("#todo");
	var cancel = $("#cancel");
	var submit = $("#submit");
	var finishedHeader = $(".finished-header");
	var dropdownbtn = $("#dropdownbtn");
	var toggleAll = $("#toggle-all");
	var deleteFinished = $("#delete-finished");
	var deadlineInput = $("#deadline-input");
	addBtn.addEventListener(
		"click",
		function () {
			addBtn.style.display = "none";
			outModel.style.display = "block";
			isEdit = false;
			// 自动弹出软键盘
			todo.focus();
		},
		false
	);

	submit.addEventListener(
		"click",
		function () {
			addTask();
			outModel.style.display = "none";
			addBtn.style.display = "block";
			todo.value = "";
			deadlineInput.value = "";
		},
		false
	);

	cancel.addEventListener(
		"click",
		function () {
			outModel.style.display = "none";
			addBtn.style.display = "block";
			todo.value = "";
			deadlineInput.value = "";
			update();
		},
		false
	);
	dropdownbtn.addEventListener("click", function () {
		$("#dropdown-content").classList.toggle("hidden");
	});

	todo.addEventListener("keyup", function (event) {
		if (event.keyCode != 13) return;
		addTask();
		outModel.style.display = "none";
		addBtn.style.display = "block";
		todo.value = "";
		deadlineInput.value = "";
	});

	finishedHeader.addEventListener("click", toggleFinished);
	//全部完成的取消需要保存上一轮的完成吗？
	toggleAll.addEventListener("click", function () {
		if (activeCount != 0) {
			model.data.items.forEach(function (task) {
				task.finished = true;
			});
		} else {
			model.data.items.forEach(function (task) {
				task.finished = false;
			});
		}

		update();
	});

	deleteFinished.addEventListener("click", function () {
		model.data.items
			.filter(function (task) {
				return task.finished;
			})
			.forEach(function (task) {
				// 保持最新在前
				model.data.items = model.data.items.filter(function (task) {
					return !task.finished;
				});
				update();
			});
	});
	$("#menubtn").addEventListener("click", function () {
		$("#menu").classList.toggle("hidden");
	});
	this.$("#menu").addEventListener("click", function () {
		$("#menu").classList.toggle("hidden");
	});

	this.$("#theme1").addEventListener("click",function() {
		var nodelist = $All(".theme-color");
		nodelist.forEach(function(node) {
			node.classList.remove("theme-color");
			node.classList.add("theme-color2");
		})
	})
	this.update();
};
function toggleFinished() {
	var finishedHeader = $(".finished-header");
	var chevronIcon = finishedHeader.querySelector("i");
	if (chevronIcon.classList.contains("finished-list-closed")) {
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
	var finishedTaskList = $("#finished-tasks-list");
	finishedTaskList.classList.toggle("hidden");
}

function update() {
	model.flush();
	var data = model.data;

	activeCount = 0;
	data.items.forEach(function (item) {
		if (!item.finished) ++activeCount;
	});
	$("#count").innerHTML = activeCount + " items left";

	taskList = $("#tasks-list");
	finishedTaskList = $("#finished-tasks-list");
	taskList.innerHTML = "";
	finishedTaskList.innerHTML = "";
	data.items
		.filter(function (task) {
			return !task.finished;
		})
		.forEach(function (task) {
			// 保持最新在前
			taskList.insertBefore(createListItem(task), taskList.firstChild);
		});
	data.items
		.filter(function (task) {
			return task.finished;
		})
		.forEach(function (task) {
			finishedTaskList.insertBefore(
				createListItem(task),
				finishedTaskList.firstChild
			);
		});
}

function createListItem(taskObj) {
	var item = document.createElement("li");
	item.className = "task-list-item";
	item.id = taskObj.taskId;
	var checkButton = document.createElement("button");
	checkButton.type = "button";
	checkButton.className = "tasks-list-item_check-button";
	if (!taskObj.finished) {
		checkButton.innerHTML = "<i class='far fa-circle'></i>";
	} else {
		checkButton.innerHTML = "<i class='fas fa-check-circle'></i>";
	}

	checkButton.addEventListener("click", function (event) {
		taskObj.finished = !taskObj.finished;
		// 完成某项自动打开已完成
		if ($("#finished-tasks-list").classList.contains("hidden")) {
			toggleFinished();
		}
		//Todo: 考虑有finish才hidden
		update();
		event.stopPropagation();
	});

	var taskContent = document.createElement("div");
	taskContent.className = "task-content";
	var newTaskText = document.createElement("span");
	newTaskText.innerText = taskObj.msg;
	newTaskText.className = "task-text";

	var taskDeadline = document.createElement("span");
	if (taskObj.deadline) {
		taskDeadline.innerText = taskObj.deadline;
		taskDeadline.className = "task-deadline";
	}
	taskContent.append(newTaskText, taskDeadline);

	var starButton = document.createElement("button");
	starButton.type = "button";
	starButton.className = "task-list-item_star-button";
	if (!taskObj.starred) {
		starButton.innerHTML = "<i class='far fa-star gray'></i>";
	} else {
		starButton.innerHTML = "<i class='fas fa-star'></i>";
	}

	starButton.addEventListener("click", function (event) {
		taskObj.starred = !taskObj.starred;
		update();
		event.stopPropagation();
	});

	item.addEventListener("click", function (event) {
		id = Number(this.id);
		var currentItem = model.data.items.filter(function (item) {
			return item.taskId == id;
		})[0];
		// console.log(currentItem);

		$("#todo").value = currentItem.msg;
		$("#deadline-input").value = currentItem.deadline;
		$("#add").style.display = "none";
		$("#out-model").style.display = "block";
		isEdit = true;
		// 自动弹出软键盘
		editId = id;
		todo.focus();
	});

	item.append(checkButton, taskContent, starButton);
	return item;
}

function addTask() {
	var todo = $("#todo");
	var deadlineInput = $("#deadline-input");
	var msg = todo.value;
	var data = model.data;
	var deadline = deadlineInput.value;
	var taskId = data.taskId;
	// console.log(deadline);
	if (msg == "") {
		console.warn("msg is empty");
		alert("please input your todo");
		return;
	}
	if (!isEdit) {
		data.items.push({
			taskId: taskId,
			msg: msg,
			deadline: deadline,
			finished: false,
			starred: false
		});
		data.taskId++;
	} else {
		var currentItem = model.data.items.filter(function (item) {
			return item.taskId == editId;
		})[0];
		currentItem.msg = msg;
		currentItem.deadline = deadline;
	}

	update();
}
