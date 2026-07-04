# Indian Embassy Kathmandu - Consular Chatbot Widget

A self-contained, lightweight, and highly interactive conversational chatbot widget built using **pure HTML, CSS, and Vanilla JavaScript**. It requires **zero external frameworks** or libraries (no React, jQuery, or TailwindCSS), making it easily embeddable into any website page.

The conversational flow represents the exact logic tree provided in the client's flowchart for consular inquiries (3rd Country Travel NOC and Indian National Registration) at the **Embassy of India, Kathmandu, Nepal**.

---

## Features
- **Floating Widget UI**: Neatly tucked in the bottom-right corner of any page. Expands and collapses on click.
- **Embassy Brand Colors**: Styled using Indian national colors (Saffron, White, Green, and Deep Navy Blue).
- **Responsive Layout**: Designed using CSS flexbox/grid. Adapts beautifully to mobile, tablet, and desktop viewports.
- **Glassmorphic Aesthetics**: Modern design features including custom scrollbars, subtle box shadows, pulsing badges, and smooth sliding/fading micro-animations.
- **Interactive Quick-Reply Options**: Users can click pre-defined options representing the flowchart branches.
- **Personalized State Flow**: Solicits user's name for personalized greeting and follows up on selected options.
- **Self-Centering Scroll**: Automatically scrolls to the bottom when new bot messages or options appear.
- **Natural Response Delay**: Mimics a live consular assistant using a delayed typing indicator (three jumping dots).

---

## How to Integrate the Chatbot

Integrating the chatbot into any page on any website is simple. Just copy `chatbot.css` and `chatbot.js` into your project directory and follow these steps:

### Step 1: Link the Stylesheet
Add the `chatbot.css` link inside the `<head>` tag of your HTML:
```html
<link rel="stylesheet" href="chatbot.css">
```

### Step 2: Include the Script
Add the `chatbot.js` script tag just before the closing `</body>` tag of your HTML:
```html
<script src="chatbot.js"></script>
```

That's it! When the page loads, `chatbot.js` will automatically inject the chatbot widget container, mount the trigger bubble, and run the conversation tree.

---

## Optional: Custom Mount Point
By default, the script looks for a container with the ID `indian-embassy-chatbot-root`. If it is not found, it creates one and appends it to `document.body` automatically.

If you want the chatbot widget elements to load at a specific point in your HTML structure, you can manually place this placeholder `div` anywhere inside the `<body>`:
```html
<div id="indian-embassy-chatbot-root"></div>
```

---

## Customizing Conversational States
The conversation flow is represented as a state machine inside `chatbot.js`. Each state contains:
- `text`: A string or a function returning a string (supports HTML tags like lists `<ul>` or links `<a>`).
- `options`: An array of quick-reply buttons. Each button has a target `next` state.
- `inputType`: Set to `"text"` if you want to request user input (e.g. asking for name).
- `onEnter`: Optional callback function executed when the state is activated.

To add new categories, simply extend the `ChatFlow` object at the top of `chatbot.js`.

---

## Customizing Colors (CSS Variables)
To match another website's color scheme, you can modify the CSS variables defined at the top of the `.ie-chatbot-widget` rule in `chatbot.css`:
```css
.ie-chatbot-widget {
    --ie-saffron: #FF671F;        /* Primary accent / User bubble */
    --ie-navy: #000080;           /* Header bg / Quick reply border / Bot logo */
    --ie-green: #046A38;          /* Accent stripe / trigger border */
    --ie-bg-white: #ffffff;       /* Card background */
    --ie-bg-light: #f8fafc;       /* Scroll screen background */
    ...
}
```
