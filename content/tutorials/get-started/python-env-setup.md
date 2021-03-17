---
html: set-up-python-env.html
funnel: Build
doc_type: Tutorials
category: Get Started
subcategory: Get Started Using Python
#parent: get-started-python.html - field not used by the site yet
blurb: Set up your environment to start Python development.
cta_text: Build Apps
---

## Python Environment Setup

Complete the steps in the following sections to prepare your environment for development. 

Here are the pre-requisites for `xrpl-py`:

* [Python 3.7](https://www.python.org/downloads/) or later 
* [`pyenv`](https://github.com/pyenv/pyenv)
* [`poetry`](https://python-poetry.org/docs/)
* [`pre-commit`](https://pre-commit.com/)

### Install the library

You can get `xrpl-py` through these methods:

* Clone the repo:

        git clone git@github.com:xpring-eng/xrpl-py.git

* Install with `pip`:

        pip3 install xrpl-py

* Download from [Python Package Index (PyPI)](https://pypi.org/) 

### Set up Python environment

To make it easy to manage your Python environment with `xrpl-py`, including switching between versions, install `pyenv` and follow these steps:

* Install [`pyenv`](https://github.com/pyenv/pyenv):

        brew install pyenv
    
    For other installation options, see the [`pyenv` README](https://github.com/pyenv/pyenv#installation).

* Use `pyenv` to install the optimized version for `xrpl-py` (currently 3.9.1):

        pyenv install 3.9.1

* Set the [global](https://github.com/pyenv/pyenv/blob/master/COMMANDS.md#pyenv-global) version of Python with `pyenv`:

        pyenv global 3.9.1

### Set up shell environment

To enable autcompletion and other functionality from your shell, add `pyenv` to your environment. 

These steps assume that you're using a [Zsh](http://zsh.sourceforge.net/) shell. For other shells, see the [`pyenv` README](https://github.com/pyenv/pyenv#basic-github-checkout).


* Add `pyenv init` to your Zsh shell:

        echo -e 'if command -v pyenv 1>/dev/null 2>&1; then\n  eval "$(pyenv init -)"\nfi' >> ~/.zshrc
        
* Source or restart your terminal:

        . ~/.zshrc

### Manage dependencies and virutal environment

To simplify managing library dependencies and the virtual environment, `xrpl-py` uses [`poetry`](https://python-poetry.org/docs).

* [Install `poetry`](https://python-poetry.org/docs/#osx-linux-bashonwindows-install-instructions):

        curl -sSL https://raw.githubusercontent.com/python-poetry/poetry/master/get-poetry.py | python -
        poetry install

### Set up `pre-commit` hooks

To run linting and other checks, `xrpl-py` uses [`pre-commit`](https://pre-commit.com/). 

**Note:** You only need to install `pre-commit` if you want to contribute code to `xrpl-py` or generate the reference documentation locally.
  

* Install `pre-commit`:

        pip3 install pre-commit
        pre-commit install

### Generate reference docs

You can see the SDK reference docs at <<<TODO: add location>>>. You can also generate them locally using `poetry` and `sphinx`:

```bash
# Go to the docs/ folder
cd docs/

# Build the docs
poetry run sphinx-apidoc -o source/ ../xrpl
poetry run make html
```

To see the output:

```bash
# Go to docs/_build/html/
cd docs/_build/html/

# Open the index file to view it in a browser:
open docs/_build/html/index.html
```

## Next Steps

Start building apps! See [](xref:get-started-with-python-sdk.md) for a tutorial that explains how to get started with `xrpl-py`. 