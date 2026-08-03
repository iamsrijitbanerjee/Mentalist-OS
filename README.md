# Mentalist OS (CBI Edition)

I am very excited to share my web operating system project with you. Most of the time when you open a browser it looks very modern and sleek with colors.. I wanted to create something that feels warm and personal. The Mentalist is one of my television shows. So I designed this operating system to look like a desk at the Sacramento CBI detective station.
Everything in this system is designed to look like case files and notes. Of regular windows I made everything look like manila folders and corkboards where you can pin up notes and pictures.

---

## What This Operating System Can Do

### The Basics

- **Moving Windows Around:** You can. Drop windows to move them. You can also change the borders of the windows to make them look different.
- **Making Windows Smaller:** You can make windows smaller and put them at the bottom of the screen. Then you can make them big again when you need to.
- **Using The Whole Screen:** If you want to use two windows at the time you can drag one window to the left side of the screen and one to the right side. This way you can see both windows at the time.
- **Getting To Things :** When you right click on the desktop you can get to the things you use a lot.

---

### The Apps That Come With It

- **The Command Line:** This is like a computer. You can type in commands like `help` to get a list of what you can do. You can also type `analyze` to look at something
- **Finding Information:** There is a search bar at the top of the screen. You can use it to find information about people and things. When you click on something you can see details about it.
- **The Red String Board:** This is a thing where you can connect strings between people. You can see how they are all connected.
- **My Notes:** This is a place where you can write things down. It saves what you write so you do not have to worry about losing it.
- **My Investigation Log:** This is like a diary where you can write down what you are doing. You can save it and ome back to it later.
- **The Sounds Of The Office:** This is a thing that makes sounds like rain or a busy office. It can help you focus.
- **The Tea Timer:** This is a timer that you can use to help you focus. You can set it for a few minutes. It will remind you when it is time to take a break.

---

### Fun Secrets/Easter eggs

- **FBI/CBI Badge:** You can make your FBI consultant badge. You can put your name on it, also can be saved to your computer.
- **The Secret Drive:** There is a drive that has a list of people on it. You can get to it by using a command. Spoiler: BLAKE ASSOCIATION
- **The Scary Red John Mode:** If you click on the smiley face, the  computer will start making scary sounds and the screen will look different, blood roll animations and dark mode take over. It is, like a fun surprise.

---

## How I Built The Mentalist OS

* I used HTML5 and CSS3 to make the system look like paper and to make the layout flexible.
* I used JavaScript to make the system work fast and responsive.
* I used the Web Audio API to make the sounds you hear in the system.

---

## How to test it
It's just plain HTML, CSS, and JS. No frameworks, no npm installs. 
Just download the files and open `index.html` in your browser. OR

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/YOUR_USERNAME/mentalist-os.git](https://github.com/YOUR_USERNAME/mentalist-os.git)

---

## Challenges
Getting the z-index stacking to work properly was definitely the hardest part. I had to figure out how to track the highest z-index value globally so that whichever window you click always jumps in front of the others.

---