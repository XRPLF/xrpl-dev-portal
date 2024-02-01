---
html: tutorial-guidelines.html
parent: contribute-documentation.html
seo:
    description: Learn how this site's tutorials are structured and guidelines for contributing quality tutorials.
---
# Tutorial Guidelines

We are creating a modular tutorial framework that allows developers to learn how transactions and requests work on the XRP Ledger. Developers can review the modules to learn about business solutions, and potentially repurpose the scripts in their own applications.


# Rationale

What a developer wants comes down to two things:

1. Sample code snippets they can copy and paste into their own applications.
2. Complete API reference documentation.

Keep the conceptual information to a minimum – only the information necessary to complete the tutorial. For background or deeper understanding, provide links to the conceptual topics at the end of the tutorial, if needed.

Modular tutorials follow Malcolm Knowles’ six assumptions for designing adult learning:

1. Adults need to know why they need to learn something.
2. Adults need to build on their experience.
3. Adults have a need to feel responsible for their learning.
4. Adults are ready to learn if training solves an immediate problem.
5. Adults want their training to be problem focused.
6. Adults learn best when motivation comes intrinsically.

Add into that Ralph Smedley’s quote, “We learn best in moments of enjoyment.” Taking a lighter touch helps to relax the learner so that the material flows into their brain with less resistance.


# Sample Code vs. Tasks vs. Concepts vs. Tutorials

To date, there have been some blurred lines where different types of documentation show up as _Tutorials_. Here are some comparisons that help define the distinction.


## Sample Code

Sample code is well commented snippets or applications that illustrate best practices for implementing a feature of the API. Sample code is modular and reusable with little customization required.

Sample code is desirable, because advanced users can typically scan the example and use it immediately without a formal tutorial. It can also be used by others as a basis for tutorials. Sample code developers can focus on what they do well, while technical writers and support personnel can use the samples to create quality training materials.


## Tasks

Tasks are step-by-step instructions for how to accomplish a specific result. For example, “Installing rippled on a Red Hat Linux Server.” Task documentation is not intended to be particularly educational. It frequently describes tasks that are only performed one time per implementation, or maintenance tasks that always follow a familiar pattern. Tasks provide troubleshooting guidance, since there are likely variables that the user must adjust based on the specifics of their use case.


## Concepts

Conceptual information describes elements of the API, how they work, and when to use them. If a tutorial requires lengthy explanations before or during the programming tasks, consider how you might separate the exposition into a new topic, or link to existing topics that set the proper context.

For example, three paragraphs of context and a single line of code would be a concept, not a tutorial.


## Tutorials

Tutorials begin with sample code that illustrates best practices for implementing a feature. They take the developer step-by-step through the development process, explaining the purpose of each block of code.

Tutorials further combine a number of features to work together to solve a business problem. They describe the straightforward sunny day path to complete a task. Then, the tutorial might suggest modifications that let the developer try several different scenarios. Due to their focus on a certain limited scope of behavior, tutorials should not require extensive troubleshooting information.


## Use Cases

Use cases describe how to pull together multiple features to create a practical application that solves a business problem. They provide context and assistance with the decision making process, then provide links to the appropriate topics for each step of implementation.


# Tutorial Components

This section describes the elements of the modular tutorials used on XRPL.org.


## Sample Application

XRPL tutorial code samples are modular in nature. For example, Script 1 demonstrates how to create a test account, access the XRP Ledger, and transfer XRP between accounts. Any further samples can reuse the functions in Script 1.

Create a new script with the specific, minimal function code required to demonstrate the practical solution to a business problem. The examples should be incremental, with just enough behaviors to illustrate a business process.

For example, the first NFT tutorial shows how to mint, retrieve, and burn an NFT. The next tutorial shows how to create and accept a sell offer, and create and accept a buy offer.

Don’t focus too much on the UX of the application, unless the look and feel is pertinent to the topic. Use the standard CSS file with the look and feel for all of the tutorials.

Reuse the code from other modules when possible. There might be situations where you need to modify the behavior from an earlier module. You can either overload the function name or modify the module and save it with a different name.
