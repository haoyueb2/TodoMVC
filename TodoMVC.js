const CL_COMPLETED = "completed";

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
};



function update() {
    model.flush();
    var data = model.data;
    
	var list = $("list");
	list.innerHTML = "";
	for (var i = 0; i < data.items.length; ++i) {
		(function (index) {
			var it = data.items[index];
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
		})(i);
	}

	var activeCount = 0;
	data.items.forEach(function (item) {
		if (!item.completed) ++activeCount;
	});
	$("count").innerHTML = activeCount + " items left";
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
		msg: msg,
		completed: false
	});
	update();
	todo.value = "";
}
