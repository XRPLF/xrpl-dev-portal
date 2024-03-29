---
labels:
    - Features
category: 2019
date: 2019-07-12
author: Rome Reginelli
---
# Labeling the Internet of Value

Blockchain technology raises new questions about the roles of privacy and anonymity in the function of money. While all transactions are a matter of public record, the parties involved in the transactions are represented by pseudonyms, and information about who those parties are may be hard to come by. Even more obscure is information about those whose computing power and maintenance efforts underpin the blockchain. While there are lots of good reasons to maintain privacy around some entities and events, there are also situations that call for publicly establishing one's identity and reputation. The [`xrp-ledger.toml` specification](/docs/references/xrp-ledger-toml/) provides a flexible standard for voluntarily publishing information about who you are and what you're doing with the XRP Ledger.

In this post, I explore the process of creating an `xrp-ledger.toml` file, explain why to use it, and introduce [a new dev tool for checking `xrp-ledger.toml` files](/resources/dev-tools/xrp-ledger-toml-checker/).

<!-- BREAK -->


## Why Identify Yourself?

You may wonder, why share any information publicly at all? Certainly, in a network filled with malicious actors, voluntarily publishing your identity could attract unwanted attention. For the same reason, voluntarily presenting a face to the public can be an act of strength and goodwill. It sets the boundaries and expectations, effectively saying, "This is what I want you to know about me."

This kind of thing forms the basis of _trusted_ interactions, because _trustless_ interactions with fellow humans are difficult, adversarial, and fraught. A truly trustless world is fundamentally _uncivilized_: a state of nature where might makes right. I've always thought a fascinating insight at the core of the XRP Ledger's design is that a little bit of trust goes a long way. The XRP Ledger's validation mechanism works because participants mutually agree to behave honestly in order to share the benefits of a global ledger, and the system makes it straightforward to verify that, yes, most participants really do behave honestly. By similar logic, technologies and social structures built on top of the XRP Ledger work better when you can verify that people are who they say they are.

In my case, I'm a Ripple employee who interacts with the XRP community on a regular basis. Among other responsibilities, that means that what I say and do might have an outsized effect on how others view XRP. I want to claim responsibility for my own XRP holdings so that people can see for themselves that I follow my own advice: I own a relatively small amount of XRP directly, and I largely hold it for the long term or use it for testing and experiments. I also have some other motivations for listing my accounts: for a while, an example transaction in the dev portal showed setting the `Domain` field of an account to my personal domain, [mduo13.com](https://mduo13.com/), and people who copied the example did not always change the domain, so there are strange accounts out there with my domain on them. By explicitly claiming the accounts that _are_ mine, I can disclaim ownership of the ones that aren't.

