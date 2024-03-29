---
date: 2014-07-02
category: 2014
labels:
    - Features
theme:
    markdown:
        editPage:
            hide: true
author: Nikolaos D. Bougalis
---
# Introducing: Offer Autobridging

Ripple’s powerful system allows payments between any source and destination currency to be made easily. Pathfinding considers multiple conversions between currencies to find the best rate for a payment.

The new **autobridging** feature improves offer placement in a similar fashion to pathfinding: when consuming existing offers, a newly placed offer will have the liquidity available in not only the direct order book (source to destination currency) but also in the corresponding books in which XRP is the destination and source respectively.

This expands the Ripple protocol’s capabilities and brings improved market depth for heavily-used asset pairs and improved liquidity for less-heavily-used asset pairs. A primer for Ripple’s autobridging implementation is [available on the Ripple Forums](https://ripple.com/forum/viewtopic.php?f=1&amp;t=7127).

## AUTOBRIDGING: Creating more efficient markets on the Ripple network

Autobridging, at its core, is about constructing a new order book, which contains in sorted order by offer quality both direct and bridged offers. Traversing such a combined book and performing order crossing would, then, be no different than traversing a direct book.

[![Autobridging diagram](https://cdn.ripple.com/wp-content/uploads/2014/07/autobridging-graphic.png)](https://cdn.ripple.com/wp-content/uploads/2014/07/autobridging-graphic.png)

Although conceptually simple ("figure out the offers, sort them best to worst and do offer crossing"), the reality is that there are a number of subtle points to keep in mind.

## SORTING: Ranking direct and autobridged offers

To sort composed bridged offers—such as (USD:XRP) and (XRP:EUR)—against direct offers—(USD:EUR)—we must calculate their respective exchange rates—what we call _quality_.

In the case of offer autobridging, quality is defined as the ratio of _out:in_ at the time that the offer was placed. This is particularly important—once an order is placed, its quality **never changes**.

In bridged offers, the input of the second leg is the output of the first leg, and quality is the ratio _out:in_. Thus the resulting quality of a bridged offer would be _leg2-out:leg1-in_—ignoring the XRP part of the offers—that is, we calculate the quality of the (USD:EUR) bridged offer by taking the product of the two legs together.

Given respective qualities direct and bridged offers are sorted into a combined order book from best to worst.

After rank, the next key variable to consider is amount—which brings us to the concept of _flow_.

With the ability to compare direct and bridged offers by quality, we are now able to sort them into an order book from best to worst. But we still need to figure out what offers we actually have to put in that book.

In the case of a direct offer, the answer is simple: put the direct order itself into the book. But what to do in the case of a bridged offer? To answer that question, we need to calculate how much a bridged offer could accept as input and how much it could produce as output—which brings us to another new concept: _flow_.

## FLOW: Determining bridged offer combinations

_Flow_ is the pair of input and output amounts that can be produced when taking an offer. Depending on context, flow can mean either _maximal flow_ or _actual flow_.

_Maximal_ flow is the largest output that the offer can produce—it represents the amount that one could get out of the offer, given an infinite amount of the input asset.

_Actual_ flow, on the other hand, is the amount that will actually be produced when the offer is taken—it is the amount that one could get out of the offer for a given, finite input.

During the autobridging process, we need to be able to take two _maximal_ flows (the individual USD:XRP and XRP:EUR offer flows) and combine them to create a new _maximal_ flow (USD:EUR).

## COMBINING OFFERS

In order to combine two offers, we must first determine which of the two offers is the limiting factor by looking at the output of the first leg and the input of the second leg and finding the smallest of the two.

With that established, we can adjust the non-limiting order so as to make the first order's output equal to the second order's input. Any such adjustment, of course, must be done respecting the offer's quality to maintain the invariant established earlier—that an offer's rate never changes.

The primitive we use is _capping_—capping clamps an offer's input or output to by a given maximum, scaling the output or input respectively, if necessary.

When capping an offer's input, if the offer's input is greater than the cap amount, then we clamp the input so that is equal to the limit, and we scale the output down by the offer's quality.

Similarly, when capping an offer's output, if the output is greater than to the cap amount, we clamp the output so that is equal to the limit, and we scale the input down by the offer's quality.

Either way, the result of capping is a new flow. When capping is complete, the output of the first offer (in XRP) should be equal to the input of the second offer (again, in XRP). The end result is that, given two offers (USD:XRP) and (XRP:EUR), we now have a maximal (USD:EUR) flow representing the combination of those two offers bridged over XRP.

It is this maximal flow which we will then place on the book.

At this point, you are probably wondering "_what about Buy/Sell semantics?_" It turns out that to implement Buy vs. Sell all that is required is one more _cap_ operation, either on the first or the second leg depending on whether we are implementing Sell or Buy semantics respectively, performed before we calculate the _maximal_ flow. We believe that this highlights the elegance of the _flow_ and _cap_ primitives.

## CROSSING

Given both a quality and a maximal flow, we can now create an autobridged book that contains, in sorted order, both direct and bridged offers that take USD and pay EUR—which is what we wanted—and offer crossing can proceed normally.

## REARCHITECTING

As an aside, during the development of offer autobridging, we also undertook a significant rearchitecting of the offer crossing code. Although the existing code was robust and well-written, we felt that we could still improve it by leveraging what we’ve learned in the process of developing and maintaining Ripple.

The results of these ongoing efforts speak for themselves—the offer crossing code has been abstracted and can be separately unit-tested. And—when using lines of code as a metric—less code is now needed to implement offer crossing.

Smaller size and increased functionality? Winning!

Going forward, you will see process reflect more of this rearchitecting of code alongside with the development of new features. This will help us improve the code and make it easier to understand, analyze, and further develop Ripple.

If you would like to examine the code, you can view the autobridging implementation on [our GitHub repository](https://github.com/ripple/rippled/commits/develop). The relevant commits are tagged with "Autobridging" in their commit message.

We look forward to any questions that you may have.

_Contact Nik: <nikb@ripple.com>_

_Follow him on Twitter: [@nbougalis](https://twitter.com/nbougalis)_
