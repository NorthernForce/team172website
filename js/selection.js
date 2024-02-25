// setup hats
async function setup() {
    var card = document.getElementById("card");
    var card_clone = card.cloneNode(true);
    var display_items = document.getElementById("display_items");

    for (let i = 0; i < 1; i++) {
        display_items.appendChild(card_clone);
    }
    for (let i = 0; i < document.getElementsByClassName("card").length; i++) {

        var temp_card = document.getElementsByClassName("card")[i];
        temp_card.id = `card${i}`;
        var temp_add = document.getElementsByClassName("add")[i];

        temp_add.id = `a_add${i}`;
        var temp_sub = document.getElementsByClassName("sub")[i];
        temp_sub.id = `a_sub${i}`

       /* var a_sub_temp = document.getElementsByClassName("sub")[i];
        a_sub_temp.id = `a_sub${i}`;
        var a_add_temp = document.getElementsByClassName("a_add")[i];

        a_add_temp.id = `a_add${i}`;*/
    }
}
setup();
// item and data management
items_get_json = [];
function get_data() {
    const itemExists = localStorage.getItem('items') !== null;

    if (itemExists) {
        items_get_json = JSON.parse(localStorage.getItem('items'));
        set_local_data();
    } else {
        console.warn("the local storage does not contain the required data");
    }
}
get_data();
function get_type(data) {
    var temp_string = '';
    for (let t = 0; t < data.length; t++) {
        if (data.charAt(t) == ".") {
            break;
        } else {
            temp_string = temp_string+data.charAt(t)
        }
    }
    return(temp_string);
}
function get_sub_type(id) {
    var temp_string = '';
    var capture = false;
    for (let st = 0; st < id.length; st++) {
        if (capture) {
            temp_string = temp_string + id.charAt(st);
        } else if (id.charAt(st) === '.') {
            capture = true;
        }
    }
    return temp_string;
}
function deploy(id, i) {
    document.getElementsByClassName("item_counter")[id].innerText = items_get_json[i].amount;
}
function set_local_data() {
    console.log("here");
    const current_type = page().toString();
    for (let i = 0; i < items_get_json.length; i++) {
        if (get_type(items_get_json[i].id) == current_type) {
            deploy(Number(get_sub_type(items_get_json[i].id)), i);
        }
    }
}
async function send_data() {
    await condense();
    await store_items();
    return(true);
}
function condense() {
    const condensedList = items_get_json.reduce((result, item) => {
        const existingItem = result.find(i => i.id === item.id);
        if (existingItem) {
            existingItem.amount += item.amount;
        } else {
            result.push({id: item.id, amount: item.amount});
        }
        return result;
    }, []);
    items_get_json = condensedList;
}
function store_items() {
    localStorage.setItem('items', JSON.stringify(items_get_json));
}

class items {
    constructor(id, amount) {
        this.id = id;
        this.amount = amount;
    }
}
// give event listeners for the items
function add_events() {
    for (let i = 0; i < document.getElementsByClassName("add").length; i++) {
        document.getElementById(`a_add${i}`).addEventListener("click", function () {
            adds(this);
        });
        document.getElementById(`a_sub${i}`).addEventListener("click", function () {
            subs(this);
        });
    }
}
add_events();
function subs(element) {
    console.log(get_numbers(element.getAttribute("id")));
    const counter = document.getElementsByClassName("item_counter")[Number(get_numbers(element.getAttribute("id")))];
    if (Number(counter.innerText) != 0) {
        counter.innerText = Number(counter.innerText) - 1;
        // generate and save item amount and id
        items_get_json.push(new items(`${page()}.${get_numbers(element.getAttribute("id"))}`, -1));
    }
}
function adds(element) {
    console.log(get_numbers(element.getAttribute("id")));
    const counter = document.getElementsByClassName("item_counter")[Number(get_numbers(element.getAttribute("id")))];
    counter.innerText = Number(counter.innerText) + 1;

    // generate and save item amount and id
    items_get_json.push(new items(`${page()}.${get_numbers(element.getAttribute("id"))}`, 1));
}
// pull the numbers out of function request id for item id generation
function get_numbers(text) {
    var numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    var new_num = 0;
    for (let i = 0; i < text.length; i++) {
        if (numbers.indexOf(text.charAt(i)) > -1) {
            new_num = new_num + Number(text.charAt(i));
        }
    }
    return new_num;
}
function page() {
    return(Number(get_numbers(location.pathname.substring(location.pathname.lastIndexOf("/") + 1))));
}
async function back() {
    document.body.style.cursor = "wait";
    if(await send_data()) {
        window.location.replace("store.html");
    } else {
        alert("a problem has occured saving your choices");
    }
}
async function cart() {
    document.body.style.cursor = "wait";
    if (await send_data()) {
        window.location.replace("cart.html");
    } else {
        alert("a problem has occured saving your choices");
    }
}

// custom-made developer tools made for local storage management
function clear_data(name) {
    localStorage.removeItem(name);
    const itemExists = localStorage.getItem(name) !== null;
    if (itemExists) {
        console.error("failed to clear the storage");
    } else {
        console.log("data was cleared");
    }
}
function pull_data(name) {
    console.log(localStorage.getItem(name));
}
function set_data(name, data) {
    localStorage.setItem(name, data);
}
