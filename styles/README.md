# XRPL Styles

This folder contains the source files for the XRP Ledger Dev Portal CSS. The combined, minified version of these styles is `/static/css/devportal-2024-v1.css` (or some other version number).

## Prerequisites

The prerequisites for these styles, including Bootstrap, should automatically be installed by [NPM](https://www.npmjs.com/) along with the rest of the project's dependencies if you run `npm i` from the repo top.

## Building

To build the output file using node-sass, run the following command from the repo top:

```sh
npm run build-css
```

## Files

`xrpl.scss` is the master file that includes all the other, `_`-prefixed SCSS files. This file also defines common colors and other utilities.
