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

    var amountText = $("amount");
    var list = $("list");

    //此处必须用var新定义
    var item = document.createElement("div");
    item.className = "item";
    item.innerHTML = value;
    list.insertBefore(item, list.firstChild);
    item.addEventListener("click", function (e) {
        leftAmount--;

        amountText.innerHTML = leftAmount + " left";
        list.removeChild(item);
    });
    //list.innerHTML = value+"<br/>"+list.innerHTML;
    
    leftAmount++;

    amountText.innerHTML = leftAmount + " left";
    text.value = "";
}
