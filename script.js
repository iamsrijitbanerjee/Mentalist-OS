// --- GLOBAL STACKING VARIABLE ---
let highestZIndex = 10;

// --- 1. DYNAMIC SYSTEM CLOCK ---
function updateClock() {
  const clockEl = document.getElementById('system-clock');
  const now = new Date();
  if (clockEl) {
    clockEl.textContent = now.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  }
}
setInterval(updateClock, 1000);
updateClock();


// --- 2. ADVANCED WINDOW ENGINE (SNAP, MINIMIZE, RESIZE) ---
const taskbarApps = document.getElementById('taskbar-apps');

function createTaskbarIcon(winId, title) {
  if (document.getElementById(`tb-${winId}`)) return;
  const btn = document.createElement('button');
  btn.id = `tb-${winId}`;
  btn.className = 'taskbar-btn';
  btn.innerHTML = `📁 ${title}`;
  btn.onclick = () => {
    const win = document.getElementById(winId);
    win.style.display = 'flex';
    highestZIndex++;
    win.style.zIndex = highestZIndex;
    btn.remove();
  };
  taskbarApps.appendChild(btn);
}

function makeResizable(windowEl) {
  const resizers = ['r', 'b', 'br'];
  resizers.forEach(dir => {
    const resizer = document.createElement('div');
    resizer.className = `resizer resizer-${dir}`;
    windowEl.appendChild(resizer);

    resizer.addEventListener('mousedown', (e) => {
      e.preventDefault(); 
      e.stopPropagation();
      let isResizing = true;
      let startX = e.clientX;
      let startY = e.clientY;
      let startW = parseInt(document.defaultView.getComputedStyle(windowEl).width, 10);
      let startH = parseInt(document.defaultView.getComputedStyle(windowEl).height, 10);
      
      windowEl.style.transition = 'none';
      if (windowEl.dataset.snapped) {
        windowEl.dataset.snapped = "";
      }

      function doResize(ev) {
        if (!isResizing) return;
        if (dir.includes('r')) {
          windowEl.style.width = startW + (ev.clientX - startX) + 'px';
        }
        if (dir.includes('b')) {
          windowEl.style.height = startH + (ev.clientY - startY) + 'px';
        }
        // Redraw strings if resizing the pinboard
        if (windowEl.id === 'pinboard-app') {
          drawStrings();
        }
      }

      function stopResize() {
        isResizing = false;
        document.removeEventListener('mousemove', doResize);
        document.removeEventListener('mouseup', stopResize);
      }

      document.addEventListener('mousemove', doResize);
      document.addEventListener('mouseup', stopResize);
    });
  });
}

function makeDraggable(windowEl) {
  const header = windowEl.querySelector('.window-header');
  const title = windowEl.querySelector('.window-title').textContent;
  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;
  let preSnapState = null;

  windowEl.addEventListener('mousedown', () => {
    highestZIndex++;
    windowEl.style.zIndex = highestZIndex;
  });

  if (header) {
    header.addEventListener('mousedown', (e) => {
      if (e.target.classList.contains('win-btn')) return;
      isDragging = true;
      offsetX = e.clientX - windowEl.offsetLeft;
      offsetY = e.clientY - windowEl.offsetTop;
      windowEl.style.transition = 'none';

      if (windowEl.dataset.snapped) {
        windowEl.dataset.snapped = "";
        windowEl.style.width = preSnapState.width;
        windowEl.style.height = preSnapState.height;
        windowEl.classList.remove('snapped');
        offsetX = windowEl.offsetWidth / 2;
      }
    });
  }

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    windowEl.style.left = `${e.clientX - offsetX}px`;
    windowEl.style.top = `${e.clientY - offsetY}px`;
  });

  document.addEventListener('mouseup', (e) => {
    if (!isDragging) return;
    isDragging = false;
    const screenW = window.innerWidth;
    
    if (e.clientX < 20) {
      preSnapState = { 
        width: windowEl.style.width || windowEl.offsetWidth + 'px', 
        height: windowEl.style.height || windowEl.offsetHeight + 'px' 
      };
      windowEl.style.transition = 'all 0.2s ease';
      windowEl.style.left = '0px'; 
      windowEl.style.top = '0px';
      windowEl.style.width = '50%'; 
      windowEl.style.height = '100%';
      windowEl.dataset.snapped = "true"; 
      windowEl.classList.add('snapped');
    } else if (e.clientX > screenW - 20) {
      preSnapState = { 
        width: windowEl.style.width || windowEl.offsetWidth + 'px', 
        height: windowEl.style.height || windowEl.offsetHeight + 'px' 
      };
      windowEl.style.transition = 'all 0.2s ease';
      windowEl.style.left = '50%'; 
      windowEl.style.top = '0px';
      windowEl.style.width = '50%'; 
      windowEl.style.height = '100%';
      windowEl.dataset.snapped = "true"; 
      windowEl.classList.add('snapped');
    }
  });

  const minBtn = windowEl.querySelector('.win-btn.minimize');
  if (minBtn) {
    minBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      windowEl.style.display = 'none';
      createTaskbarIcon(windowEl.id, title);
    });
  }
  
  const closeBtn = windowEl.querySelector('.win-btn.close');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => { 
      windowEl.style.display = 'none'; 
    });
  }

  makeResizable(windowEl);
}

