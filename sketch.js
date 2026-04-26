let userInput = "";
let cursorPos = 0;
let backspaceTimer = 0;
let padding = 50;
let charSize = 19.2; // Độ rộng xấp xỉ của 1 ký tự Courier New ở textSize(32)
let idleTimer;
const container = document.getElementById('noteless-container');

function wakeUp() {
    container.classList.add('active');
    
    // Xóa bộ đếm cũ nếu bạn vẫn đang gõ
    clearTimeout(idleTimer);
    
    // Thiết lập bộ đếm mới: Sau 3 giây không làm gì sẽ tự mờ đi
    idleTimer = setTimeout(() => {
        container.classList.remove('active');
    }, 3000); 
}

// Bắt sự kiện gõ phím hoặc di chuyển chuột
window.addEventListener('keydown', wakeUp);
window.addEventListener('mousemove', wakeUp);

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  canvas.parent('noteless-container');
  colorMode(RGB, 255); 
  
  // Khởi tạo các giá trị bên trong setup
  userInput = localStorage.getItem('noteless_content') || "";
  cursorPos = userInput.length;
  textFont('Courier New');
  textSize(32);
} // Đóng ngoặc đúng chỗ này

function draw() {
  clear(); 
  // Để background cực mỏng để thấy được hiệu ứng Blur phía dưới
  background(255, 0, 0); 

  // Logic nhấn giữ Backspace
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

// Click chuột để di chuyển con trỏ
function mousePressed() {
  // Tính toán vị trí tương đối của con trỏ dựa trên tọa độ Click
  // Đây là công thức tính toán đơn giản cho font đơn cách (Monospace)
  let col = floor((mouseX - padding) / charSize);
  let row = floor((mouseY - padding) / (32 * 1.2)); // 1.2 là khoảng cách dòng mặc định
  
  // Tạm thời đưa con trỏ đến vị trí click (tính toán này mang tính tương đối cao)
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
