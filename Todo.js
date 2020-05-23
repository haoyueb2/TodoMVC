var leftAmount = 0;

//注册还是要在onload里不然的话textAddevent时候是空的
window.onload = function () {
    var text = $("text");

    //键盘提交
    text.addEventListener("keydown", function (e) {
        // alert(e.keyCode);
        if (e.keyCode === 13) {
            addTodo(text.value);
        }
    });
    //按钮提交
    var button = document.getElementById("submit");
    button.addEventListener("click", function (e) {
        // alert("debug");
        addTodo(text.value);
    });
};
function $(id) {
    return document.getElementById(id);
}

function addTodo(value) {
    if (value == "") return;

    var list = $("list");

    //此处必须用var新定义
    var item = document.createElement("div");
    item.className = "item";
    var itemContent = document.createElement("div");
    itemContent.className = "item-content";
    itemContent.innerHTML = value;
    var deleteButton = document.createElement("button");
    deleteButton.innerHTML = "X";
    item.appendChild(itemContent);
    item.appendChild(deleteButton);
    list.insertBefore(item, list.firstChild);

    deleteButton.addEventListener("click", function (e) {
        if (!item.classList.contains("completed")) leftAmount--;

        updateAmount();
        list.removeChild(item);
        e.stopPropagation();
    });

    item.addEventListener("click", function (e) {
        if (item.classList.contains("completed")) {
            leftAmount++;
            item.classList.remove("completed");
        } else {
            leftAmount--;
            item.classList.add("completed");
        }
        updateAmount();
    });
    //list.innerHTML = value+"<br/>"+list.innerHTML;

    leftAmount++;

    updateAmount();
    text.value = "";
}
function updateAmount() {
    var amountText = $("amount");
    amountText.innerHTML = leftAmount + " left";
}