document.querySelectorAll('.window').forEach(makeDraggable);


// --- 3. TASKBAR APP LAUNCHERS ---
function setupLauncher(btnId, winId) {
  const btn = document.getElementById(btnId);
  const win = document.getElementById(winId);
  if (btn && win) {
    btn.addEventListener('click', () => {
      win.style.display = 'flex';
      highestZIndex++;
      win.style.zIndex = highestZIndex;
      const tbIcon = document.getElementById(`tb-${winId}`);
      if (tbIcon) {
        tbIcon.remove();
      }
    });
  }
}

setupLauncher('launch-team', 'team-board-app');
setupLauncher('launch-terminal', 'terminal-app');
setupLauncher('launch-devlog', 'devlog-app');
setupLauncher('launch-tea', 'tea-lounge');
setupLauncher('launch-pinboard', 'pinboard-app');
setupLauncher('launch-notepad', 'notepad-app');
setupLauncher('launch-ambient', 'ambient-app');


// --- 4. TERMINAL ENGINE & BLAKE ASSOCIATION APP ---
const terminalInput = document.getElementById('terminal-input');
const terminalOutput = document.getElementById('terminal-output');
const blakeEggBtn = document.getElementById('blake-egg');

function printToTerminal(text) {
  terminalOutput.innerHTML += `<div>${text}</div>`;
  terminalOutput.scrollTop = terminalOutput.scrollHeight;
}

if (blakeEggBtn) {
  blakeEggBtn.addEventListener('click', () => {
    const blakeWin = document.getElementById('blake-app');
    blakeWin.style.display = 'flex';
    highestZIndex++;
    blakeWin.style.zIndex = highestZIndex;
  });
}

if (terminalInput) {
  terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const val = terminalInput.value.trim();
      printToTerminal(`<span style="color:#888">FBI:\\></span> ${val}`);
      terminalInput.value = '';

      const args = val.toLowerCase().split(' ');
      const cmd = args[0];

      switch(cmd) {
        case 'help':
          printToTerminal('Commands: <strong>help</strong>, <strong>analyze [name]</strong>, <strong>tea</strong>, <strong>badge</strong>, <strong>tyger</strong>, <strong>theme [dark/light/wood]</strong>, <strong>clear</strong>');
          break;
        case 'analyze':
          if(args.length > 1) {
            printToTerminal(`[Jane Analysis]: ${args[1]} is hiding something. Notice the slight pupil dilation. Guilt or fear?`);
          } else {
            printToTerminal('Error: Specify a subject to analyze. Usage: analyze [name]');
          }
          break;
        case 'tea':
          document.getElementById('launch-tea').click();
          printToTerminal('Brewing app launched.');
          break;
        case 'badge':
          document.getElementById('cbi-badge-egg').click();
          printToTerminal('FBI Identity system launched.');
          break;
        case 'tyger':
          blakeEggBtn.click();
          printToTerminal('WARNING: Encrypted Blake Association drive accessed.');
          break;
        case 'theme':
          if(args[1] === 'dark') { 
            document.body.style.setProperty('--bg-desk', '#000'); 
            document.body.style.background = '#000'; 
            printToTerminal('Theme: Dark'); 
          } else if(args[1] === 'wood') { 
            document.body.style.setProperty('--bg-desk', '#2b1e16'); 
            document.body.style.background = '#2b1e16'; 
            printToTerminal('Theme: Wood'); 
          } else { 
            printToTerminal('Usage: theme [dark/wood]'); 
          }
          break;
        case 'clear':
          terminalOutput.innerHTML = '';
          break;
        case '':
          break;
        default:
          printToTerminal(`'${cmd}' is not recognized as an internal command.`);
      }
    }
  });
}


// --- 5. INTERACTIVE RED STRING CANVAS ---
const canvas = document.getElementById('red-string-canvas');
const ctx = canvas ? canvas.getContext('2d') : null;
const corkboard = document.getElementById('corkboard');
const pins = document.querySelectorAll('.red-pin');
let connections = []; 
let isDrawingString = false;
let startPin = null;
let currentMouseX = 0;
let currentMouseY = 0;

function resizeCanvas() {
  if(!canvas) return;
  canvas.width = corkboard.clientWidth;
  canvas.height = corkboard.clientHeight;
  drawStrings();
}

function getPinCenter(pin) {
  const rect = pin.getBoundingClientRect();
  const boardRect = corkboard.getBoundingClientRect();
  return {
    x: rect.left - boardRect.left + (rect.width / 2),
    y: rect.top - boardRect.top + (rect.height / 2)
  };
}

