# RippleAPI Quick Start Guide #

This tutorial guides you through the basics of building a simple Ripple-connected application using [Node.js](http://nodejs.org/) and [RippleAPI](rippleapi.html), a simple JavaScript API for accessing the Ripple Consensus Ledger.

# Environment Setup #

The first step to using RippleAPI successfully is setting up your development environment.

## Install Node.js and npm ##

RippleAPI is built as an application for the Node.js runtime environment, so the first step is getting Node.js installed. Specifically, RippleAPI requires Node.js version 0.12, version 4.x, or higher.

This step depends on your operating system. We recommend [the official instructions for installing Node.js using a package manager](https://nodejs.org/en/download/package-manager/) for your operating system. If the packages for Node.js and `npm` (Node Package Manager) are separate (this includes Arch Linux, CentOS, Fedora, and RHEL), you should make sure to install both.

After you have installed Node.js, you can check whether it's installed by checking the version of the `node` binary from a commandline:

```
node --version
```

On some platforms, the binary is named `nodejs` instead:

```
nodejs --version
```


## Use NPM to install RippleAPI and dependencies ##

RippleAPI uses the newest version of JavaScript, ECMAScript 6 (also known as ES2015). In order to use the new features of ECMAScript 6, RippleAPI depends on [Babel-Node](https://babeljs.io) and its ES2015 presets. Fortunately you can use `npm` to install RippleAPI and these dependencies all at once.

#### 1. Create a new directory for your project

For example, to create a folder called `my_ripple_experiment`:

```
mkdir my_ripple_experiment && cd my_ripple_experiment
```

Alternatively, you can [create a repo on GitHub](https://help.github.com/articles/create-a-repo/) in order to share your work. After setting it up, [clone the repo](https://help.github.com/articles/cloning-a-repository/) to your local machine and `cd` into that directory.

#### 2. Create a new `package.json` file for your project.

Here's a good template:

```
{
  "name": "my_ripple_experiment",
  "version": "0.0.1",
  "license": "UNLICENSED",
  "private": true,
  "dependencies": {
    "ripple-lib": "*",
    "babel-cli": "^6.0.0",
    "babel-preset-es2015": "*"
  },
  "babel": {
    "presets": ["es2015"]
  },
  "devDependencies": {
    "eslint": "*"
  }
}
```

This includes RippleAPI itself (`ripple-lib`), Babel (`babel-cli`), the ECMAScript 6 presets for Babel (`babel-preset-es2015`). It also has the optional add-on [ESLint](http://eslint.org/) (`eslint`) for checking your code quality.

#### 3. Use NPM to install the dependencies.

```
npm install
```

This automatically installs all the dependencies defined in the `package.json` into the local folder `node_modules/`. (We recommend _not_ using `npm -g` to install the dependencies globally.)

The install process may take a while, and may end with a few warnings. The following warnings are benign, and do not indicate a real problem:

```
npm WARN optional Skipping failed optional dependency /chokidar/fsevents:
npm WARN notsup Not compatible with your operating system or architecture: fsevents@1.0.6
npm WARN ajv@1.4.10 requires a peer of ajv-i18n@0.1.x but none was installed.
```

#### 4. (Optional) Tell Git to ignore the `node_modules` folder.

If you are using Git to manage your repository, it's considered a good practice to omit the `node_modules` folder from the Git repo. Other people who check out your code can use `npm` to install the dependencies, and you don't have to keep the repo synchronized with changes to other people's code. Edit the `.gitignore` file and add the following line to it:

```
/node_modules/
```

Save and commit the changes:

```
git add .gitignore
git commit -m "ignore node_modules"
```

# First RippleAPI Script




