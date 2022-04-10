# clibrowz
A CLI web browser that doesn't move your focus (or hands) away from your current non-browser task.

## Basic Usage

```
$ clibrowz <destination> [flags]
```

Display a web page as an inline image in the terminal:

```
$ clibrowz http://yahoo.com
```
Output:
> ![Example of a clibrowz page](example-image-01.png)
> $

Notice the image has numeric labels representing each link, which can be used to browse:

```
$ clibrowz 21
```

`clibrowz 21` means "take me to the link labeled `21` from the last clibrowz call." In this example, link 21 is yahoo news.

Also notice that after each command, you're back in the shell prompt. You could continue browsing, or you could continue with other work in the terminal. Clibrowz will remember the last-visited page and all its links.

If the previous page has scrolled out of view, you could scroll back. But it would probably be easier to simply re-display it. Calling clibrowz with no url or numbered link will simply redisplay that last page:

```
$ clibrowz
```

## Philosophy

We use the command line because it enables -- among other things -- more efficient workflows than using a mouse and windows. It lets us focus on our *tasks* while not making us context switch between various software packages. Instead, we simply string together a flow of command line tools without ever having to leave the shell.

But one task that still takes us away from that flow is the information-gathering we do in web browsers such as Chrome or Safari. This forces us out of the terminal and into the GUI, yucking our yum.

So why not use a terminal-based browser such as Lynx? Because we may want a more visually-rich web view for providing easier consumption and context. Or perhaps you're a web developer who needs to see visually how things render graphically.

## Solution

Clibrowz aims to be a CLI too that:

1. presents web pages linearly, within the top-to-bottom flow of the terminal
2. keeps you focused on whatever workflow you're in -- the browser comes to your command line, not vice versa
3. provides more visual context than text-only browsers like Lynx

## Requirements

Clibrowz leverages the following packages:

1. [Python3](https://www.python.org/downloads/)
2. [Selenium](https://selenium-python.readthedocs.io/installation.html) and [Chromedriver](https://chromedriver.chromium.org/getting-started) for Python: allows the tool to interact with web pages
3. [Viu](https://github.com/atanunq/viu): a command line tool for viewing graphical images in the terminal)
4. Kitty, or any terminal that supports the [Terminal Graphics Prototocol](https://sw.kovidgoyal.net/kitty/graphics-protocol/)

## Installation

Assuming you have the above installed, giving the `clibrowz` file execute permissions and creating an alias will allow you to use the tool regardless of what directory you happen to be in.

### Commands (Implemented)

Display any web page:
```
clibrowz http://yahoo.com
```

Follow a link by its numeric label:
```
clibrowz 123
```

### Commands (Planned)

Re-display the current page:
```
clibrowz
```

Display more of the current page (similar to "scrolling below the fold")
```
clibrowz j // or J (vim-inspired)
```

Display more of the current page (similar to "scrolling back up")
```
clibrowz k // or K
```

Go backward or forward in history
```
clibrowz h // or H or >
```
```
clibrowz l // or L or <
```

### Flags (Planned)

Override the default width of the page.
```
clibrowz http://yahoo.com --width 1200 // or -w 1200
```

Override the default height of the "fold" (how much of the page viewport is shown):
```
clibrowz http://yahoo.com --height 500 // or -h 500
```

Display without link labels:
```
clibrowze http://yahoo.com --no-labels // or -n
```

Also display a text-based, ordered list of all the links:
```
clibrowz http://yahoo.com --list-links // or -l
```

Single-character flags can be combined. Display without link labels but with a text-based list of links:
```
clibrowz http://yahoo.com  -ln
```

Flags can be used with or without a url. For example, this will redisplay the most-recently-visited page in a narrower viewport (perhaps you wanted to see how it looks on a mobile device):
```
clibrowz -w 420
```

Flags can be combined with link labels. For example, this will display link 21 
```
clibrowz 21  -ln
```

### FAQs

#### Q: Where does clibrowz store its data?
A: In your `/tmp/' directory