function drawStrings() {
  if(!ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = '#cc0000';
  ctx.shadowColor = 'rgba(0,0,0,0.4)';
  ctx.shadowBlur = 4;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;

  connections.forEach(conn => {
    const p1 = document.querySelector(`[data-id="${conn.startId}"]`);
    const p2 = document.querySelector(`[data-id="${conn.endId}"]`);
    if(p1 && p2) {
      const c1 = getPinCenter(p1);
      const c2 = getPinCenter(p2);
      ctx.beginPath();
      ctx.moveTo(c1.x, c1.y);
      ctx.lineTo(c2.x, c2.y);
      ctx.stroke();
    }
  });

  if (isDrawingString && startPin) {
    const c1 = getPinCenter(startPin);
    ctx.beginPath();
    ctx.moveTo(c1.x, c1.y);
    ctx.lineTo(currentMouseX, currentMouseY);
    ctx.stroke();
  }
}

if(canvas && corkboard) {
  new ResizeObserver(resizeCanvas).observe(corkboard);

  pins.forEach(pin => {
    pin.addEventListener('mousedown', (e) => {
      e.stopPropagation();
      isDrawingString = true;
      startPin = pin;
    });
    
    pin.addEventListener('mouseup', (e) => {
      e.stopPropagation();
      if (isDrawingString && startPin && startPin !== pin) {
        const exists = connections.some(c => 
          (c.startId === startPin.dataset.id && c.endId === pin.dataset.id) ||
          (c.endId === startPin.dataset.id && c.startId === pin.dataset.id)
        );
        if (!exists) {
          connections.push({ startId: startPin.dataset.id, endId: pin.dataset.id });
        }
      }
      isDrawingString = false;
      startPin = null;
      drawStrings();
    });
  });

  corkboard.addEventListener('mousemove', (e) => {
    if (isDrawingString) {
      const boardRect = corkboard.getBoundingClientRect();
      currentMouseX = e.clientX - boardRect.left;
      currentMouseY = e.clientY - boardRect.top;
      drawStrings();
    }
  });

  corkboard.addEventListener('mouseup', () => {
    isDrawingString = false;
    startPin = null;
    drawStrings();
  });
}


// --- 6. DOSSIER MODAL & 80+ CHARACTER DATABASE ---
const dossierModal = document.getElementById('dossier-modal');
const closeDossierBtn = document.getElementById('close-dossier-modal');

if (closeDossierBtn) {
  closeDossierBtn.addEventListener('click', () => {
    dossierModal.classList.add('hidden');
  });
}

function openDossier(data) {
  document.getElementById('dossier-name').textContent = data.name;
  document.getElementById('dossier-type').textContent = data.type;
  document.getElementById('dossier-role').textContent = data.role;
  
  const statusEl = document.getElementById('dossier-status');
  statusEl.textContent = data.status;
  statusEl.className = 'status-badge ' + data.status.replace(/\s+/g, '-');
  
  dossierModal.classList.remove('hidden');
}

const cbiDatabase = [
  // --- Core Agents & Leadership ---
  { name: "Srijit Banerjee", type: "Director", role: "FBI HQ Leader", status: "Active", action: function() { openDossier(this); } },
  { name: "Gale Bertram", type: "Director", role: "CBI Director / Blake Association", status: "Deceased", action: function() { openDossier(this); } },
  { name: "Patrick Jane", type: "Consultant", role: "Behavioral Specialist", status: "Active", action: function() { openDossier(this); } },
  { name: "Teresa Lisbon", type: "Senior Agent", role: "Unit Commander", status: "Active", action: function() { openDossier(this); } },
  { name: "Kimball Cho", type: "Special Agent", role: "Tactical Lead", status: "Active", action: function() { openDossier(this); } },
  { name: "Wayne Rigsby", type: "Special Agent", role: "Ballistics & Fire", status: "Active", action: function() { openDossier(this); } },
  { name: "Grace Van Pelt", type: "Special Agent", role: "Digital Forensics", status: "Active", action: function() { openDossier(this); } },
  
  // --- Extended Leadership & Investigations ---
  { name: "Madeleine Hightower", type: "Regional Director", role: "Former SAC", status: "Cleared", action: function() { openDossier(this); } },
  { name: "Luther Wainwright", type: "Agent in Charge", role: "MCU Supervisor", status: "Deceased", action: function() { openDossier(this); } },
  { name: "Virgil Minelli", type: "Former Director", role: "Retired SAC", status: "Cleared", action: function() { openDossier(this); } },
  { name: "J.J. LaRoche", type: "Internal Affairs", role: "Special Investigator", status: "Deceased", action: function() { openDossier(this); } },
  { name: "Sam Bosco", type: "Senior Agent", role: "Former MCU Lead", status: "Deceased", action: function() { openDossier(this); } },
  { name: "Brenda Shettrick", type: "CBI Public Relations", role: "Media Liaison / Mole", status: "In Custody", action: function() { openDossier(this); } },
  { name: "Osvaldo Ardiles", type: "Assistant District Attorney", role: "Prosecutor", status: "Deceased", action: function() { openDossier(this); } },
  
  // --- FBI Austin Team ---
  { name: "Dennis Abbott", type: "FBI Agent", role: "Austin Branch Lead", status: "Active", action: function() { openDossier(this); } },
  { name: "Kim Fischer", type: "FBI Agent", role: "Field Operative", status: "Active", action: function() { openDossier(this); } },
  { name: "Jason Wylie", type: "FBI Tech", role: "Digital Intelligence", status: "Active", action: function() { openDossier(this); } },
  { name: "Michelle Vega", type: "FBI Agent", role: "Junior Operative", status: "Deceased", action: function() { openDossier(this); } },
  { name: "Marcus Pike", type: "FBI Agent", role: "Art Crime Specialist", status: "Active", action: function() { openDossier(this); } },
  { name: "Ken Spackman", type: "FBI Agent", role: "Homicide Detective", status: "Active", action: function() { openDossier(this); } },
  { name: "Susan Darcy", type: "FBI Agent", role: "Red John Investigator", status: "Cleared", action: function() { openDossier(this); } },
  
  // --- The 7 Red John Suspects ---
  { name: "Thomas McAllister", type: "Sheriff", role: "Red John Leader", status: "Deceased", action: function() { openDossier(this); } },
  { name: "Brett Partridge", type: "CBI Forensics", role: "Forensic Technician", status: "Deceased", action: function() { openDossier(this); } },
  { name: "Bret Stiles", type: "Cult Leader", role: "Visualize Head", status: "Deceased", action: function() { openDossier(this); } },
  { name: "Reede Smith", type: "FBI Agent", role: "Blake Association", status: "In Custody", action: function() { openDossier(this); } },
  { name: "Ray Haffner", type: "Former CBI / PI", role: "Visualize Member", status: "Deceased", action: function() { openDossier(this); } },
  { name: "Bob Kirkland", type: "DHS Agent", role: "Homeland Security Operative", status: "Deceased", action: function() { openDossier(this); } },
  
  // --- Red John Accomplices & Moles ---
  { name: "Lorelei Martins", type: "Accomplice", role: "Waitress / RJ Disciple", status: "Deceased", action: function() { openDossier(this); } },
  { name: "Craig O'Laughlin", type: "FBI Mole", role: "CBI Infiltrator", status: "Deceased", action: function() { openDossier(this); } },
  { name: "Rebecca Anderson", type: "CBI Secretary", role: "RJ Disciple", status: "Deceased", action: function() { openDossier(this); } },
  { name: "Dumar Hardy", type: "Sheriff's Deputy", role: "Orville Tanner's Son", status: "Deceased", action: function() { openDossier(this); } },
  { name: "Todd Johnson", type: "Paramedic", role: "Cop Killer", status: "Deceased", action: function() { openDossier(this); } },
  { name: "Timothy Carter", type: "Impostor", role: "Mall Decoy", status: "Deceased", action: function() { openDossier(this); } },
  { name: "Jason Lennon", type: "Philanthropist", role: "RJ Recruiter", status: "Deceased", action: function() { openDossier(this); } },
  { name: "Miriam Gottlieb", type: "Child Services", role: "RJ Accomplice", status: "Deceased", action: function() { openDossier(this); } },
  { name: "Oscar Cordero", type: "CBI Agent", role: "Blake Association Hitman", status: "Deceased", action: function() { openDossier(this); } },
  { name: "Orville Tanner", type: "Accomplice", role: "Early RJ Partner", status: "Deceased", action: function() { openDossier(this); } },
  
  // --- High-Profile Suspects, Criminals & Serial Killers ---
  { name: "Erica Flynn", type: "Convict", role: "Matchmaker / Mastermind", status: "In Custody", action: function() { openDossier(this); } },
  { name: "Tommy Volker", type: "Executive", role: "Corrupt Billionaire", status: "In Custody", action: function() { openDossier(this); } },
  { name: "James Panzer", type: "Blogger", role: "San Joaquin Killer", status: "Deceased", action: function() { openDossier(this); } },
  { name: "Richard Haibach", type: "Photographer", role: "Kidnapper / Vengeful Suspect", status: "Deceased", action: function() { openDossier(this); } },
  { name: "Gabriel Hicks", type: "Serial Killer", role: "FBI Suspect", status: "In Custody", action: function() { openDossier(this); } },
  { name: "Linus Wagner", type: "Psychiatrist", role: "Murder Suspect", status: "In Custody", action: function() { openDossier(this); } },
  { name: "Ben Marx", type: "Car Salesman", role: "Murder Suspect", status: "In Custody", action: function() { openDossier(this); } },
  { name: "Michael Ridley", type: "Smuggler", role: "Human Trafficking Ring Leader", status: "In Custody", action: function() { openDossier(this); } },
  
  // --- Recurring Characters & Civilians ---
  { name: "Walter Mashburn", type: "Billionaire", role: "Civilian Thrill-Seeker", status: "Cleared", action: function() { openDossier(this); } },
  { name: "Kristina Frye", type: "Medium", role: "Spiritual Consultant", status: "Cleared", action: function() { openDossier(this); } },
  { name: "Summer Edgecombe", type: "Informant", role: "Cho's Field Asset", status: "Cleared", action: function() { openDossier(this); } },
  { name: "Sean Barlow", type: "Psychic", role: "Rival Medium", status: "Cleared", action: function() { openDossier(this); } },
  { name: "Rosalind Harker", type: "Civilian", role: "Blind Pianist / RJ Witness", status: "Cleared", action: function() { openDossier(this); } },
  { name: "Dean Harken", type: "CDC Official", role: "Epidemic Specialist", status: "Cleared", action: function() { openDossier(this); } },
  { name: "Royston Daniel", type: "Forensic Psychologist", role: "Consultant", status: "Cleared", action: function() { openDossier(this); } },
  { name: "Sarah Harrigan", type: "Public Defender", role: "Legal Counsel / Rigsby's Ex", status: "Cleared", action: function() { openDossier(this); } },
  { name: "Max Winter", type: "Civilian", role: "Vengeful Father", status: "Cleared", action: function() { openDossier(this); } },
  { name: "Paul Delabaum", type: "Visualize Executive", role: "Cult Board Member", status: "Cleared", action: function() { openDossier(this); } },
  
  // --- Notable Victims ---
  { name: "Jared Renfrew", type: "Victim", role: "Knew Red John's Identity", status: "Deceased", action: function() { openDossier(this); } },
  { name: "Emma Plaskett", type: "Victim", role: "Early RJ Victim", status: "Deceased", action: function() { openDossier(this); } },
  { name: "Eleanor Artega", type: "Victim", role: "RJ Victim", status: "Deceased", action: function() { openDossier(this); } },
  { name: "Kelly Flower", type: "Victim", role: "Political Campaign Worker", status: "Deceased", action: function() { openDossier(this); } },
  { name: "Martin Ruber", type: "Victim", role: "Bosco's Unit Member", status: "Deceased", action: function() { openDossier(this); } },
  { name: "Nick Fisher", type: "Victim", role: "Bosco's Unit Member", status: "Deceased", action: function() { openDossier(this); } },
  { name: "Colin Haffner", type: "Victim", role: "San Joaquin Victim", status: "Deceased", action: function() { openDossier(this); } }
];

const searchInput = document.getElementById('cbi-search-input');
const searchDropdown = document.getElementById('search-results-dropdown');

if (searchInput) {
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    if (!query) { 
      searchDropdown.classList.add('hidden'); 
      return; 
    }

    const matches = cbiDatabase.filter(item => 
      item.name.toLowerCase().includes(query) || 
      item.type.toLowerCase().includes(query)
    );

    searchDropdown.innerHTML = '';
    
    if (matches.length === 0) {
      searchDropdown.innerHTML = '<div class="search-result-item">No records match query.</div>';
    } else {
      matches.forEach(match => {
        const div = document.createElement('div');
        div.className = 'search-result-item';
        div.innerHTML = `<div class="search-result-title">${match.name}</div><div class="search-result-type">${match.type}</div>`;
        
        div.addEventListener('click', () => {
          match.action();
          searchDropdown.classList.add('hidden');
          searchInput.value = '';
        });
        searchDropdown.appendChild(div);
      });
    }
    searchDropdown.classList.remove('hidden');
  });

  document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !searchDropdown.contains(e.target)) {
      searchDropdown.classList.add('hidden');
    }
  });
}


