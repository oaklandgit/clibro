# Clibro

## Requirements

**Currently only works with [iTerm2](https://iterm2.com/), a graphics-capable terminal for MacOS.**

I'm actively working to make it compatible with Kitty and VS Code's built-in terminal, both of which are purported to be graphics-capable.

## Installation

### Requires bun

`bun` is an amazing new javascript runtime. Installation instructions are [here](http://bun.sh).

### Download and install

You can put a copy of Clibro anywhere convenient. For example:

```
$ mkdir ~/clibro
$ cd ~/clibro
$ git clone https://github.com/oaklandgit/clibro.git
```

Install dependencies:

```
bun install
```

### Create an alias

To make it available in any terminal session, add an alias to your shell profile. I'm using .zshrc, but you can use .bashrc or whatever your shell uses.

The recommended alias is "bro", as in "bro, take me to the Python docs." But really, Clibro is short for "CLI Browser." (You can call it whatever you want. Just be nice.)

```
$ echo "alias bro='[PATH TO YOUR COPY]'" >> ~/.zshrc

$ source .zshrc
```

## Basic Usage

Start Clibro by calling any URL, which will fetch the page and display a labeled screenshot in the terminal:

```
$ bro http://python.org
```

![Screenshot of a Clibro page by URL](/screenshots/clibro-by-url.png)

The numeric labels represent the page's links. To follow a link, simply call it by its label:

```
$ bro 45
```

![Screenshot of a Clibro page by label](/screenshots/clibro-by-label.png)

`bro 45` means "take me to the link labeled `45` from the last bro call." In this example, we browsed this way to a Python doc we were needing.

Also notice that after each command, you're back in the shell prompt. You could continue browsing, or you could continue with other work in the terminal. Clibro will remember the last-visited page and all its links.

## Philosophy

We use the command line because it enables -- among other things -- more efficient workflows than using a mouse and windows. It lets us focus on our _tasks_ while not making us context switch between various software packages. Instead, we simply string together a flow of command line tools without ever having to leave the shell.

But one task that still takes us away from that flow is the information-gathering we do in web browsers such as Chrome or Safari. This forces us out of the terminal and into the GUI, ruining our flow.

So why not use a terminal-based browser such as Lynx? Because we may want a more visually-rich web view for providing easier consumption and context. Or perhaps you're a web developer who needs to see visually how things render graphically.

Clibro aims to be a CLI tool that:

1. presents web pages linearly, within the top-to-bottom flow of the terminal
2. keeps you focused on whatever workflow you're in -- the browser comes to your command line, not vice versa
3. provides more visual context than text-only browsers like Lynx

## CLI Arguments

Display any web page

```
bro http://apple.com
```

Follow a link by its numeric label

```
bro 35
```

Override the default width of the virtual browser's viewport

```
bro -w 620
```

Re-display the most-recently-visited page

```
bro
```

Invert the labels (to be more readable)

```
bro -i
```

## FAQs

### Q: Where does Clibro store its data?

Clibro creates two files in the directory you set up initially. For example, if you cloned the repo to `~/clibro`, then Clibro will store its data there.

- `data.png` the last-visited page's screenshot
- `data.json` sthe last-visited page and all its links

### Q: This looks hella useful! Can I contribute?

A: Yes, please! Here's the [issues backlog](https://github.com/oaklandgit/clibro/issues).
