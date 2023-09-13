# Clibro

## Requirements

Currently only works with iTerm2 (a graphics-capable terminal). Actively working to make it compatible with Kitty and VS Code's built-in terminal.

## Installation

### Requires bun

`bun` is a javascript runtime. If you don't have it, install it:

```
npm install -g bun
```

You can put a copy of Clibro anywhere convenient. For example:

```
$ mkdir ~/clibro
$ cd ~/clibro
```

Then clone and build the repo:

```
$ bun install git+https://github.com/oaklandgit/clibro
```

To use it available anywhere (which is sort of the point), add an alias to your shell profile. I'm using .zshrc, but you can use .bashrc or whatever your shell uses.

```
$ echo "alias bro='[PATH TO YOUR COPY]'" >> ~/.zshrc

$ source .zshrc
```

## Basic Usage

Start Clibro by calling any URL, which will fetch the page and display a screenshot it in the terminal:

```
$ bro python.org
```

![Screenshot of a Clibro page by URL](/screenshots/clibro-by-url.png)

Notice the image has numeric labels representing each link, which can be used to browse:

```
$ bro 45
```

![Screenshot of a Clibro page by label](/screenshots/clibro-by-label.png)

`bro 45` means "take me to the link labeled `45` from the last bro call." In this example, we browsed this way to a Python doc we were needing.

Also notice that after each command, you're back in the shell prompt. You could continue browsing, or you could continue with other work in the terminal. Clibro will remember the last-visited page and all its links.

If the previous page has scrolled out of view, you could scroll back. But it would probably be easier to simply re-display it. Calling Clibro with no url or numbered link will simply redisplay that last page:

```
$ bro
```

## Philosophy

We use the command line because it enables -- among other things -- more efficient workflows than using a mouse and windows. It lets us focus on our _tasks_ while not making us context switch between various software packages. Instead, we simply string together a flow of command line tools without ever having to leave the shell.

But one task that still takes us away from that flow is the information-gathering we do in web browsers such as Chrome or Safari. This forces us out of the terminal and into the GUI, yucking our yum.

So why not use a terminal-based browser such as Lynx? Because we may want a more visually-rich web view for providing easier consumption and context. Or perhaps you're a web developer who needs to see visually how things render graphically.

Clibro aims to be a CLI tool that:

1. presents web pages linearly, within the top-to-bottom flow of the terminal
2. keeps you focused on whatever workflow you're in -- the browser comes to your command line, not vice versa
3. provides more visual context than text-only browsers like Lynx

## CLI Arguments

Display any web page

```
bro apple.com
```

Follow a link by its numeric label

```
bro 35
```

Override the default width of the virtual browser's viewport

```
bro -w 1200
```

Override the default height of the "fold" (how much of the page viewport is shown)

```
bro python.org -h 500
```

Re-display the most-recently-visited page

```
bro
```

You can also add flags to re-render the last-visited page as needed. For example, this will redisplay the most-recently-visited page in a narrower viewport (perhaps you wanted to see how it looks on a mobile device)

```
bro -w 420
```

Help

```
bro -h
```

## Not yet implemented

Go backward or forward in history

```
bro B
```

```
bro F
```

Display without link labels

```
bro http://python.org --no-labels // or -n
```

Also display a text-based, ordered list of all the links:

```
bro http://python.org --list-links // or -l
```

## FAQs

### Q: Where does Clibro store its data?

Clibro creates two files in the directory you set up initially. For example, if you cloned the repo to `~/clibro`, then Clibro will store its data there.

- `data.png` the last-visited page's screenshot
- `data.json` sthe last-visited page and all its links

### Q: This looks hella useful! Can I contribute?

A: Yes, please! Here's the [issues backlog](https://github.com/oaklandgit/clibro/issues).

### Q: What's behind the name "Clibro?"

A: It's a portmanteau of "CLI" and "Browser." And also, it's your command-line's "bro." :wink:
