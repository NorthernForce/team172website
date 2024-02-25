order = ['0.1', '2.2', '1.2', '0.0'];
async function setup() {
    var card = document.getElementById("card");
    var card_clone = card.cloneNode(true);
    var display_items = document.getElementById("display_items");

    for (let i = 0; i < order.length-1; i++) {
        var card_clone = card.cloneNode(true);
        display_items.appendChild(card_clone);
    }
    for (let i = 0; i < document.getElementsByClassName("card").length; i++) {

        var temp_card = document.getElementsByClassName("card")[i];
        temp_card.id = `card${i}`;
        var temp_add = document.getElementsByClassName("add")[i];

        temp_add.id = `a_add${order[i]}`;
        var temp_sub = document.getElementsByClassName("sub")[i];
        temp_sub.id = `a_sub${order[i]}`

       /* var a_sub_temp = document.getElementsByClassName("a_sub")[i];
        a_sub_temp.id = `a_sub${order[i]}`;
        var a_add_temp = document.getElementsByClassName("a_add")[i];

        a_add_temp.id = `a_add${order[i]}`;*/

        var incrementers = document.getElementsByClassName("item_counter")[i];
        incrementers.id = `${order[i]}`;
    }
}
setup();
// data management
items_get_json = [];
// save data before a redirect
window.addEventListener('beforeunload', function(event) {
  // Run your function here
  send_data();
});
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
function set_local_data() {
    for (let i = 0; i < items_get_json.length; i++) {
        if (order.indexOf(items_get_json[i].id) > -1) {
            document.getElementById(items_get_json[i].id).innerText = items_get_json[i].amount;
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

class items2 {
    constructor(id, amount) {
        this.id = id;
        this.amount = amount;
    }
}
// give event listeners for the items
function add_events() {
    for (let i = 0; i < document.getElementsByClassName("add").length; i++) {
        document.getElementById(`a_add${order[i]}`).addEventListener("click", function () {
            adds(this);
        });
        document.getElementById(`a_sub${order[i]}`).addEventListener("click", function () {
            subs(this);
        });
    }
}
add_events();
function subs(element) {

    console.log(get_numbers(element.getAttribute("id")));

    const counter = document.getElementById(`${get_id(element.getAttribute("id"))}`);

    if (Number(counter.innerText) != 0) {

        counter.innerText = Number(counter.innerText) - 1;
        // generate and save item amount and id

        items_get_json.push(new items2(`${get_id(element.getAttribute("id"))}`, -1));
        
    }

}
function adds(element) {
    console.log(element.getAttribute("id"));
    const counter = document.getElementById(`${get_id(element.getAttribute("id"))}`);

    counter.innerText = Number(counter.innerText) + 1;

    // generate and save item amount and id
    items_get_json.push(new items2(`${get_id(element.getAttribute("id"))}`, 1));
}
function get_id(text) {
    let filter = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."];
    let temp_string = "";
    for (let i = 0; i < text.length; i++) {
        if (filter.indexOf(text.charAt(i)) > -1) {
            temp_string = temp_string + text.charAt(i)
        }
    }
    return(temp_string);
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

// search
items = [
["hats", "hat", "cap", "caps", "baseball cap", "headgear", "bowler", "headpiece", "helm"],
["sweat shirt", "hoodie", "sweatshirt", "sweatshirts"],
["t-shirt", "shirt", "t-shirts", "shirts"]
];
lengths = [[0, 0, 0, 0, 0, 0, 0, 0, 0],[0, 0],[0, 0]];
function edit_dist(str1, str2) {
    // make the array & set it up
    let len1 = str1.length;
    let len2 = str2.length;
    var array = [];
    for (let rows = 0; rows <= len1; rows++) {
        array[rows] = [];
        for (let col = 0; col <= len2; col++) {
           array[rows][col] = 0;
        }
    }
    
    for (let w = 1; w <= len2; w++) {
        array[0][w] = w;
    }
    for (let q = 1; q <= len1; q++) {
        array[q][0] = q;
    }
    console.log(array);
    
    // find the edit distance
    for (let q = 1; q <= len1; q++) {
        for (let w = 1; w <= len2; w++) {
            if (str1.charAt(q - 1) != str2[w - 1]) {
                array[q][w] = Math.min(
                    array[q - 1][w] + 1,
                    array[q][w - 1] + 1,
                    array[q - 1][w - 1] + 1
                );
            } else {
                array[q][w] = array[q - 1][w - 1];
            }
        }
    }
    return array[len1][len2];
}

// did you mean
let y = [];
let x = [];
let val = [];
function miss_spell() {
    for (let i = 0; i < lengths.length; i++) {
        for (let row = 0; row < lengths[i].length; row++) {
            if (lengths[i][row] < 3) {
                y.push(i);
                x.push(row);
                val.push(lengths[i][row]);
            }
        }
    }
}
var card = document.getElementsByClassName("card")
function search() {
    term = document.getElementById("search_bar").value;
    if (term != '') {
        for (let i = 0; i < items.length; i++) {
            for (let row = 0; row < items[i].length; row++) { 
                lengths[i][row] = (edit_dist(term, items[i][row]));
            }
        }
        miss_spell();
        if (Math.min(...val) == 0) {
            window.location.replace(`${y[val.indexOf(0)]}.html`);
        } else {
            document.getElementById("display_items").innerHTML = ``;
            document.getElementById("display_items").classList = "result";
            for (let i = 0; i < val.length; i++) {
                var a = document.createElement("a");
                a.className = "dym";
                a.id = `dym${i}`;
                a.innerText = `did you mean: ${items[y[i]][x[i]]}`;
                a.href = `${y[i]}.html`
                var br = document.createElement("br");
                document.getElementById("display_items").appendChild(a);
                document.getElementById("display_items").appendChild(br);
            }
        }
    }
}

document.addEventListener('keydown', (event) => {
    if (event.key === "Enter") {
        search();
    }
});

// cart redirect
function cart() {
    window.location.replace("cart.html");
}
