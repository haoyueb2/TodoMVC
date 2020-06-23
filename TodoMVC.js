var taskId = 1; //use guid
var items = [];
function $(id) {
	return document.querySelector(id);
}

window.onload = function () {
	model.init();

	var addBtn = $("#add");
	var outModel = $("#out-model");
	var todo = $("#todo");
	var cancel = $("#cancel");
	var submit = $("#submit");
	var finishedHeader = $(".finished-header");
	var dropdownbtn = $("#dropdownbtn");
	var finishAll = $("#finish-all");
	var deleteFinished = $("#delete-finished");
	addBtn.addEventListener(
		"click",
		function () {
			addBtn.style.display = "none";
			outModel.style.display = "block";
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
		},
		false
	);

	cancel.addEventListener(
		"click",
		function () {
			outModel.style.display = "none";
			addBtn.style.display = "block";
			todo.value = "";
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
	});

	finishedHeader.addEventListener("click", toggleFinished);
	//全部完成的取消需要保存上一轮的完成吗？
	finishAll.addEventListener("click", function () {
		model.data.items.forEach(function (task) {
			task.finished = !task.finished;;
		});
		update();
	});

	deleteFinished.addEventListener("click",function() {
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

	var activeCount = 0;
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
		//Todo: 考虑有finish才hidden
		update();
		event.stopPropagation();
	});

	var newTaskText = document.createElement("span");
	newTaskText.innerText = taskObj.msg;
	newTaskText.className = "task-text";

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

	item.append(checkButton, newTaskText, starButton);
	return item;
}

function addTask() {
	var todo = $("#todo");

	var msg = todo.value;
	var data = model.data;
	if (msg == "") {
		console.warn("msg is empty");
		alert("please input your todo~");
		return;
	}

	data.items.push({
		taskId: `task${taskId}`,
		msg: msg,
		finished: false,
		starred: false
	});
	taskId++;
	update();
}
