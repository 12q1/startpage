//clock functions
function updateClock() {
    var now = new Date();
    var dname = now.getDay(),
        mo = now.getMonth(),
        dnum = now.getDate(),
        yr = now.getFullYear(),
        hou = now.getHours(),
        min = now.getMinutes(),
        pe = "AM";

    if (hou >= 12) {
        pe = "PM";
    }
    if (hou == 0) {
        hou = 12;
    }
    if (hou > 12) {
        hou = hou - 12;
    }

    Number.prototype.pad = function (digits) {
        for (var n = this.toString(); n.length < digits; n = 0 + n);
        return n;
    }

    var months = ["January", "February", "March", "April", "May", "June", "July", "Augest", "September", "October", "November", "December"];
    var week = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var ids = ["dayname", "month", "daynum", "year", "hour", "minutes", "period"];
    var values = [week[dname], months[mo], dnum.pad(2), yr, hou.pad(2), min.pad(2), pe];
    for (var i = 0; i < ids.length; i++)
        document.getElementById(ids[i]).firstChild.nodeValue = values[i];
}

function initClock() {
    updateClock();
    window.setInterval("updateClock()", 1);
}

//searchbox functions

const f = document.getElementById('form');
const q = document.getElementById('query');

const googleSearch = (event) => {
    event.preventDefault();
    const url = "https://www.google.com/search?q=" + q.value;
    const win = window.open(url, '_self');
    win.focus();
}
f.addEventListener('submit', googleSearch);

//Todo functions

// Create a "close" button and append it to each list item
var myNodelist = document.getElementsByTagName("LI");
var i;
for (i = 0; i < myNodelist.length; i++) {
    var span = document.createElement("SPAN");
    var txt = document.createTextNode("\u00D7");
    span.className = "close";
    span.appendChild(txt);
    myNodelist[i].appendChild(span);
}

// Click on a close button to hide the current list item
var close = document.getElementsByClassName("close");
var i;
for (i = 0; i < close.length; i++) {
    close[i].onclick = function () {
        var div = this.parentElement;
        div.style.display = "none";
    }
}

// Add a "checked" symbol when clicking on a list item
var list = document.querySelector('ul');
list.addEventListener('click', function (ev) {
    if (ev.target.tagName === 'LI') {
        ev.target.classList.toggle('checked');
        updateTodoStatusLocalStorage(ev.target.id)
    }
}, false);

//update local storage if user checks a list item
const updateTodoStatusLocalStorage = (id) => {
    const todos = JSON.parse(localStorage.todos);
    const updateIndex = todos.findIndex(x => x.id === parseInt(id))
    todos[updateIndex].checked = !todos[updateIndex].checked
    localStorage.setItem('todos', JSON.stringify(todos));
    console.log(todos)
}

// Create a new list item
const newElement = (newTodoObject) => {
    var li = document.createElement("li");
    const inputValue = newTodoObject.todo;
    li.setAttribute("id", newTodoObject.id);
    if (newTodoObject.checked) li.setAttribute("class", "checked");
    var t = document.createTextNode(inputValue);
    li.appendChild(t);
    if (inputValue === '') {
        alert("You must write something!");
    } else {
        document.getElementById("myUL").appendChild(li);
    }
    document.getElementById("todo-input").value = "";

    var span = document.createElement("SPAN");
    var txt = document.createTextNode("\u00D7");
    span.className = "close";
    span.appendChild(txt);
    li.appendChild(span);

    for (i = 0; i < close.length; i++) {
        close[i].onclick = function () {
            var div = this.parentElement;
            deleteTodoFromLocalStorage(this.parentElement.id)
            div.style.display = "none";
        }
    }
}

const deleteTodoFromLocalStorage = (id) => {
    const oldTodos = JSON.parse(localStorage.todos);
    const updatedTodos = oldTodos.filter(x => x.id !== parseInt(id));
    localStorage.setItem('todos', JSON.stringify(updatedTodos));
}

// Wrapper for newElement that stores it in localstorage for persistence
const newElementLocalStore = () => {
    //prevent more than 9 items
    const todoLength = JSON.parse(localStorage.todos).length;
    if (todoLength >= 9) return //do nothing just return
    //Todo: add something to notify user that it failed like shake the element

    //cheteck if input is valid
    const todoText = document.getElementById("todo-input").value;
    if (todoText.length < 1) return //do nothing just return

    //increment todo counter to use as IDs
    const todoNumber = JSON.parse(localStorage.todoCounter) + 1;
    localStorage.setItem("todoCounter", todoNumber);


    //create todo object with ID
    const newTodoObject = {
        todo: todoText,
        id: todoNumber,
        checked: false
    }

    let todoArray = []

    //if there are existing todos in local storage, put them back in
    if (localStorage.todos) {
        todoArray = JSON.parse(localStorage.todos);
    }
    todoArray.push(newTodoObject);

    //add it to the local storage
    localStorage.setItem('todos', JSON.stringify(todoArray));
    console.log(localStorage)

    //create new element in the DOM for the item
    newElement(newTodoObject);

    //return false to prevent page reload
    return false
}

//initialize to-do list, rebuilds from localStorage
//creates local storage items if they don't already exist
const initTodo = () => {
    if (!localStorage.todoCounter) localStorage.setItem("todoCounter", "0");
    if (!localStorage.todos) localStorage.setItem("todos", "[]");
    const oldTodos = JSON.parse(localStorage.todos);
    //if there's old todos from past sessions we reload them
    oldTodos.map(x => {
        newElement(x);
    })
}

//initializes all functions needed on page load
const initializer = () => {
    initTodo();
    initClock();
    initMediaFeed();
}

//creates an item used in the news feed section
const mediaBlocks = [];
const createMediaBlock = (mediaObject) => {
    console.log(mediaObject);
    const container = document.createElement('div');
    const div = document.createElement('div');
    const title = document.createTextNode(mediaObject.data.title);
    const timestamp = document.createElement('span');
    timestamp.setAttribute("class", "timestamp");
    const link = document.createElement('a');
    link.appendChild(title);
    link.href=mediaObject.data.url;
    const creationTime = new Date(mediaObject.data.created*1000);
    const creationText = document.createTextNode(`Posted on ${creationTime} by`);
    const createdAtSpan = document.createElement('p');
    createdAtSpan.appendChild(creationText);
    timestamp.appendChild(createdAtSpan);
    //get author link
    const author = document.createTextNode(mediaObject.data.author);
    const authorLink = document.createElement('a');
    authorLink.setAttribute('href',`https://reddit.com/u/${mediaObject.data.author}`)
    authorLink.appendChild(author);
    timestamp.appendChild(authorLink);
    const subreddit = mediaObject.data.subreddit;
    const domain = mediaObject.data.domain;
    //get subreddit link
    //concat the span

    //if media embed exists create element for it


    link.appendChild(title);
    div.appendChild(link);
    div.appendChild(timestamp);
    //convert createdAt to human readable
    div.setAttribute("class", "media-block");
    container.setAttribute("class", "media-block-container");
    container.appendChild(div);
    document.getElementById('media-feed').appendChild(container)

}


//reddit loader functions

const initMediaFeed = () => {
    fetch("https://www.reddit.com/.json").then(response => {
        return response.json();
    }).then(data => {
        const redditPosts = data.data.children;
        redditPosts.map(x => {
            //for every reddit post we create an media object
            createMediaBlock(x);
        })
    })
}

//video scrambler functions?
