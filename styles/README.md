# XRPL Styles

This folder contains the source files for the XRP Ledger Dev Portal CSS. The combined, minified version of these styles is `static/css/devportal.css`.

## Prerequisites

To edit or modify these styles, you need to install Bootstrap's SCSS files. The included `package.json` file should help you do this using [Yarn](https://yarnpkg.com/) or [NPM](https://www.npmjs.com/). For example, if you have Yarn installed, run the following command from this directory:

```sh
$ yarn
```

You also need a SASS/SCSS compiler; the dependency file should install [node-sass](https://www.npmjs.com/package/sass) and a script for running it by default. You can also use [`sassc`](https://github.com/sass/sassc/), which can be installed using your system's package manager (Linux) or Homebrew (macOS).

## Building

To build the output file using node-sass, run the following command from this directory:

```sh
$ yarn run build-css
```

(You could also use `npm` instead of `yarn`.)

To build the output file using sassc, run the following command from this directory:

```sh
$ sassc xrpl.scss -t compressed -m > ../static/css/devportal.css
```

You can omit the `-m` (include source map) to reduce the output file size. It provides useful information when debugging styles, about which original file specific rules came from.

## Files

`xrpl.scss` is the master file that includes all the other, `_`-prefixed SCSS files. This file also defines common colors and other utilities.