// --- 7. DEVLOG ENGINE ---
let defaultDevlogs = [
  { 
    title: "CASE ENTRY #001: System Foundation", 
    date: "Phase 1 - Baseline Setup", 
    content: "Initiated Mentalist OS baseline project structure.\n\nConfigured HTML viewport, standard CSS variables for Manila paper themes, and wired up core JS dragging handlers." 
  },
  { 
    title: "CASE ENTRY #002: OS Upgrades", 
    date: "Phase 2 - Mechanics", 
    content: "Implemented Taskbar docking, edge-snapping, and active window resizing." 
  },
  { 
    title: "CASE ENTRY #003: CBI Customization", 
    date: "Phase 3 - Detective UI", 
    content: "Added interactive HTML5 Canvas evidence board for drawing red strings.\n\nIntegrated CBI Terminal for command-line access." 
  }
];

let savedUserDevlogs = JSON.parse(localStorage.getItem('stardance_user_devlogs') || '[]');
let activeDevlogs = [...defaultDevlogs, ...savedUserDevlogs];
let activeDevlogIndex = 0;

const devlogListEl = document.getElementById('devlog-list');
const devlogBodyEl = document.getElementById('devlog-body');

function renderDevlogList() {
  if (!devlogListEl) return;
  devlogListEl.innerHTML = '';
  
  activeDevlogs.forEach((log, index) => {
    const li = document.createElement('li');
    li.className = `log-item ${index === activeDevlogIndex ? 'active' : ''}`;
    li.dataset.index = index;
    li.textContent = `📁 ${log.title}`;
    
    li.addEventListener('click', () => {
      document.querySelectorAll('.log-item').forEach(i => i.classList.remove('active'));
      li.classList.add('active');
      activeDevlogIndex = index;
      renderDevlogContent(index);
    });
    
    devlogListEl.appendChild(li);
  });
}

