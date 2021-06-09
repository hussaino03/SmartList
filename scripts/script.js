//local storage
const setLocalStorage = (key, array) => {
  return localStorage.setItem(key, JSON.stringify(array));
}
//local storage
const bar = document.getElementById('barwidth');
var totalExperience = 0;
var level = 1;
if (localStorage.getItem('experience') === null) {
  totalExperience = 0;
} else {
  totalExperience = JSON.parse(localStorage.getItem('experience'));
}

if (localStorage.getItem('level') === null) { 
  level = 1; 
  } else { 
    level = JSON.parse(localStorage.getItem('level')); 
    } 

var experienceNeededToLevel = level * 200
const renderBar = () => {
var barwidth = totalExperience / experienceNeededToLevel;
console.log("width " + barwidth);
if(barwidth > 1 || totalExperience === experienceNeededToLevel) {
  level += 1
  setLocalStorage('level', level);
  document.getElementById('level-up').style.display = 'block';
   document.getElementById('level-up-text').innerHTML = 'Level up! You are now level ' + level + "!";
    document.getElementById('level-up').style.opacity = 0;
    setTimeout(function(){ 
    document.getElementById('level-up').style.display = 'none';
   }, 5000); 
  
  console.log("experience needed to level is " + experienceNeededToLevel);
  totalExperience = totalExperience - experienceNeededToLevel;
  setLocalStorage('experience',totalExperience);
  experienceNeededToLevel = level * 200
  barwidth = totalExperience / experienceNeededToLevel
  renderBar();
 console.log("end");
} else {
console.log("the bar width is " + barwidth);experienceNeededToLevel = level * 200
document.getElementById('level-display-text').innerHTML = 'Welcome back! - Level ' + level + '        |        ' + (experienceNeededToLevel - totalExperience) + 'xp to go!';
bar.style.width = (barwidth * 100) + '%';
document.styleSheets[0].addRule('.progress-line.html span::after','content: "'+Math.round(barwidth*100) + '%'+'";');
}
}
renderBar();
//variables
const form = document.getElementById('form');
const nameinput = document.getElementById('nameinput');
const descinput = document.getElementById('descinput');
const difficultyinput = document.getElementById('difficultyinput');
const importanceinput = document.getElementById('importanceinput');
const ul = document.getElementById('list');
const clearButton = document.getElementById('clear-button');

//task class
class task {
  constructor(name, desc, difficulty, importance) {
    this.name = name;
    this.desc = desc;
    this.difficulty = difficulty;
    this.importance = importance;
    this.experience = ((parseInt(difficulty) + parseInt(importance) + 20) * 5)
    this.completion = false;
  }
}
//
//create an array for all the tasks
let taskArray;
if (localStorage.getItem('tasks') === null) {
  taskArray = [];
} else {
  taskArray = JSON.parse(localStorage.getItem('tasks'));
}
let completedArray;
if (localStorage.getItem('completedtasks') === null) {
  completedArray = [];
} else {
  completedArray = JSON.parse(localStorage.getItem('completedtasks'));
}
//error message
const errorMessage = document.createElement('p');
form.appendChild(errorMessage);
//clear button
clearButton.addEventListener('click', (e) => {
  // Clear items on local storage array
  
  setLocalStorage('experience', 0);
  setLocalStorage('level', 1);
  totalExperience = 0;
  level = 1;
  renderBar();
  taskArray = [];
  completedArray = [];
  setLocalStorage('tasks', taskArray);
  setLocalStorage('completedtasks', completedArray);
  
  console.log('new text');
  console.log(taskArray[0]);
  ul.innerHTML = '';
})
//events that happen upon submit
form.addEventListener('submit', (e) => {
  e.preventDefault();
  //checks for duplicate
  var duplicate = false;
  for (let i = 0; i < taskArray.length; i++) {
    if (nameinput.value === taskArray[i].name) {
      confirm("Another task is already named " + nameinput.value + "!");
      duplicate = true;
      break;
    }
  }
  if (nameinput.value === '') {
    const errorMessage = document.createElement('p');
    errorMessage.textContent = "hi";
    confirm("Enter a value in the task name.");
  } else if (duplicate === false) {
    taskArray.push(new task(nameinput.value, descinput.value, difficultyinput.value, importanceinput.value));
    setLocalStorage('tasks', taskArray);
    createListContent(nameinput.value, descinput.value, difficultyinput.value, importanceinput.value, false);
    loadTasks();
    nameinput.value = "";
    descinput.value = "";
    difficultyinput.value = '0';
    importanceinput.value = '0';
    document.getElementById('newtask-form').style.display = 'none';
  }
});
//remove button
ul.addEventListener('click', (e) => {
  if (e.target.className === 'remove') {
    const a = e.target.parentNode;
    const li = a.parentNode;
    const removeButtonPreviousSibling = e.target.previousSibling
    var liItemName = removeButtonPreviousSibling.previousSibling.textContent;
    if (e.target.id === 'complete') {
      liItemName = e.target.previousSibling.textContent;
    }
    console.log(liItemName);
    ul.removeChild(li);

    for (let i = 0; i < taskArray.length; i++) {
      if (liItemName === taskArray[i].name) {
        console.log("we are splicing " + taskArray[i].name);
        taskArray.splice(i, 1);
        setLocalStorage('tasks', taskArray);
      }
    }
    for (let i = 0; i < completedArray.length; i++) {
      if (liItemName === completedArray[i].name) {
        console.log("we are splicing " + completedArray[i].name);
        completedArray.splice(i, 1);
        setLocalStorage('completedtasks', completedArray);
      }
    }

  }
});


