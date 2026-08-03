# Mentalist OS (CBI Edition)

I am very excited to share my web operating system project with you. Most of the time when you open a browser it looks very modern and sleek with colors.. I wanted to create something that feels warm and personal. The Mentalist is one of my television shows. So I designed this operating system to look like a desk at the Sacramento CBI detective station.
Everything in this system is designed to look like case files and notes. Of regular windows I made everything look like manila folders and corkboards where you can pin up notes and pictures.

---

## What is Inside The Mentalist OS

* I made a window system that uses simple JavaScript and lets you drag things around and stack them on top of each other.
* There is a tea timer that helps you focus it is called Patricks Tea Lounge. You can choose from types of tea like Earl Grey or Green Tea. When your tea is ready you will hear a sound.
* The CBI Investigators Log is like a diary where you can write down what you are working on and track your progress.
* The Evidence Pinboard is like a corkboard where you can pin up pictures and notes and even connect them with strings.
* The Encrypted Field Notes is a notepad where you can write down your thoughts and it will save them right in your browser.
* The Patrick Jane Deduction Engine is like a voice that gives you hints and observations as you use the system.
* If you look closely you can find a secret Easter egg that will change the whole system to a dark mode, with spooky sounds.

---

## How I Built The Mentalist OS

* I used HTML5 and CSS3 to make the system look like paper and to make the layout flexible.
* I used JavaScript to make the system work fast and responsive.
* I used the Web Audio API to make the sounds you hear in the system.

---

## How to test it
It's just plain HTML, CSS, and JS. No frameworks, no npm installs. 
Just download the files and open `index.html` in your browser. 

---

## Challenges
Getting the z-index stacking to work properly was definitely the hardest part. I had to figure out how to track the highest z-index value globally so that whichever window you click always jumps in front of the others.

---

📝 Devlog Entry for WebOS 2 (Copy & Paste for Stardance)WebOS 2 Evolution: True Operating System States & Intelligence ExpansionUpgrading from WebOS 1 to WebOS 2 fundamentally shifted this project from a themed visual dashboard into a responsive, state-driven operating system. While the first iteration established the tactile Mentalist case file aesthetic with basic dragging and localStorage persistence, Version 2 completely overhauled the mechanics to deliver genuine desktop utility and deep lore integration.Phase 1: Advanced Window State MechanicsThe core engine was rewritten to support professional window management. I introduced a bottom taskbar dock, allowing users to minimize windows into glowing icons and restore them to their exact previous states. I also built a dynamic resizing system with custom CSS drag handles (right, bottom, bottom-right) and an edge-snapping mechanic where dragging a window to the left or right of the screen automatically tiles it to fill exactly $50\%$ of the viewport.Phase 2: The Sacramento Database & Intelligence ExpansionThe global search bar was drastically upgraded to index over 50 distinct characters, suspects, victims, and agents across The Mentalist universe. This acts as a true OS file-system search, allowing you to quickly query names like "Virgil Minelli" or "Lorelei Martins" and instantly pull up their clearance statuses, affiliations, and lore context. I also expanded the Devlog tool to feature a multi-paragraph editor, giving users total control to document ongoing investigations or development notes.Phase 3: Soundscapes & Digital Badge GenerationTo deepen immersion, the OS now features a 4-track Web Audio synthesizer, allowing users to generate procedurally rendered soundscapes (Sacramento Rain, Late Night Office Hum, Lo-Fi Vinyl Crackle, and Teletype). Finally, I built a custom CBI Badge Creator using the HTML5 Canvas API. Users can input their name and forensic specialty to generate an official digital CBI ID credential, which they can instantly export and download as a PNG image file.