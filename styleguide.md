# Ripple Documentation Style Guide #

## Ripple Terms ##

* APIs - Not "API's" or "apis"
* client - A user-facing program that interacts with a server program through an API. Ripple Trade is a client to rippled. Do not refer to a person as a client.
* gateway - A business or entity that links the Ripple Network to the rest of the world.
* IOUs - Use *issuances* instead.
* issuances - Any non-XRP "currency" (including non-currency stores of value) in the global ledger. Always has a currency code and an issuer.
    * issuing gateway - The "typical" case, where the gateway issues currency in the Ripple Network. Other cases include merchants and private exchanges.
* ledger - Try to be more specific:
    * global ledger - Use the word "global" to indicate the shared overall ledger state
    * ledger version - A single revision in rippled's ledger history, with a sequence number.
* market makers - Two words, not capitalized.
* order / offer - An instruction to exchange currency which can be executed by some automated system. Use "order" unless describing software such as rippled that uses the term "offer" instead.
* Ripple - Avoid using this as a noun where you could be more specific:
    * rippled - The core peer-to-peer server software. Always all lowercase: not "Rippled". One word, no dash or space.
    * Ripple Labs - the company
    * Ripple Trade - A client application that provides access to the Ripple Network
    * the Ripple Network - any software that is involved in reading or modifying the global Ripple ledger. "Ripple Network" in title case.
    * the shared global ledger - Also see _ledger_.
* ripple-lib - The JavaScript client for rippled. Always lower case and hyphenated.
* Ripple-REST - Not "ripple-rest"
* trust line - A link between two accounts with a balance, limit, and some metadata. Two words, not capitalized. When possible, maintain the abstraction that two mutual trust lines are separate entities.
* wallet - Avoid using this overloaded term by itself. Use "client application" or "client" instead to refer to wallet software. Use "account" to refer to a Ripple account. The following terms are acceptable:
    * cold wallet - Synonymous with "issuing account" in the traditional gateway model. The Ripple account that creates the issuances, to which users extend their trust lines. Not capitalized.
    * hot wallet - A Ripple account used for day-to-day operations, usually automated. Not capitalized.
    * warm wallet - A Ripple account used as a human-operated intermediate step between cold and hot wallets. Not capitalized.
* WebSocket - Not "Websockets" or "Web Socket"
* XRP - Not "ripples" (old usage)

# Writing Guidelines #

For any style guidelines not specified here, refer to the Microsoft Manual of Style.

* Always put code samples in fixed-width font (code blocks). When referring to specific elements or fields from a code sample, use a fixed-width font, and use the exact capitalization used in the code sample. 
* Use hyperlinks liberally. When referring to external standards, always link to an official source. When using field-specific terms or jargon, make the first instance a hyperlink to a relevant definition (for example, on Wikipedia).
* When describing multiple possibilities, use bullets or a table. Use parallel structure in tables and bulleted lists.
* When using images, always provide a description of the image as alt text, in the body text surrounding the image, or both.
* Make examples as inclusive as possible. When describing people, use more than one gendered pronoun, or use the plural so their genders are not specified. Use many different example currencies. 
* Avoid mentioning Bitcoin or other cryptocurrencies when a non-cryptocurrency example would be equally valuable.

# Types of Documentation #

Try to divide documentation by topic types: Concepts, Tasks, and References. Large documents may have individual sub-sections that are separated implicitly into each category. Documentation of different types should be interlinked but usually not interspersed. 

*Concept* documentation explains how and why something works. It provides an overview of why a feature or product exists (what problem does it solve?), and how it solves that problem (but not too in-depth). It provides some ideas of what you might do with the technology, but not exactly how you do it. (That information is provided by Tasks.) It frequently includes diagrams and illustrations to help users grasp difficult concepts. Most knowledge center articles will probably be Concept documents.

*Task* documents are "how-to" guides: step-by-step processes for how to accomplish a specific goal, including all the details necessary to do so, and examples of each action taken, so that a reader may follow along. They may or may not take branching paths, or connect to additional Tasks. They link to relevant Concept information so that a person following the task understands what they are doing, and relevant Reference information, so that a person can look up possible variations to fit their situation.

*Reference* documents are the nitty-gritty details. They are full of lists and tables, defining every function, object, API route, parameter, and possible response. They link to relevant Concept documentation that explains why the less obvious features exist. Occasionally they link to Tasks that step through common uses of information. When describing an API, the documentation should generally describe only the aspects of the API that interact with the user, not implementation details. (Occasionally, it may be useful to explain limitations or performance characteristics in terms of the implementation.)

# GitHub READMEs #

The top-level README.md file for an open-source product should contain the following:

* An introduction that explains the problem the project solves and how (briefly).
* A brief overview of the architecture and software dependencies of the project.
* A link to a publicly-available version, if there is one.
* Instructions for installing and running the software.
* A complete reference, or link to one, for any APIs the software provides.
