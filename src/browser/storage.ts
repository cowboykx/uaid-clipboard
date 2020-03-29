const key = 'clipboard_1';

function read() {
  return JSON.parse(localStorage.getItem(key) || '[]');
}

function write(list) {
  localStorage.setItem(key, JSON.stringify(list));
}

function getCategory() {
  return JSON.parse(localStorage.getItem(`${key}_category`) || '[]');
}


function setCategory(list) {
  localStorage.setItem(`${key}_category`, JSON.stringify(list));
}

export {
  read,
  write,
  getCategory,
  setCategory
}