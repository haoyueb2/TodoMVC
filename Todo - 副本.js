function $(id) {
    return document.getElementById(id);
  }
  
  var activeAmount = 0;
  
  function addTodo() {
    var todoInput = $('todoInput');
    var message = todoInput.value;
    var listDiv = $('listDiv');
    var activeDiv = $('activeDiv');
    
    if (message == '') {
      alert('Input is empty!');
      return;
    }
    
    listDiv.innerHTML = message + '<br>' +  listDiv.innerHTML;
    
    ++activeAmount;
    activeDiv.innerHTML = activeAmount + ' items left';
    
    todoInput.value = '';
  }
  
  // Binding click event
  $('addButton').addEventListener('click', addTodo);
  // Binding keyboard event
  $('todoInput').addEventListener('keyup', function(event) {
    //console.log('0x' + event.keyCode.toString(16));
    if (event.keyCode != 13) return; // ASCII code "enter"
    addTodo();
  });