# Mentalist OS (CBI Edition) 🔍

This is my submission for the Stardance WebOS mission. 

Most Web OS projects I've seen go for that sleek, dark-mode glass aesthetic (like a Mac or Windows 11). I wanted to do something different that actually fits my personality. I'm a huge fan of the show *The Mentalist*, so I built this OS to look like a physical detective's desk at the CBI (California Bureau of Investigation).

Instead of glass and neon, I used manila folders, corkboards, and typewriter fonts. 

## Features
* **Draggable Windows:** Built from scratch using vanilla JavaScript. You can drag the case files around and clicking one brings it to the front.
* **CBI Theme:** Custom CSS to mimic physical case files, complete with red "CONFIDENTIAL" stamps and a wood-grain desk background.
* **Interactive Devlogs:** A built-in app that lets you read through my development process for this mission.
* **Live Clock:** Simple taskbar clock to keep track of time while investigating.

## How to test it
It's just plain HTML, CSS, and JS. No frameworks, no npm installs. 
Just download the files and open `index.html` in your browser. 

## Challenges
Getting the z-index stacking to work properly was definitely the hardest part. I had to figure out how to track the highest z-index value globally so that whichever window you click always jumps in front of the others.