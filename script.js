// keep track of the highest window so clicked ones go to the front
let topZ = 1;

// grab all the windows we made in html
const windows = document.querySelectorAll('.window');

windows.forEach(win => {
  const header = win.querySelector('.window-top');
  const closeBtn = win.querySelector('.close-btn');
  
  let isDragging = false;
  let shiftX = 0;
  let shiftY = 0;

  // click anywhere on the window to bring it forward
  win.addEventListener('mousedown', () => {
    topZ = topZ + 1;
    win.style.zIndex = topZ;
  });

  // start dragging when clicking the top bar
  header.addEventListener('mousedown', (e) => {
    isDragging = true;
    
    // figure out exactly where the mouse clicked inside the header
    shiftX = e.clientX - win.offsetLeft;
    shiftY = e.clientY - win.offsetTop;
  });

  // move the window when mouse moves
  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      win.style.left = (e.clientX - shiftX) + 'px';
      win.style.top = (e.clientY - shiftY) + 'px';
    }
  });

  // stop dragging when mouse is let go
  document.addEventListener('mouseup', () => {
    isDragging = false;
  });

  // hide window if x is clicked
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      win.style.display = 'none';
    });
  }
});