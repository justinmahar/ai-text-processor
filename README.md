<h2 align="center">
  📖 AI Text Processor
</h2>
<h3 align="center">
  Utility for processing text using AI.
</h3>
<h4 align="center">
  Summarize, analyze, extract, translate, format, and more! ✨
</h4>
<p align="center">
  <a href="https://badge.fury.io/js/ai-text-processor" target="_blank" rel="noopener noreferrer"><img src="https://badge.fury.io/js/ai-text-processor.svg" alt="npm Version" /></a>&nbsp;
  <a href="https://github.com/justinmahar/ai-text-processor/" target="_blank" rel="noopener noreferrer"><img src="https://img.shields.io/badge/GitHub-Source-success" alt="View project on GitHub" /></a>&nbsp;
  <a href="https://github.com/justinmahar/ai-text-processor/actions?query=workflow%3ADeploy" target="_blank" rel="noopener noreferrer"><img src="https://github.com/justinmahar/ai-text-processor/workflows/Deploy/badge.svg" alt="Deploy Status" /></a>
</p>
<!-- [lock:donate-badges] 🚫--------------------------------------- -->
<p align="center">
  <a href="https://ko-fi.com/justinmahar"><img src="https://img.shields.io/static/v1?label=Buy%20me%20a%20coffee&message=%E2%9D%A4&logo=KoFi&color=%23fe8e86" alt="Buy me a coffee" /></a>&nbsp;<a href="https://github.com/sponsors/justinmahar" target="_blank" rel="noopener noreferrer"><img src="https://img.shields.io/static/v1?label=Sponsor&message=%E2%9D%A4&logo=GitHub&color=%23fe8e86" alt="Sponsor"/></a>
</p>
<!-- [/lock:donate-badges] ---------------------------------------🚫 -->

<p align="center">
  <a href="https://justinmahar.github.io/ai-text-processor/?path=/story/utilities-ai-text-processor--processor"><img src="https://raw.githubusercontent.com/justinmahar/ai-text-processor/master/screenshots/extract-data-screenshot.webp" alt="Screenshot of AI Text Processor extracting an apple pie recipe" width="450" /></a>
</p>

<h2 align="center"><a href="https://justinmahar.github.io/ai-text-processor/?path=/story/utilities-ai-text-processor--processor">→ Open The AI Text Processor ←</a></h2>

## Overview

This utility allows you to quickly and easily process text using any of OpenAI's chat models.

You can configure and save presets for easy reuse of prompts, and the utility will chunk long input text into multiple requests.

The utility is highly configurable, so you can dial in the settings that work best for you.

Happy text processing! 

[Click here to open the utility.](https://justinmahar.github.io/ai-text-processor/?path=/story/utilities-ai-text-processor--processor)

### Features include:

- **📖 Process Text With AI**
  - Quickly and easily process text using any of OpenAI's chat models.
- **📒 Presets**
  - Speed up your workflow by saving presets that let you reuse your prompts. Includes support for prompt variables.
- **✂️ Chunking**
  - Automatically split long inputs into chunks that leave token headroom for your desired output.
- **⚙️ Configurable**
  - Lots of control! Configure AI models, prompts, token length, and chunking logic.
- **🧑‍💻 Supports Many Use Cases**
  - Supports summarization, analysis, data extraction, translation, formatting—the possibilities are endless!

<!-- [lock:donate] 🚫--------------------------------------- -->

## Donate 

If this project helped you, please consider buying me a coffee or sponsoring me. Your support is much appreciated!

<a href="https://ko-fi.com/justinmahar"><img src="https://img.shields.io/static/v1?label=Buy%20me%20a%20coffee&message=%E2%9D%A4&logo=KoFi&color=%23fe8e86" alt="Buy me a coffee" /></a>&nbsp;<a href="https://github.com/sponsors/justinmahar" target="_blank" rel="noopener noreferrer"><img src="https://img.shields.io/static/v1?label=Sponsor&message=%E2%9D%A4&logo=GitHub&color=%23fe8e86" alt="Sponsor"/></a>

<!-- [/lock:donate] ---------------------------------------🚫 -->

## Table of Contents 

- [Overview](#overview)
  - [Features include:](#features-include)
- [Donate](#donate)
- [Table of Contents](#table-of-contents)
- [Quick Start](#quick-start)
- [Use Cases](#use-cases)
- [npm Package](#npm-package)
- [TypeScript](#typescript)
- [Icon Attribution](#icon-attribution)
- [Contributing](#contributing)
- [⭐ Found It Helpful? Star It!](#-found-it-helpful-star-it)
- [License](#license)

## Quick Start

This utility is a static webapp hosted on GitHub Pages.

[Click here to open the utility.](https://justinmahar.github.io/ai-text-processor/?path=/story/utilities-ai-text-processor--processor)

## Use Cases

This utility supports variety of use cases, including (but certainly not limited to) the following:

- **Summarization** - Summarize large amounts of text.
- **Analysis** - Analyze text using specified criteria. Possibilities are endless, from sentiment analysis to finding bugs in software.
- **Data Extraction** - Extract key data from large amounts of text.
- **Language Translation** - Translate text from one language to another.
- **Text Formatting** - Format output text using specified criteria.

One of the main features of this utility is the ability to save and reuse presets. This can significantly speed up your workflow.

## npm Package

This package is available on npm, should you want to use its text processing utilities in your own app.

```bash
npm i ai-text-processor
```

```js
import { TextUtils } from `ai-text-processor`
```

Utility Functions:

- `TextUtils.shrinkText` - Condense whitespace and remove timestamps (#:#)
- `TextUtils.getEstimatedTokenCount` - Estimate the number of tokens in text
- `TextUtils.getChunks` - Split text into chunks based on token limits

<!-- [lock:typescript] 🚫--------------------------------------- -->

## TypeScript

Type definitions have been included for [TypeScript](https://www.typescriptlang.org/) support.

<!-- [/lock:typescript] ---------------------------------------🚫 -->

<!-- [lock:icon] 🚫--------------------------------------- -->

## Icon Attribution

Favicon by [Twemoji](https://github.com/twitter/twemoji).

<!-- [/lock:icon] ---------------------------------------🚫 -->

<!-- [lock:contributing] 🚫--------------------------------------- -->

## Contributing

Open source software is awesome and so are you. 😎

Feel free to submit a pull request for bugs or additions, and make sure to update tests as appropriate. If you find a mistake in the docs, send a PR! Even the smallest changes help.

For major changes, open an issue first to discuss what you'd like to change.

<!-- [/lock:contributing] --------------------------------------🚫 -->

## ⭐ Found It Helpful? [Star It!](https://github.com/justinmahar/ai-text-processor/stargazers)

If you found this project helpful, let the community know by giving it a [star](https://github.com/justinmahar/ai-text-processor/stargazers): [👉⭐](https://github.com/justinmahar/ai-text-processor/stargazers)

## License

See [LICENSE.md](https://justinmahar.github.io/ai-text-processor/?path=/story/license--page).