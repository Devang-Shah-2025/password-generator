# Password Generator

A polished, responsive password generator built with vanilla HTML, CSS, and JavaScript. The project focuses on a visually striking UI while still delivering practical password-generation features.

## Preview

The interface uses a dark glassmorphism-style card, bright green accents, layered background glow, and a clean dashboard layout inspired by the provided reference image.

## Features

- Generate two strong passwords at once
- Choose password length from 8 to 32 characters
- Toggle character sets:
	- Uppercase letters
	- Lowercase letters
	- Numbers
	- Symbols
- Exclude ambiguous characters for better readability
- Prevent repeated characters
- Preset modes for quick selection
- Live strength indicator and entropy estimate
- Copy each password individually
- Copy both passwords at once
- Responsive layout for desktop and mobile
- Passwords are generated locally in the browser

## How to Use

1. Open `index.html` in your browser.
2. Adjust the password length and character options.
3. Click **Generate passwords**.
4. Click any generated password to copy it.

## Project Structure

```text
password generator/
	index.html
	index.css
	index.js
	README.md
```

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript
- Google Fonts

## Notes

- Clipboard actions work best in modern browsers.
- Password generation happens entirely on the client side.
- The UI is designed to match the reference style while adding extra polish and usability.

## License

This project is intended for learning and portfolio use.

