var activeCount = 0;
var isEdit = false;
var editId;
var deviceWidth = window.screen.width;
var deviceHeight = window.screen.height;
function $(id) {
	return document.querySelector(id);
}
var $All = function (id) {
	return document.querySelectorAll(id);
};

function toggleInput() {
	$("#add").classList.toggle("hidden");
	$("#out-model").classList.toggle("hidden");
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
	var toggleAll = $("#toggle-all");
	var deleteFinished = $("#delete-finished");
	var deadlineInput = $("#deadline-input");

	addBtn.addEventListener(
		"click",
		function () {
			toggleInput();
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
			toggleInput();
			todo.value = "";
			deadlineInput.value = "";
		},
		false
	);

	cancel.addEventListener(
		"click",
		function () {
			toggleInput();
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
		toggleInput();
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

	this.$("#theme1").addEventListener("click", function () {
		var nodelist = $All(".theme-color");
		nodelist.forEach(function (node) {
			node.classList.remove("theme-color");
			node.classList.add("theme-color2");
		});
	});
	this.$All(".switch-list").forEach(function (item) {
		item.addEventListener("click", function () {
			model.data.filter = this.innerText;
			$("#title").innerHTML = this.innerText;

			if (this.innerText == "Finished") {
				$(".finished-header").classList.toggle("hidden");
				$("#add").classList.toggle("hidden");
				$("#count").classList.toggle("hidden");
			} else {
				//如果添加按钮被隐藏，则相关元素全部打开
				if ($("#add").classList.contains("hidden")) {
					$(".finished-header").classList.toggle("hidden");
					$("#add").classList.toggle("hidden");
					$("#count").classList.toggle("hidden");
				}
			}
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
	var items = data.items;
	activeCount = 0;

	taskList = $("#tasks-list");
	finishedTaskList = $("#finished-tasks-list");
	taskList.innerHTML = "";
	finishedTaskList.innerHTML = "";

	if (data.filter == "Starred") {
		items = data.items.filter(function (task) {
			return task.starred;
		});
	} else if (data.filter == "Scheduled") {
		items = data.items.filter(function (task) {
			return task.deadline != "";
		});
	} else if (data.filter == "Finished") {
		items = data.items.filter(function (task) {
			return task.finished;
		});
	}
	//显示当前类别剩下的
	items.forEach(function (item) {
		if (!item.finished) ++activeCount;
	});
	$("#count").innerHTML = activeCount + " items left";
	// console.log(items);
	items
		.filter(function (task) {
			return !task.finished;
		})
		.forEach(function (task) {
			// 保持最新在前
			taskList.insertBefore(createListItem(task), taskList.firstChild);
		});
	items
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
	var newTaskText = document.createElement("label");
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
		toggleInput();
		isEdit = true;
		// 自动弹出软键盘
		editId = id;
		todo.focus();
	});

	// 点击事件
	var oldTouch;
	// 触碰的元素
	var touchDom;

	var del = false;
	var offset;
	// 滑动事件绑定
	item.addEventListener(
		"touchstart",
		function (event) {
			oldTouch = event.touches[0];
			touchDom = event.currentTarget;
			// console.log(touchDom)
		},
		false
	);
	// 左右滑删除
	item.addEventListener(
		"touchmove",
		function (event) {
			var newTouch = event.touches[0];
			offset = newTouch.clientX - oldTouch.clientX;
			touchDom.style.transition = "all 0.2s";
			touchDom.style.left = offset + "px";
			if (Math.abs(offset) >= deviceWidth / 2.5) {
				del = true;
				touchDom.style.color = "red";
			}
		},
		false
	);
	item.addEventListener(
		"touchend",
		function (event) {
			if (!del) {
				touchDom.style.left = 0;
			}
			else{
				for (var i = 0; i < model.data.items.length; i++) {
					if (model.data.items[i].taskId == Number(touchDom.id)) {
						model.data.items.splice(i, 1);
					}
				}
				update();
			}
			touchDom = null;
			oldTouch = null;
		},
		false
	);

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
