const searchInput = document.getElementById('search');

searchInput.addEventListener('input', function() {
  console.log(searchInput.value);
  
});

const opts = document.getElementById('search-list').childNodes;
const dinput = document.getElementById('search');
let eventSource = null;
let value = '';
var clicked = 0;
dinput.addEventListener('keydown', (e) => {
  eventSource = e.key ? 'input' : 'list';
});
dinput.addEventListener('input', (e) => {
  value = e.target.value;
  if (eventSource === 'list') {
    clicked = 1;
  }
});
const input = document.getElementById('search');
const options = document.querySelectorAll('#search-list option');

input.addEventListener('input', () => {
  const value = input.value.toLowerCase();
  options.forEach(option => {
    if (option.value.toLowerCase() === value) {
        if(clicked == 1){
      window.location.href = option.dataset.href;
    clicked = 0;    
    }
    }
  });
});
document.querySelector('form').addEventListener('submit', function(e) {
    e.preventDefault();
    var input = document.querySelector('#search');
    var options = document.querySelectorAll('#search-list option');
    for (var i = 0; i < options.length; i++) {
      if (options[i].value === input.value) {
        window.location.href = options[i].getAttribute('data-href');
        return;
      }
    }
  });
  