function renderDevlogContent(index) {
  if (!devlogBodyEl || !activeDevlogs[index]) return;
  const log = activeDevlogs[index];
  const paragraphs = log.content.split('\n\n').map(p => `<p>${p.replace(/\n/g, '<br/>')}</p>`).join('');
  devlogBodyEl.innerHTML = `<h4>${log.title}</h4><span class="log-date">📅 ${log.date}</span>${paragraphs}`;
}

renderDevlogList();
renderDevlogContent(0);

document.getElementById('add-case-entry-btn').addEventListener('click', () => {
  const title = prompt("Enter Case Entry Title:", "CASE ENTRY #" + (activeDevlogs.length + 1));
  if (!title) return;
  
  const content = prompt("Enter Entry Notes (Separate paragraphs with a double linebreak):", "");
  if (!content) return;
  
  const newLog = { 
    title: title, 
    date: "New Log - " + new Date().toLocaleDateString(), 
    content: content 
  };
  
  savedUserDevlogs.push(newLog);
  localStorage.setItem('stardance_user_devlogs', JSON.stringify(savedUserDevlogs));
  activeDevlogs.push(newLog);
  activeDevlogIndex = activeDevlogs.length - 1;
  
  renderDevlogList();
  renderDevlogContent(activeDevlogIndex);
});

