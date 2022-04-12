# clibro
A CLI web browser that doesn't move your focus (or hands) away from your current non-browser task.

## Basic Usage

```
$ clibro <destination> [flags]
```

Display a web page as an inline image in the terminal:

```
$ clibro http://wikipedia.com
```
![Screenshot of a clibro page by URL](/screenshots/clibro-by-url.png)

Notice the image has numeric labels representing each link, which can be used to browse:

```
$ clibro 5
```
![Screenshot of a clibro page by label](/screenshots/clibro-by-label.png)

`clibro 5` means "take me to the link labeled `5` from the last clibro call." In this example, link 5 is the French home page for Wikipedia.

Also notice that after each command, you're back in the shell prompt. You could continue browsing, or you could continue with other work in the terminal. Clibro will remember the last-visited page and all its links.

If the previous page has scrolled out of view, you could scroll back. But it would probably be easier to simply re-display it. Calling clibro with no url or numbered link will simply redisplay that last page:

```
$ clibro
```

## Philosophy

We use the command line because it enables -- among other things -- more efficient workflows than using a mouse and windows. It lets us focus on our *tasks* while not making us context switch between various software packages. Instead, we simply string together a flow of command line tools without ever having to leave the shell.

But one task that still takes us away from that flow is the information-gathering we do in web browsers such as Chrome or Safari. This forces us out of the terminal and into the GUI, yucking our yum.

So why not use a terminal-based browser such as Lynx? Because we may want a more visually-rich web view for providing easier consumption and context. Or perhaps you're a web developer who needs to see visually how things render graphically.

## Solution

Clibro aims to be a CLI too that:

1. presents web pages linearly, within the top-to-bottom flow of the terminal
2. keeps you focused on whatever workflow you're in -- the browser comes to your command line, not vice versa
3. provides more visual context than text-only browsers like Lynx

## Requirements

Clibro leverages the following packages:

1. [Python3](https://www.python.org/downloads/)
2. [Selenium](https://selenium-python.readthedocs.io/installation.html) and [Chromedriver](https://chromedriver.chromium.org/getting-started) for Python: allows the tool to interact with web pages
3. [Viu](https://github.com/atanunq/viu): a command line tool for viewing graphical images in the terminal)
4. Kitty, or any terminal that supports the [Terminal Graphics Prototocol](https://sw.kovidgoyal.net/kitty/graphics-protocol/)

## Installation

1. Make sure you have the above requirements
2. Place the `clibro` directory wherever you want it and create an alias in your shell, e.g.
```
alias clibro="python3 /path/to/clibro/run.py"
```

## CLI Arguments

Display any web page
```
clibro http://apple.com
```

Follow a link by its numeric label
```
clibro 35
```

Override the default width of the page
```
clibro http://replit.com --browser-width 1200 // or -w 1200
```

Override the default height of the "fold" (how much of the page viewport is shown)
```
clibro http://python.org --browser-fold 500 // or -f 500
```

Adjust the zoom percentage of the image that outputs to the terminal
```
clibro http://python.org --image-zoom 50 // or -z 50
```

Re-display the most-recently-visited page. Clibro maintains the browse history in `/tmp/clibro.txt`
```
clibro
```
You can also add flags to re-render the last-visited page as needed. For example, this will redisplay the most-recently-visited page in a narrower viewport (perhaps you wanted to see how it looks on a mobile device)
```
clibro -w 420
```
Help
```
clibro --help // or -h
```

## Not yet implemented

Display more of the current page (similar to "scrolling below the fold")
```
clibro j // or J (vim-inspired)
```

Display more of the current page (similar to "scrolling back up")
```
clibro k // or K
```

Go backward or forward in history
```
clibro h // or H or >
```
```
clibro l // or L or <
```

Display without link labels
```
clibro http://python.org --no-labels // or -n
```

Also display a text-based, ordered list of all the links:
```
clibro http://python.org --list-links // or -l
```

Flags can be combined with link labels. For example, this will display link 21 
```
clibro 21  -ln
```

## FAQs

### Q: Where does clibro store its data?
A: In your `/tmp/` directory

### Q: This looks hella useful! Can I contribute?
A: Yes, please! Here's the [issues backlog](https://github.com/oaklandgit/clibro/issues).

### Q: What's behind the name "Clibro?"
A: It's a portmanteau of "CLI" and "Browser." And also, it's your command-line's "bro." 😉
