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
function displayDom(dom) {
	if(dom.classList.contains("hidden")) {
		dom.classList.toggle("hidden");
	}
}
function hideDom(dom) {
	if(!dom.classList.contains("hidden")) {
		dom.classList.toggle("hidden");
	}
}
function addToMyDay(isOpen) {
	if(isOpen) {
		if(!$("#add-myDay").classList.contains("added-myDay")) {
			// console.log($("#add-myDay").childNodes[1])
			$("#add-myDay").innerHTML = "<i class='fa fa-sun-o'></i>Added to My Day";
			$("#add-myDay").classList.toggle("added-myDay");
		}
	}
	else {
		if($("#add-myDay").classList.contains("added-myDay")) {
			$("#add-myDay").innerHTML = "<i class='fa fa-sun-o'></i>Add to My Day";
			$("#add-myDay").classList.toggle("added-myDay");
		}
	}
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
	finishedHeader.addEventListener("click", toggleFinished);

	//输入编辑相关注册
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
			addToMyDay(false);
		},
		false
	);

	cancel.addEventListener(
		"click",
		function () {
			toggleInput();
			todo.value = "";
			deadlineInput.value = "";
			addToMyDay(false);
			update();
		},
		false
	);

	todo.addEventListener("keyup", function (event) {
		if (event.keyCode != 13) return;
		addTask();
		toggleInput();
		todo.value = "";
		deadlineInput.value = "";
		addToMyDay(false);
	});

	$("#add-myDay").addEventListener("click",function() {
		$("#add-myDay").classList.toggle("added-myDay");
	});

	//下拉菜单注册
	dropdownbtn.addEventListener("click", function () {
		$("#dropdown-content").classList.toggle("hidden");
	});
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
		hideDom($("#dropdown-content"));
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
			hideDom($("#dropdown-content"));
	});
	
	$("#sort-deadline").addEventListener("click", function () {
		model.data.items.sort(function (x, y) {
			//返回小于0，x在前,目的是使有日期的和日期早的排后边
			if (x.deadline == "" && y.deadline != "") {
				return -1;
			} else if (x.deadline != "" && y.deadline == "") {
				return 1;
			} else if (x.deadline == "" && y.deadline == "") {
				return 0;
			} else {
				// 火狐不能直接解析-分割的日期
				date_x = Date.parse(x.deadline.replace(/\-/g, "/"));
				date_y = Date.parse(y.deadline.replace(/\-/g, "/"));
				return date_y-date_x;
			}	
		});
		model.data.priority =1;
		model.data.items.forEach(function(item) {
			// item.priority = model.data.priority;
			item.priority = model.data.priority;
			model.data.priority++;

		});
		hideDom($("#dropdown-content"));
		// console.log(items);
		update();
	});

	$("#sort-creation").addEventListener("click", function () {
		model.data.items.sort(function (x, y) {
			//返回小于0，x在前,目的是使id大的在后边
			return x.taskId - y.taskId;

		});
		model.data.priority =1;
		model.data.items.forEach(function(item) {
			item.priority = model.data.priority;
			model.data.priority++;

		});
		hideDom($("#dropdown-content"));
		update();
	});

	$("#toggle-finished").addEventListener("click",function() {
		$(".finished-tasks-list_container").classList.toggle("hidden");
		hideDom($("#dropdown-content"));
	})
	//侧栏菜单注册
	$("#menubtn").addEventListener("click", function () {
		
		displayDom($("#menu"));
	});
	this.$("#menu").addEventListener("click", function () {
		setTimeout(function() {
			hideDom($("#menu"));
		},100);
		
	});
	var objToday = new Date(),
	weekday = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'),
	dayOfWeek = weekday[objToday.getDay()],
	domEnder = function() { var a = objToday; if (/1/.test(parseInt((a + "").charAt(0)))) return "th"; a = parseInt((a + "").charAt(1)); return 1 == a ? "st" : 2 == a ? "nd" : 3 == a ? "rd" : "th" }(),
	dayOfMonth = today + ( objToday.getDate() < 10) ? '0' + objToday.getDate() + domEnder : objToday.getDate() + domEnder,
	months = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'),
	curMonth = months[objToday.getMonth()];
	var today =dayOfWeek + ", " + curMonth + " " + dayOfMonth;

	$("#menu-title").innerText=today;

	$("#toggle-theme").addEventListener("click",function(e) {
		$("#theme-list").classList.toggle("hidden");
		e.stopPropagation();
	})
	this.$All(".switch-theme").forEach(function (item) {
		item.addEventListener("click",function() {
			model.data.theme = window.getComputedStyle(item).backgroundColor;
			update();
		})
	})
	this.$All(".switch-list").forEach(function (item) {
		item.addEventListener("click", function () {
			model.data.filter = this.innerText;
			$("#title").innerHTML = this.innerText;

			if (this.innerText == "Finished") {
				hideDom($(".finished-header"));
				hideDom($("#add"));
				hideDom($("#count"));
			} else {
				displayDom($("#add"));
				displayDom($(".finished-header"));
				displayDom($("#count"));
			}
			displayDom($("#title"));
			hideDom($("#search"));
			$("#search-input").value="";
			update();
		});
	});
	this.$("#switch-search").addEventListener("click",function () {
		model.data.filter = "Search";
		hideDom($("#title"));
		displayDom($("#search"));
		hideDom($("#add"));
		});

	this.$("#search-submit").addEventListener("click",function() {
		// console.log("submit")
		update();
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
	var items = data.items;
	activeCount = 0;

	taskList = $("#tasks-list");
	finishedTaskList = $("#finished-tasks-list");
	taskList.innerHTML = "";
	finishedTaskList.innerHTML = "";

	document.body.style.backgroundColor = model.data.theme;
	if (data.filter == "Important") {
		items = data.items.filter(function (task) {
			return task.starred;
		});
	} else if (data.filter == "Planned") {
		items = data.items.filter(function (task) {
			return task.deadline != "";
		});
	} else if (data.filter == "Finished") {
		items = data.items.filter(function (task) {
			return task.finished;
		});
	} else if(data.filter == "My Day") {
		items = data.items.filter(function (task) {
			return task.myDay;
		});
	} else if(data.filter == "Search") {
		items = data.items.filter(function (task) {
			return task.msg.search($("#search-input").value) != -1;
		});
	}
	//按照priority排序，大的在前边
	items.sort(function (x, y) {
		if (x.priority < y.priority) {
			return 1;
		}
		if (x.priority > y.priority) {
			return -1;
		}
		return 0;
	});

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
			taskList.append(createListItem(task));
		});
	items
		.filter(function (task) {
			return task.finished;
		})
		.forEach(function (task) {
			finishedTaskList.append(createListItem(task));
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
		checkButton.innerHTML = "<i class='fa fa-circle-o'></i>";
	} else {
		checkButton.innerHTML = "<i class='fa fa-check-circle'></i>";
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
		//如果deadline在过去则则设置为红色
		d = new Date();
		today = d.getFullYear()+"/"+(Number(d.getMonth())+1)+"/"+d.getDate();
		var deadlineUnix = Date.parse(taskObj.deadline.replace(/\-/g, "/"));
		var todayUnix = Date.parse(today);
		if(todayUnix > deadlineUnix) {
			taskDeadline.className = "task-deadline out-dated";
		}

	}

	var taskMyDay = document.createElement("span");
	taskMyDay.className="task-myDay";
	if(taskObj.myDay) {
		taskMyDay.innerHTML ="My Day"
	}
	taskContent.append(newTaskText, taskDeadline,taskMyDay);

	var starButton = document.createElement("button");
	starButton.type = "button";
	starButton.className = "task-list-item_star-button";
	if (!taskObj.starred) {
		starButton.innerHTML = "<i class='fa fa-star-o'></i>";
	} else {
		starButton.innerHTML = "<i class='fa fa-star'></i>";
	}

	starButton.addEventListener("click", function (event) {
		taskObj.starred = !taskObj.starred;
		// 如果star，优先度置于最高，置顶
		if (taskObj.starred) {
			taskObj.priority = model.data.priority;
			model.data.priority++;
		}

		update();
		event.stopPropagation();
	});

	item.addEventListener("click", function (event) {
		id = Number(this.id);
		var currentItem = getDataItemById(id);
		// console.log(currentItem);
		$("#todo").value = currentItem.msg;
		$("#deadline-input").value = currentItem.deadline;
		addToMyDay(currentItem.myDay);
		if ($("#out-model").classList.contains("hidden")) {
			toggleInput();
		}
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
	var verticalOffset;
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
			// console.log(event.currentTarget);
			var newTouch = event.touches[0];
			offset = newTouch.clientX - oldTouch.clientX;
			verticalOffset = newTouch.clientY - oldTouch.clientY;

			if (Math.abs(verticalOffset) > 50) {
				del = false;
				touchDom.style.backgroundColor = "transparent";
			} else {
				touchDom.style.left = offset + "px";
				if (Math.abs(offset) >= deviceWidth / 2.5) {
					del = true;
					touchDom.style.backgroundColor = "red";
				} else {
					del = false;
					touchDom.style.backgroundColor = "white";
				}
			}
		},
		false
	);
	item.addEventListener(
		"touchend",
		function (event) {
			if (Math.abs(verticalOffset) > 50) {
				var myLocation = event.changedTouches[0];

				var realTarget = document.elementFromPoint(
					myLocation.clientX,
					myLocation.clientY
				);
				var originItem;
				var targetItem;
				//防止拖动位置不在item上
				try {
					if (realTarget.nodeName == "LABEL") {
						realTarget = realTarget.parentNode.parentNode;
					}
					console.log(touchDom, realTarget);
					originItem = getDataItemById(touchDom.id);
					targetItem = getDataItemById(realTarget.id);
					var temp = originItem.priority;
					originItem.priority = targetItem.priority;
					targetItem.priority = temp;
					realTarget.style.backgroundColor = "transparent";
				} catch (e) {
					console.log(e);
				}
			}
			if (!del) {
				touchDom.style.left = 0;
			} else {
				for (var i = 0; i < model.data.items.length; i++) {
					if (model.data.items[i].taskId == Number(touchDom.id)) {
						model.data.items.splice(i, 1);
					}
				}
			}
			setTimeout(update, 100);
			// update();
			touchDom = null;
			oldTouch = null;
		},
		false
	);

	item.append(checkButton, taskContent, starButton);
	return item;
}
function getDataItemById(id) {
	return model.data.items.filter(function (item) {
		return item.taskId == id;
	})[0];
}
function addTask() {
	var todo = $("#todo");
	var deadlineInput = $("#deadline-input");
	var msg = todo.value;
	var data = model.data;
	var deadline = deadlineInput.value;
	var taskId = data.taskId;
	var priority = data.priority;
	var myDay = $("#add-myDay").classList.contains("added-myDay");
	//在Important列表添加时，自动加入重要属性
	var starred = data.filter == "Important";
	//在Planned列表添加时，如果未设置截止日期，自动设为今天
	if(data.filter =="Planned" && deadline =="") {
		d = new Date();
		//补零
		var month = String(d.getMonth()+1).padStart(2,'0');
		var date = String(d.getDate()).padStart(2,'0');
		today = d.getFullYear()+"-"+month+"-"+date;
		deadline = today;
	}
	//在My Day列表添加时，如果未设置我的一天，自动设为My Day
	if(data.filter=="My Day") {
		myDay = true;
	}


	if (msg == "") {
		console.warn("msg is empty");
		alert("please input your todo");
		return;
	}
	if (!isEdit) {
		data.items.push({
			taskId: taskId,
			priority: priority,
			msg: msg,
			deadline: deadline,
			myDay: myDay,
			finished: false,
			starred: starred
		});
		data.taskId++;
		data.priority++;
	} else {
		var currentItem = model.data.items.filter(function (item) {
			return item.taskId == editId;
		})[0];
		currentItem.msg = msg;
		currentItem.deadline = deadline;
		currentItem.myDay = myDay;
	}

	update();
}