document.getElementById('edit-case-entry-btn').addEventListener('click', () => {
  const currentLog = activeDevlogs[activeDevlogIndex];
  const newContent = prompt("Edit Paragraphs for '" + currentLog.title + "':", currentLog.content);
  
  if (newContent !== null) {
    currentLog.content = newContent;
    localStorage.setItem('stardance_user_devlogs', JSON.stringify(activeDevlogs.slice(defaultDevlogs.length)));
    renderDevlogContent(activeDevlogIndex);
  }
});


// --- 8. TEA LOUNGE ENGINE ---
let teaInterval = null; 
let totalSeconds = 180; 
let remainingSeconds = 180; 
let isRunning = false;

const timerDisplay = document.getElementById('tea-timer');
const startBtn = document.getElementById('tea-start-btn');
const resetBtn = document.getElementById('tea-reset-btn');
const presetChips = document.querySelectorAll('.tea-chip');

function formatTime(sec) {
  const mins = Math.floor(sec / 60).toString().padStart(2, '0');
  const secs = (sec % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
}

presetChips.forEach(chip => {
  chip.addEventListener('click', () => {
    if (isRunning) clearInterval(teaInterval);
    isRunning = false; 
    startBtn.textContent = 'Start Steeping';
    
    presetChips.forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    
    totalSeconds = parseInt(chip.dataset.time, 10);
    remainingSeconds = totalSeconds;
    timerDisplay.textContent = formatTime(remainingSeconds);
  });
});

if (startBtn) {
  startBtn.addEventListener('click', () => {
    if (isRunning) {
      clearInterval(teaInterval); 
      isRunning = false; 
      startBtn.textContent = 'Resume Steeping';
    } else {
      isRunning = true; 
      startBtn.textContent = 'Pause';
      
      teaInterval = setInterval(() => {
        remainingSeconds--; 
        timerDisplay.textContent = formatTime(remainingSeconds);
        
        if (remainingSeconds <= 0) {
          clearInterval(teaInterval); 
          isRunning = false; 
          timerDisplay.textContent = '00:00';
          startBtn.textContent = 'Tea Ready!'; 
          alert('☕ Your tea has steeped to perfection!');
        }
      }, 1000);
    }
  });
}

if (resetBtn) {
  resetBtn.addEventListener('click', () => {
    clearInterval(teaInterval); 
    isRunning = false; 
    remainingSeconds = totalSeconds;
    timerDisplay.textContent = formatTime(remainingSeconds); 
    startBtn.textContent = 'Start Steeping';
  });
}


// --- 9. ENCRYPTED NOTEPAD & ARCHIVE MANAGER ---
const notepadArea = document.getElementById('field-notes');
const saveStatus = document.getElementById('notepad-save-status');
const archiveSelect = document.getElementById('notes-archive-select');
const saveArchiveBtn = document.getElementById('save-note-archive-btn');

if (notepadArea) {
  const savedDraft = localStorage.getItem('stardance_cbi_draft');
  if (savedDraft) notepadArea.value = savedDraft;
  
  notepadArea.addEventListener('input', () => {
    localStorage.setItem('stardance_cbi_draft', notepadArea.value);
    saveStatus.textContent = 'Status: Draft Synced (' + new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) + ')';
  });
}

function loadArchiveDropdown() {
  if (!archiveSelect) return;
  const archives = JSON.parse(localStorage.getItem('stardance_notes_archive') || '[]');
  archiveSelect.innerHTML = '<option value="">📜 Load Saved Note...</option>';
  
  archives.forEach((item, index) => {
    const opt = document.createElement('option');
    opt.value = index; 
    opt.textContent = `${item.title} (${item.timestamp})`;
    archiveSelect.appendChild(opt);
  });
}

if (saveArchiveBtn) {
  saveArchiveBtn.addEventListener('click', () => {
    const text = notepadArea.value.trim();
    if (!text) { 
      alert("Cannot save an empty note!"); 
      return; 
    }
    
    const title = prompt("Enter Note Title:", "Field Note #" + (archiveSelect.options.length + 1));
    if (!title) return;
    
    const archives = JSON.parse(localStorage.getItem('stardance_notes_archive') || '[]');
    archives.push({ 
      title: title, 
      text: text, 
      timestamp: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) 
    });
    
    localStorage.setItem('stardance_notes_archive', JSON.stringify(archives));
    loadArchiveDropdown(); 
    alert("Note saved into Archive!");
  });
}

if (archiveSelect) {
  archiveSelect.addEventListener('change', (e) => {
    const idx = e.target.value; 
    if (idx === '') return;
    
    const archives = JSON.parse(localStorage.getItem('stardance_notes_archive') || '[]');
    if (archives[idx]) {
      notepadArea.value = archives[idx].text;
      localStorage.setItem('stardance_cbi_draft', notepadArea.value);
      saveStatus.textContent = 'Status: Loaded ' + archives[idx].title;
    }
  });
}
loadArchiveDropdown();