//remove button
console.log(taskArray[0])
console.log(taskArray[1]);
console.log(taskArray[2]);
console.log(taskArray[3]);
const createListContent = (text, description, difficulty, importance, completionStatus) => {
  const span = document.createElement('span');
  const namediv = document.createElement('div');
  const content = document.createElement('div');
  const desc = document.createElement('p');
  const difficultydesc = document.createElement('p');
  const importancedesc = document.createElement('p');
  const experiencedesc = document.createElement('p');
  const li = document.createElement('li');

  var experience = ((parseInt(difficulty) + parseInt(importance) + 20) * 5)

  content.className = 'description';
  namediv.className = 'name';

  desc.textContent = "Details: " + description;
  experiencedesc.textContent = "Experience given: " + experience + "xp";
  difficultydesc.textContent = "Difficulty: " + difficulty + "%"
  importancedesc.textContent = "Importance: " + importance + "%"
  span.textContent = text;
  content.appendChild(desc);
  content.appendChild(difficultydesc);
  content.appendChild(importancedesc);
  content.appendChild(experiencedesc);
  namediv.appendChild(span);

  li.appendChild(namediv);
  li.appendChild(content);
  ul.appendChild(li);
  createButtons(namediv, completionStatus);
}
//create the buttons 
const createButtons = (li, completionStatus) => {
  const listItem = li.firstElementChild;
  const more = document.createElement('button');
  more.textContent = '↓';
  more.className = 'more';
  li.insertBefore(more, listItem);
  more.addEventListener("click", function () {
    /* Toggle between adding and removing the "active" class,
    to highlight the button that controls the panel */ this.parentNode.classList.toggle("active");
    this.textContent = '↑';
    /* Toggle between hiding and showing the active panel */
    var name = this.parentNode
    var panel = name.nextElementSibling;
    if (panel.style.display === "block") {
      panel.style.maxHeight = '0px';
      panel.style.display = "none";
      this.textContent = '↓';
    } else {
      panel.style.display = "block";
    }
    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
    }
  });
  const removeButton = document.createElement('button');
  removeButton.textContent = 'x';
  removeButton.className = 'remove';
  if (completionStatus === true) {
    console.log('make the remove button id false');
    removeButton.id = 'complete';
  }
  li.insertBefore(removeButton, listItem.nextElementSibling);
  //checkcheck
  console.log("completion status " + completionStatus);
  if (completionStatus === false) {
    const completeButton = document.createElement('button');
    completeButton.textContent = '✔️';
    completeButton.className = 'check';
    li.insertBefore(completeButton, listItem.nextElementSibling);
    completeButton.addEventListener("click", function () {
      const a = completeButton.parentNode;
      const li = a.parentNode;
      const liItemName = completeButton.previousSibling.textContent;
      console.log(liItemName);
      ul.removeChild(li);
      for (let i = 0; i < taskArray.length; i++) {
        if (liItemName === taskArray[i].name) {
          console.log("we are splicing " + taskArray[i].name);
          completedArray.push(taskArray[i]);
          totalExperience += taskArray[i].experience;
         
          setLocalStorage('experience', totalExperience);
          renderBar();
          console.log(completedArray[0].name);
          taskArray.splice(i, 1);
          setLocalStorage('completedtasks', completedArray);
          setLocalStorage('tasks', taskArray);
        }
      }


    });
  }
}
//generate list items from local storage
const loadTasks = () => {
  ul.innerHTML = '';
  document.getElementById('to-do-title').style.display = 'block';
  document.getElementById('completed-title').style.display = 'none';
  console.log(taskArray.length);
  for (let i = 0; i < taskArray.length; i++) {
    createListContent(taskArray[i].name, taskArray[i].desc, taskArray[i].difficulty, taskArray[i].importance, false);

  }
}
const loadCompletedTasks = () => {
  ul.innerHTML = '';
  document.getElementById('completed-title').style.display = 'block';
  document.getElementById('to-do-title').style.display = 'none';
  for (let i = 0; i < completedArray.length; i++) {
    createListContent(completedArray[i].name, completedArray[i].desc, completedArray[i].difficulty, completedArray[i].importance, true);

  }
}
loadTasks();
