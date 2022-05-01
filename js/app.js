const TODO_FORM = document.getElementById("todo-form");
const TODO_INPUT = document.getElementById("todo-input");
const CARD_BODY_1 = document.querySelectorAll('.card-body')[0];
const CARD_BODY_2 = document.querySelectorAll('.card-body')[1];
const TODO_LIST = document.querySelector('.list-group');
const FILTER_INPUT = document.getElementById("filter");
const CLEAR_BUTTON = document.getElementById("clear-todos");

event_listeners();



function event_listeners() {
    TODO_FORM.addEventListener("submit", form_validation);
    document.addEventListener("DOMContentLoaded", add_todos_to_UI_from_str);
    CARD_BODY_2.addEventListener("click", delete_todos_from_UI_$_str);
    FILTER_INPUT.addEventListener("keyup", filter_todos_UI);
    CLEAR_BUTTON.addEventListener("click", clear_UI_$_str);
}

function form_validation(e) {
    let new_todo = TODO_INPUT.value.trim();

    if (new_todo === "") {
        display_message("danger", "Add some todo!!!");
    } else {
        display_message("primary", "Your todo has been added to the list seccessfully.");
        add_todos_to_UI(new_todo);
        add_todos_to_str(new_todo);
    }

    e.preventDefault();
}

// //! Sends attention message to a user
function display_message(params_type, params_content) {
    let div = document.createElement("div");
    div.className = `alert alert-${params_type}`;
    div.textContent = params_content;

    CARD_BODY_1.appendChild(div);

    setTimeout(function () {
        div.remove();
    }, 2000);
}

function add_todos_to_UI(params_todo) {
    TODO_LIST.innerHTML += `
    <li class="list-group-item d-flex justify-content-between align-items-center">
        ${params_todo}
        <a href="#">
            <i style="font-size: 1.5rem;" class="bi bi-x"></i>
        </a>
    </li>`;

    TODO_INPUT.value = "";
}

//!Local Storage - GET
function get_todos_from_str() {
    let todos;

    if (localStorage.getItem('todo') === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem('todo'));
    }
    return todos;
}
//!Local Storage - ADD
function add_todos_to_str(params_todo) {
    let todos = get_todos_from_str();
    todos.push(params_todo);
    localStorage.setItem("todo", JSON.stringify(todos));
}



function add_todos_to_UI_from_str() {
    let todos = get_todos_from_str();

    todos.forEach(function(todo){
        add_todos_to_UI(todo);
    })
}

function delete_todos_from_UI_$_str(e) {

    if (e.target.className === "bi bi-x") {
        e.target.parentElement.parentElement.remove();
        let searched_text = e.target.parentElement.parentElement.textContent.trim();
        delete_todos_from_str(searched_text);
    }

    e.preventDefault();
}

function delete_todos_from_str(params_todo) {
    let todos = get_todos_from_str();
    todos.forEach(function (todo, index) {
        if (todo === params_todo) {
            todos.splice(index, 1)
        }
    })

    localStorage.setItem("todo", JSON.stringify(todos))
}

function filter_todos_UI() {
    let searched_todo = FILTER_INPUT.value.trim().toLowerCase();
    let lists = document.querySelectorAll('.list-group-item');

    lists.forEach(function (li) {
        let text = li.textContent.trim().toLowerCase();
        if (text.indexOf(searched_todo) === -1) {
            li.setAttribute("style", "display:none!important")
        } else {
            li.setAttribute("style", "display:block")
        }
    })

}

function clear_UI_$_str() {

    if (get_todos_from_str().length > 0 && confirm("Are you sure?")) {
        while (TODO_LIST.firstElementChild !== null) {
            TODO_LIST.removeChild(TODO_LIST.firstElementChild);
        }
        display_message("primary", `${get_todos_from_str().length} todos are deleted.`);
        localStorage.clear();
    } else {
        get_todos_from_str().length === 0 || localStorage.length === 0 ?
            display_message("danger", "There is no todo here. You can only delete when you have some value.") :
            display_message("danger", "You didn't delete your todos.");

    }
}