// --- 10. MULTI-OPTION SOUNDSCAPE ENGINE ---
let audioCtx = null; 
let ambientSource = null; 
let isAmbientPlaying = false;
const toggleAmbientBtn = document.getElementById('toggle-ambient-btn');

if (toggleAmbientBtn) {
  toggleAmbientBtn.addEventListener('click', () => {
    if (isAmbientPlaying) {
      if (ambientSource) ambientSource.stop();
      isAmbientPlaying = false; 
      toggleAmbientBtn.textContent = 'Start Soundscape';
    } else {
      const mode = document.querySelector('input[name="soundscape"]:checked').value;
      try {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const bufferSize = audioCtx.sampleRate * 2;
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
          if (mode === 'rain') { 
            data[i] = (Math.random() * 2 - 1) * 0.1; 
          } else if (mode === 'office') { 
            data[i] = (Math.random() * 2 - 1) * 0.03; 
          } else if (mode === 'vinyl') { 
            data[i] = Math.random() > 0.98 ? (Math.random() * 2 - 1) * 0.3 : (Math.random() * 2 - 1) * 0.02; 
          } else if (mode === 'typing') { 
            data[i] = Math.random() > 0.95 ? (Math.random() * 2 - 1) * 0.25 : 0; 
          }
        }

        ambientSource = audioCtx.createBufferSource();
        ambientSource.buffer = buffer; 
        ambientSource.loop = true;
        
        const gainNode = audioCtx.createGain(); 
        gainNode.gain.setValueAtTime(0.04, audioCtx.currentTime);
        
        ambientSource.connect(gainNode); 
        gainNode.connect(audioCtx.destination);
        ambientSource.start();
        
        isAmbientPlaying = true; 
        toggleAmbientBtn.textContent = 'Stop Soundscape';
      } catch (e) { 
        console.log('Audio Context restricted'); 
      }
    }
  });
}

// --- 11. DEDUCTION ENGINE OBSERVATIONS ---
const observations = [
  "Noticing a subtle hesitation in your mouse movements...",
  "Browsing evidence logs... searching for a specific pattern?",
  "Fidgeting with open windows... classic sign of intense focus.",
  "You haven't touched the tea timer in a while. Caffeine low?",
  "A quiet detective is either thorough or plotting something clever."
];
const tickerEl = document.getElementById('deduction-ticker');

function updateObservation(text) { 
  if (tickerEl) tickerEl.textContent = `Observation: ${text}`; 
}

setInterval(() => {
  const randomIndex = Math.floor(Math.random() * observations.length);
  updateObservation(observations[randomIndex]);
}, 18000);


// --- 12. AGENCY BADGE ISSUANCE & CANVAS DOWNLOAD ---
const badgeModal = document.getElementById('cbi-credential-modal');

const closeBadgeBtn = document.getElementById('close-badge-modal');
const generateBadgeBtn = document.getElementById('generate-badge-btn');
const downloadBadgeBtn = document.getElementById('download-badge-btn');
const badgeFormPane = document.getElementById('badge-form-pane');
const badgeCardResult = document.getElementById('badge-card-result');

const cbiBadgeEgg = document.getElementById('cbi-badge-egg');
if (cbiBadgeEgg) {
  cbiBadgeEgg.addEventListener('click', () => { 
    badgeModal.classList.remove('hidden'); 
  });
}

if (closeBadgeBtn) {
  closeBadgeBtn.addEventListener('click', () => { 
    badgeModal.classList.add('hidden'); 
  });
}

if (generateBadgeBtn) {
  generateBadgeBtn.addEventListener('click', () => {
    const name = document.getElementById('consultant-name').value.trim() || "Special Investigator";
    const dept = document.getElementById('consultant-dept').value;
    
    document.getElementById('issued-name').textContent = name;
    document.getElementById('issued-spec').textContent = "Field: " + dept;
    document.getElementById('issued-serial').textContent = "ID: FBI-" + Math.floor(10000 + Math.random() * 90000) + "-CA";
    
    badgeFormPane.classList.add('hidden'); 
    badgeCardResult.classList.remove('hidden');
  });
}

