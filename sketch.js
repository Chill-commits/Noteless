let userInput = "";
let cursorPos = 0;
let backspaceTimer = 0;
let padding = 50;
let charSize = 19.2; 
let idleTimer;
const container = document.getElementById('noteless-container');

function wakeUp() {
    container.classList.add('active');
    
    
    clearTimeout(idleTimer);
    
    
    idleTimer = setTimeout(() => {
        container.classList.remove('active');
    }, 3000); 
}


window.addEventListener('keydown', wakeUp);
window.addEventListener('mousemove', wakeUp);

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('noteless-container');
  colorMode(RGB, 255); 
  
 
  userInput = localStorage.getItem('noteless_content') || "";
  cursorPos = userInput.length;
  textFont('Courier New');
  textSize(32);
} 

function draw() {
  
  clear(); 
  
  background(18, 18, 18, 150); 

  
  if (keyIsDown(BACKSPACE)) {
    backspaceTimer++;
    if (backspaceTimer > 20 && backspaceTimer % 2 === 0) {
      deleteAtCursor();
    }
  } else {
    backspaceTimer = 0;
  }

  fill(255);
  noStroke();
  textAlign(LEFT, TOP);

  let textCursor = (floor(frameCount / 30) % 2 === 0) ? "|" : " ";
  let displayContent = userInput.slice(0, cursorPos) + textCursor + userInput.slice(cursorPos);
  
  text(displayContent, padding, padding, width - (padding * 2));
}


function mousePressed() {

  let col = floor((mouseX - padding) / charSize);
  let row = floor((mouseY - padding) / (32 * 1.2)); 
  
  
  let newPos = col + (row * floor((width - 100) / charSize));
  cursorPos = constrain(newPos, 0, userInput.length);
}

function deleteAtCursor() {
  if (cursorPos > 0) {
    userInput = userInput.slice(0, cursorPos - 1) + userInput.slice(cursorPos);
    cursorPos--;
    localStorage.setItem('noteless_content', userInput);
  }
}

function insertText(t) {
  userInput = userInput.slice(0, cursorPos) + t + userInput.slice(cursorPos);
  cursorPos += t.length;
  localStorage.setItem('noteless_content', userInput);
}

function keyPressed() {
  if (key === 'Backspace') {
    deleteAtCursor();
    return false;
  } else if (key === 'ArrowLeft') {
    if (cursorPos > 0) cursorPos--;
    return false;
  } else if (key === 'ArrowRight') {
    if (cursorPos < userInput.length) cursorPos++;
    return false;
  } else if (key === 'Enter') {
    insertText('\n');
    return false;
  }
}

function keyTyped() {
  if (keyCode !== BACKSPACE && keyCode !== ENTER) {
    insertText(key);
  }
  return false;
}