If you run a validator, that's a great reason to publish an `xrp-ledger.toml` file, too. Right now, [domain verification](/docs/infrastructure/configuration/server-modes/run-rippled-as-a-validator/#6-provide-domain-verification) isn't a fully open, self-service process (an entity like Ripple has to collect and verify the signatures). Following the release of `rippled` 1.3.0, it should become possible for third parties to independently verify that a validator is associated with a particular domain name. Part of that process comes from using the [new domain field of a validator manifest](https://github.com/ripple/rippled/pull/2879/commits/88cb0e5928510d684a894ddf8a4ccc379c09d8fe) and the other part comes from the [`[[VALIDATORS]]` list in the `xrp-ledger.toml` file](/docs/references/xrp-ledger-toml#validators).


## Creating the File

The first step of creating the file is deciding what contents to provide. I decided to provide a little bit of metadata, some information about myself, the accounts I own, and the validator I operate.

You can see the complete result at <https://mduo13.com/.well-known/xrp-ledger.toml>.

### Metadata

In the `[METADATA]` block, I decided to provide a `modified` field to indicate when I last updated the file, because I expect that I might not update this file often, so others who see it may be able to guess if it's outdated. To get the current time in ISO 8601 format, I opened up my web browser's JavaScript console and typed `(new Date()).toISOString()`. I could have typed the date by hand, but I didn't want to try and figure out the current hour in UTC, so this was easy.

I chose not to provide an `expires` field because I don't want to force myself to update the document just to update the expiration, and I don't have any specific use case that would require others to get a fresh copy of my information.

I did add a few comments to the top of the document to explain my unique situation.

```toml
# mDuo13.com xrp-ledger.toml file
# I am a Ripple employee. I run a validator on my home PC for experimentation.
# For help understanding this file, see:
#   https://xrpl.org/xrp-ledger-toml.html

[METADATA]
modified = 2019-07-12T23:44:52.761Z

# Q: Why do so many XRP Ledger addresses have "mduo13.com" as their domain?
#
# A: For a long time, the example "AccountSet" transaction in Ripple's
#    documentation was a real transaction, me setting my own domain. Many
#    users have copied the example and sent it without changing the "Domain"
#    field. I don't have any control over those accounts.
```

### Principals

I provided one `[[PRINCIPALS]]` entry, describing myself. I was a bit hesitant about including an email because I don't want to attract too much spam, but spam filtering has gotten better lately so I decided it was worth it in case someone wanted to contact me legitimately about something interesting.

I decided I'd also like to provide a social media address of some kind. As a fan of decentralized networks, of course I listed my [Mastodon](https://joinmastodon.org/) account. This isn't a field that's defined by the standard, but the open-ended `xrp-ledger.toml` file standard lets you make up your own fields, so I picked a field name and format that seemed fairly informative and went with that.

The Principals section:

```toml
[[PRINCIPALS]]
name = "Rome Reginelli"
email = "rome@mduo13.com"
mastodon = "@mDuo13@icosahedron.website"
```

### Validators

I have a `rippled` server that runs on my home computer. I don't keep this server online all the time, but it is configured to operate as a validator when it runs. I provided information on this server mostly as an example of how to provide validator information. Since I only run the one validator, I only have one `[[VALIDATORS]]` stanza.

The master `public_key` is the most important part; I had it saved from when I initially set up my validator's keys. I added a description just in case someone sees my validator in a list so they can understand that it's not intended to be stable. It runs on my home PC in the United States, so I used the United States' [ISO-3166-2](https://en.wikipedia.org/wiki/ISO_3166-2) code for both country fields. (The spec doesn't say whether it should be uppercase or lowercase, but I'm lazy with my shift key so I left it lowercase.)

And since my validator follows Ripple's recommended UNL, I listed the URL of that in the `unl` field. Providing this information helps people analyze the topology of the validation network to find risks and improve decentralization.

The validators section:

```toml
[[VALIDATORS]]
public_key = "n9KM73uq5BM3Fc6cxG3k5TruvbLc8Ffq17JZBmWC4uP4csL4rFST"
desc = "My dogfood rippled machine. Not a reliable validator."
network = "main"
owner_country = "us"
server_country = "us"
unl = "https://vl.ripple.com"
```

### Accounts

Finally, the list of accounts. I added an `[[ACCOUNTS]]` entry for each of the XRP Ledger addresses whose keys I have saved. As a result of doing various tests and experiments, I have a few more accounts than a normal person needs, and I honestly don't even remember what some of these were for. I added a description `desc` field to the accounts where I remembered their purpose, most importantly for the "primary" address where I want to receive XRP if, for example, people want to send me tips. I also tagged that one explicitly as being on the main network just to be sure. (Some of my addresses are in use on both the test net and the production network; that's not a good practice to follow, but I'm stuck with it.)

**Tip:** I love sending XRP tips to people who contribute to the XRP Ledger Dev Portal. If you open a PR to the dev portal, make your XRP Ledger address known and I might just send some XRP your way! You could even just provide your domain if you serve an `xrp-ledger.toml` file with your preferred address there.

My accounts list:

```toml
[[ACCOUNTS]]
address = "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX"
network = "main"
desc = "Primary address (send XRP here if you want to tip or pay me)"

[[ACCOUNTS]]
address = "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn"
desc = "Testing address (appears in many documentation examples)"

[[ACCOUNTS]]
address = "r9gyzAVmAtgP8kUYvDaraS65UzWhqSr1Ee"

[[ACCOUNTS]]
address = "rsA2LpzuawewSBQXkiju3YQTMzW13pAAdW"

[[ACCOUNTS]]
address = "rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH"

[[ACCOUNTS]]
address = "raKEEVSGnKSD9Zyvxu4z6Pqpm4ABH8FS6n"

[[ACCOUNTS]]
address = "rUpy3eEg8rqjqfUoLeBnZkscbKbFsKXC3v"

[[ACCOUNTS]]
address = "rEuLyBCvcw4CFmzv8RepSiAoNgF8tTGJQC"
```


## Serving the File

With the contents decided, I had to serve the file from my domain. I already have a working HTTPS configuration using [Let's Encrypt](https://letsencrypt.org/), and my top level site is a (rather old) PHP blog, so I could just create a `.well-known/` folder on the web server and transfer the file over.

That left [CORS Setup](/docs/references/xrp-ledger-toml#cors-setup) as the only remaining step. Since I'm using a shared webhost, I don't have access to the server-level config file, but I do have permission to add `.htaccess` files. I don't want my entire site (or even the entire `.well-known` folder) to be available for cross-origin requests, so I was able to add a specific rule for just the `xrp-ledger.toml` file using an `.htaccess` file with a `<Files>` stanza:

```apache
AddType application/toml .toml
<Files "xrp-ledger.toml">
    Header set Access-Control-Allow-Origin "*"
</Files>
```

I also added a general purpose rule to serve files ending in the `.toml` extension using the content type "application/toml", which is the recommended MIME type for TOML files. This isn't a requirement for serving the file successfully, but it does stop Firefox from reporting an XML parsing error.

I copied that same file to the `.well-known/` folder on my webserver. A quick test confirmed that I was able to fetch the contents with an AJAX call, so I knew CORS was set up correctly, but I wasn't sure that my file's contents were formatted just right... so I created a tool to handle that automatically.


## New Checker

The [`xrp-ledger.toml` Checker](/resources/dev-tools/xrp-ledger-toml-checker/) is a new web tool that fetches a domain's `xrp-ledger.toml` file, parses it, and displays the contents of the standard fields found within. You can test it on your own domain when you set up your `xrp-ledger.toml` file. To see it in action, you can also enter my domain, `mduo13.com`, in the text box.

The tool is not all-seeing when things go wrong; the browser, by design, does not make it easy for a script to know the difference between a cross-origin request that was blocked and a request that simply failed because it couldn't connect to the domain. Your browser's developer tools (accessible by pressing F12 in Chrome or Firefox on desktop) may provide more information about any failures.


## Afterword

A few things the  [`xrp-ledger.toml` Checker](/resources/dev-tools/xrp-ledger-toml-checker/) didn't pick up are no surprise:

- Not all of my own addresses have the `Domain` field set. I could send [AccountSet transactions](/docs/references/protocol/transactions/types/accountset/) for each of them to configure it, but I rarely use most of those addresses anyway, so I didn't bother.
- Since the checker only displays well-defined standard fields, my Mastodon contact information doesn't show up in the output. That's fine. Maybe if a client application catches on it can add support for displaying various modes of contact.

In all, the process of setting up an `xrp-ledger.toml` file was more straightforward than I had expected. The syntax is a little more verbose than its predecessor, `ripple.txt`, but it's also great to have an explicit standard, so tools like the checker can pull in a ready-made library and provide an unambiguous reading of the file. It probably would have been more complex if I also had to set up HTTPS for the first time, but fortunately that was a problem I already had solved because it's a good thing to provide regardless.

I look forward to exploring the other half of the Domain Verification process after `rippled` v1.3.0 is out.