if (downloadBadgeBtn) {
  downloadBadgeBtn.addEventListener('click', () => {
    const name = document.getElementById('issued-name').textContent;
    const spec = document.getElementById('issued-spec').textContent;
    const serial = document.getElementById('issued-serial').textContent;

    const canvas = document.createElement('canvas');
    canvas.width = 500; 
    canvas.height = 280;
    const ctx = canvas.getContext('2d');

    // 1. Draw Background
    const grad = ctx.createLinearGradient(0, 0, 500, 280);
    grad.addColorStop(0, '#2b1c11'); 
    grad.addColorStop(1, '#120b07');
    ctx.fillStyle = grad; 
    ctx.fillRect(0, 0, 500, 280);

    // 2. Draw Borders
    ctx.strokeStyle = '#c29b38'; 
    ctx.lineWidth = 4; 
    ctx.strokeRect(10, 10, 480, 260);
    
    // 3. Draw Header
    ctx.fillStyle = '#c29b38'; 
    ctx.font = 'bold 16px Courier New'; 
    ctx.textAlign = 'center';
    ctx.fillText('FEDERAL BUREAU OF INVESTIGATION', 250, 40);

    ctx.beginPath(); 
    ctx.moveTo(30, 50); 
    ctx.lineTo(470, 50); 
    ctx.strokeStyle = '#c29b38'; 
    ctx.stroke();
    
    // 4. Draw the Badge Seal (Using Real Image if loaded, otherwise fallback)
    const badgeSource = document.getElementById('cbi-badge-source');
    if (badgeSource && badgeSource.complete && badgeSource.naturalHeight !== 0) {
      // Draw image (x, y, width, height)
      ctx.drawImage(badgeSource, 60, 110, 70, 70);
    } else {
      // Fallback to emoji if image is broken/missing
      ctx.font = '60px serif'; 
      ctx.fillText('⭐', 80, 150);
    }

    // 5. Draw Text details
    ctx.textAlign = 'left'; 
    ctx.fillStyle = '#ffffff'; 
    ctx.font = 'bold 20px Courier New'; 
    ctx.fillText(name, 150, 110);
    
    ctx.fillStyle = '#d2c3a5'; 
    ctx.font = '14px Courier New'; 
    ctx.fillText('Special Consultant', 150, 135); 
    ctx.fillText(spec, 150, 160);
    
    ctx.fillStyle = '#c29b38'; 
    ctx.font = 'bold 13px Courier New'; 
    ctx.fillText(serial, 150, 190);

    // 6. Draw Signature
    ctx.textAlign = 'right'; 
    ctx.fillStyle = '#aaaaaa'; 
    ctx.font = 'italic 12px Courier New'; 
    ctx.fillText('Authorized by: FBI Director Srijit Banerjee', 460, 245);

    // 7. Trigger Download
    const link = document.createElement('a');
    link.download = `FBI_Badge_${name.replace(/\s+/g, '_')}.png`;
    link.href = canvas.toDataURL('image/png'); 
    link.click();
  });
}


// --- 13. CONTEXT MENU & RED JOHN EASTER EGG ---
const contextMenu = document.getElementById('context-menu');
document.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  if (contextMenu) {
    contextMenu.style.left = `${e.clientX}px`; 
    contextMenu.style.top = `${e.clientY}px`; 
    contextMenu.classList.remove('hidden');
  }
});

document.addEventListener('click', (e) => {
  if (contextMenu && !contextMenu.contains(e.target)) {
    contextMenu.classList.add('hidden');
  }
});

document.getElementById('cm-inspect').addEventListener('click', () => { 
  updateObservation("Patrick Jane is inspecting the desk surface for fingerprints..."); 
  contextMenu.classList.add('hidden'); 
});
document.getElementById('cm-terminal').addEventListener('click', () => { 
  document.getElementById('launch-terminal').click(); 
  contextMenu.classList.add('hidden'); 
});
document.getElementById('cm-team').addEventListener('click', () => { 
  document.getElementById('launch-team').click(); 
  contextMenu.classList.add('hidden'); 
});
document.getElementById('cm-badge').addEventListener('click', () => { 
  badgeModal.classList.remove('hidden'); 
  contextMenu.classList.add('hidden'); 
});
document.getElementById('cm-tea').addEventListener('click', () => { 
  document.getElementById('launch-tea').click(); 
  contextMenu.classList.add('hidden'); 
});
document.getElementById('cm-devlogs').addEventListener('click', () => { 
  document.getElementById('launch-devlog').click(); 
  contextMenu.classList.add('hidden'); 
});
document.getElementById('cm-pinboard').addEventListener('click', () => { 
  document.getElementById('launch-pinboard').click(); 
  contextMenu.classList.add('hidden'); 
});
document.getElementById('cm-notepad').addEventListener('click', () => { 
  document.getElementById('launch-notepad').click(); 
  contextMenu.classList.add('hidden'); 
});
document.getElementById('cm-darkmode').addEventListener('click', () => { 
  triggerRedJohnEffect(); 
  contextMenu.classList.add('hidden'); 
});

function triggerRedJohnEffect() {
  const overlay = document.getElementById('rj-overlay');
  const dripsContainer = document.getElementById('blood-drips-container');
  dripsContainer.innerHTML = '';
  
  for (let i = 0; i < 25; i++) {
    const drop = document.createElement('div'); 
    drop.className = 'blood-drop';
    drop.style.left = `${Math.random() * 100}vw`; 
    drop.style.animationDuration = `${1 + Math.random() * 2}s`; 
    drop.style.animationDelay = `${Math.random() * 0.5}s`;
    dripsContainer.appendChild(drop);
  }
  
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator(); 
    const gain = ctx.createGain();
    
    osc.type = 'sawtooth'; 
    osc.frequency.setValueAtTime(110, ctx.currentTime); 
    osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 1.8);
    
    gain.gain.setValueAtTime(0.4, ctx.currentTime); 
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.8);
    
    osc.connect(gain); 
    gain.connect(ctx.destination); 
    osc.start(); 
    osc.stop(ctx.currentTime + 1.8);
  } catch (e) {
    console.log("Audio Context Blocked");
  }

  overlay.classList.remove('hidden'); 
  document.body.classList.toggle('dark-mode');
  
  setTimeout(() => { 
    overlay.classList.add('hidden'); 
  }, 2200);
}

document.getElementById('red-john-egg').addEventListener('click', triggerRedJohnEffect);