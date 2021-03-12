---
html: get-started-python.html
funnel: Build
doc_type: Tutorials
category: Get Started
blurb: Build a simple Python app that interacts with the XRP Ledger.
cta_text: Build Apps
---

# Get Started with Python and the XRP Ledger

This tutorial walks you through the basics of building an XRP Ledger-connected application using [xrpl-py](https://github.com/xpring-eng/xrpl-py), a [Python](https://www.python.org) library that makes it easy to integrate XRP Ledger functionality into your apps.  


## Learning Goals

In this tutorial, you'll learn: 

* How to set up your environment for Python development. 
* The basic building blocks of XRP Ledger-based applications.
* How to generate keys.
* How to connect to the XRP Ledger.
* How to submit a transaction, including preparing and signing it. 
* How to put these steps together to create a simple app that submits a transaction to the XRP Ledger Testnet. 

## Environment Setup

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

## Start building

When you're working with the XRP Ledger, there are a few things you'll need to manage with your app or integration, whether you're adding XRP into your [wallet](xref: wallets.md), integrating with the [decentralized exchange](xref: decentralized-exchange.md), or [issuing and managing tokens](xref:issued-currencies.md). This tutorial walks you through the patterns common to all of these use cases and provides sample code for implementing them. 

Here are the basic steps you'll need to cover for almost any XRP Ledger project:

1. [Generate keys.](#generate-keys)
2. [Connect to the XRP Ledger.](#connect)
3. [Query the XRP Ledger.](#query)
4. [Submit a transaction.](#submit-transaction) 
5. [Verify results.](#verify-results) 

### Generate keys

You need [keys](https://xrpl.org/cryptographic-keys.html) to sign transactions that you submit to the XRP Ledger. 

For testing and development purposes, you can get keys (and XRP balances) from [XRP Faucets](https://xrpl.org/xrp-testnet-faucet.html).

Otherwise, you should take care to store your keys and set up a [secure signing method](https://xrpl.org/set-up-secure-signing.html). 

<!-- MULTICODE_BLOCK_START -->

*Python (xrpl-py)*

```py
seed = keypairs.generate_seed()
public, private = keypairs.derive_keypair(seed)
```

<!-- MULTICODE_BLOCK_END -->

### Connect

To make queries that you can use in your app and submit transactions, you need to establish a connection to the XRP Ledger. There are a few ways to do this. The following sections describe each option in more detail. 

**Warning:**  Never use publicly available servers to sign transactions. For more information about security and signing, see [](xref: set-up-secure-signing.md).

If you only want to explore the XRP Ledger, you can  use the [Ledger Explorer](https://livenet.xrpl.org/) to see the Ledger progress in real-time and dig into specific accounts or transactions. 


<!-- MULTICODE_BLOCK_START -->

*Python (xrpl-py)*

```py
client = JsonRpcClient(http://s1.ripple.com:51234/)
```


<!-- MULTICODE_BLOCK_END -->

### Query

Before you submit a transaction to the XRP Ledger, you should query it to check your account status and balances to make sure that the transaction will succeed. 

<!-- MULTICODE_BLOCK_START -->

*Python (xrpl-py)*

```py
account_info = RequestMethod.ACCOUNT_INFO(rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe)
```

<!-- MULTICODE_BLOCK_END -->

### Submit transaction

When you're ready to submit a transaction, follow the steps below.

#### Prepare transaction

```python
 tx = Transaction(
            account=_ACCOUNT,
            fee=_FEE,
            sequence=_SEQUENCE,
            transaction_type=TransactionType.ACCOUNT_SET
        )
```

#### Sign transaction

### Verify results