// --- Window Dragging Logic ---
let topZ = 1;
const windows = document.querySelectorAll('.window');

windows.forEach(win => {
  const header = win.querySelector('.window-top');
  const closeBtn = win.querySelector('.close-btn');
  
  let isDragging = false;
  let shiftX = 0;
  let shiftY = 0;

  win.addEventListener('mousedown', () => {
    topZ++;
    win.style.zIndex = topZ;
  });

  header.addEventListener('mousedown', (e) => {
    isDragging = true;
    shiftX = e.clientX - win.offsetLeft;
    shiftY = e.clientY - win.offsetTop;
  });

  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      win.style.left = (e.clientX - shiftX) + 'px';
      win.style.top = (e.clientY - shiftY) + 'px';
    }
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      win.style.display = 'none';
    });
  }
});

// --- Taskbar Clock ---
function updateTime() {
  const clock = document.getElementById('clock');
  const now = new Date();
  let hours = now.getHours();
  let minutes = now.getMinutes();
  let ampm = hours >= 12 ? 'PM' : 'AM';
  
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes;
  
  clock.textContent = hours + ':' + minutes + ' ' + ampm;
}

setInterval(updateTime, 1000);
updateTime(); // run once right away

// --- Devlog Logic ---
const devlogs = [
  {
    title: "Entry 1: Laying the Foundation",
    content: `
      <p>I started by building the core desktop architecture. Instead of following the standard trend of building a sleek dark-glass interface, I wanted to create a warm, tactile detective station inspired by The Mentalist.</p>
      <br>
      <p>The initial focus was setting up the baseline window management engine in pure Vanilla JavaScript using mouse event listeners (mousedown, mousemove, and mouseup).</p>
      <br>
      <p>A key technical challenge was resolving z-index stacking bugs so that clicking any open window instantly brought it to the front. Once the drag logic was stabilized, I applied the initial CSS styling, giving windows their signature manila case folder tabs.</p>
    `
  },
  {
    title: "Entry 2: Interactive Widgets and Local Storage Sync",
    content: `
      <p>The next phase focused on expanding functional desktop widgets to bring the detective theme to life.</p>
      <br>
      <p>First came Patrick's Tea Lounge, a custom focus timer allowing users to steep Earl Grey, Green Tea, or Chamomile. Next, an Evidence Pinboard was added, featuring corkboard textures, polaroid cards, and red string connection tags.</p>
      <br>
      <p>Finally, the Encrypted Field Notes app was built with localStorage integration, ensuring draft notes persist across browser reloads while offering a timestamped archive dropdown to load and manage previously saved field notes.</p>
    `
  },
  {
    title: "Entry 3: Show Lore, Audio Synthesis, and Final Polish",
    content: `
      <p>The final development phase focused on deep worldbuilding, feature additions, and UI polish. A searchable top system bar was integrated with a database containing over 50 characters, suspects, and victims from The Mentalist.</p>
      <br>
      <p>An interactive CBI Consultant Badge Generator was added, using an HTML5 Canvas script to render custom digital IDs that users can download directly as PNG files. To fix portrait framing on roster cards, CSS image alignment was tuned to anchor photos from the top center.</p>
      <br>
      <p>Lastly, a subtle Red John easter egg was placed in the corner of the desktop, triggering a creepy audio synth, screen flickering, falling blood drops, and a transition into high-contrast dark mode upon interaction.</p>
    `
  }
];

const devlogContentArea = document.querySelector('.window-content p');

// create the sidebar links
const logList = document.createElement('ul');
logList.style.listStyleType = 'none';
logList.style.padding = '0';
logList.style.marginBottom = '20px';

devlogs.forEach((log, index) => {
  const listItem = document.createElement('li');
  listItem.textContent = `📁 ${log.title}`;
  listItem.style.cursor = 'pointer';
  listItem.style.padding = '5px';
  listItem.style.borderBottom = '1px solid #ccc';
  
  listItem.addEventListener('click', () => {
    devlogContentArea.innerHTML = log.content;
    
    // highlight active link
    const allLinks = logList.querySelectorAll('li');
    allLinks.forEach(link => {
       link.style.fontWeight = 'normal';
       link.style.backgroundColor = 'transparent';
    });
    listItem.style.fontWeight = 'bold';
    listItem.style.backgroundColor = '#f5deb3';
  });
  
  logList.appendChild(listItem);
});

// insert the sidebar and load the first log by default
const devlogWindowContent = document.querySelector('#devlog-app .window-content');
devlogWindowContent.insertBefore(logList, devlogContentArea);
devlogContentArea.innerHTML = devlogs[0].content;
// highlight first link
logList.firstChild.style.fontWeight = 'bold';
logList.firstChild.style.backgroundColor = '#f5deb3';