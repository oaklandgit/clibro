# clibrowz
A CLI web browser that doesn't move focus away from your current tasks.

## Problem

Using command line tools and Vim allows me to get much of my workflow done directly in the terminal.

One task that takes me away from that flow is gathering information from the web, which forces me to switch to a web browser in the GUI.

Although there are text-based web browsers such as Lynx for use in the terminal, I sometimes want more visually-rich (but ) that requires some visual context.

What if web browsing could be done from the terminal, without having to take your hands off the keyboard?

## Solution

CliBrowse aims to be a CLI too that:

1. Presents information linearly
2. Keeps you focused on whatever workflow you're in -- the browser is coming to your command line, not vice versa
3. Provides more visual context than text-only browsers like Lynx.

## Usage 

(Requires kitty or similar terminal that enables inline graphics.)

Display a web page as an inline image in the terminal
```
$ clib google.com
```

The page will be displayed with a graphic overlay of letters corresponding to all links. Clib remembers the last page visited to enable subsequent interactions, whether or not you use other non-CliBrowse commands.

### Commands

Go to any URL:
```
clib apple.com
```

Follow a link by numbered code:
```
clib 123
```

[TO DO] Display more of the current page (below the fold)
```
clib M
```
NOTE: To view the parts of the page already shown, simply scroll up

[TO DO] Go backward or forward in history
```
clib <
```
```
clib >
```

[TO DO] Apply flags to the previously-visited page, and re-display
```
clib -[flags]
```

## Flags

Display without no link labels
```
clib google.com -nl
```
Change the default height of the "viewport"

```
clib google.com -h 500
```


