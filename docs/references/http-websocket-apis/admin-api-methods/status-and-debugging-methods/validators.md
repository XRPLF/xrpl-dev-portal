---
html: validators.html
parent: status-and-debugging-methods.html
seo:
    description: Get information about the current validators.
labels:
  - Core Server
  - Blockchain
---
# validators
[[Source]](https://github.com/XRPLF/rippled/blob/master/src/ripple/rpc/handlers/Validators.cpp "Source")

The `validators` command returns human readable information about the current list of published and [trusted validators](../../../../concepts/consensus-protocol/index.md#trust-based-validation) used by the server.

*The `validators` method is an [admin method](../index.md) that cannot be run by unprivileged users!*

### Request Format
An example of the request format:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "id": "validators_example",
  "command": "validators"
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
{
    "method": "validators",
    "params": [
        {}
    ]
}
```
{% /tab %}

{% tab label="Commandline" %}
```sh
#Syntax: validators
rippled validators
```
{% /tab %}

{% /tabs %}

The request includes no parameters.

### Response Format

An example of a successful response:

{% tabs %}

{% tab label="WebSocket" %}
```json
{
  "id": "validators_example",
  "result": {
    "local_static_keys": [],
    "publisher_lists": [
      {
        "available": true,
        "expiration": "2022-Jun-01 00:00:00.000000000 UTC",
        "list": [
          "nHBdXSF6YHAHSZUk7rvox6jwbvvyqBnsWGcewBtq8x1XuH6KXKXr",
          "nHBgiH2aih5JoaL3wbiiqSQfhrC21vJjxXoCoD2fuqcNbriXsfLm",
          "nHB8QMKGt9VB4Vg71VszjBVQnDW3v3QudM4DwFaJfy96bj4Pv9fA",
          "nHBidG3pZK11zQD6kpNDoAhDxH6WLGui6ZxSbUx7LSqLHsgzMPec",
          "nHBtDzdRDykxiuv7uSMPTcGexNm879RUUz5GW4h1qgjbtyvWZ1LE",
          "nHUryiyDqEtyWVtFG24AAhaYjMf9FRLietbGzviF3piJsMm9qyDR",
          "nHUpJSKQTZdB1TDkbCREMuf8vEqFkk84BcvZDhsQsDufFDQVajam",
          "nHUpcmNsxAw47yt2ADDoNoQrzLyTJPgnyq16u6Qx2kRPA17oUNHz",
          "nHUnhRJK3csknycNK5SXRFi8jvDp3sKoWvS9wKWLq1ATBBGgPBjp",
          "nHU95JxeaHJoSdpE7R49Mxp4611Yk5yL9SGEc12UDJLr4oEUN4NT",
          "nHUUrjuEMtvzzTsiW2xKinUt7Jd83QFqYgfy3Feb7Hq1EJyoxoSz",
          "nHUED59jjpQ5QbNhesXMhqii9gA8UfbBmv3i5StgyxG98qjsT4yn",
          "nHULqGBkJtWeNFjhTzYeAsHA3qKKS7HoBh8CV3BAGTGMZuepEhWC",
          "nHUT6Xa588zawXVdP2xyYXc87LQFm8uV38CxsVzq2RoQJP8LXpJF",
          "nHUVPzAmAmQ2QSc4oE1iLfsGi17qN2ado8PhxvgEkou76FLxAz7C",
          "nHUXeusfwk61c4xJPneb9Lgy7Ga6DVaVLEyB29ftUdt9k2KxD6Hw",
          "nHUY14bKLLm72ukzo2t6AVnQiu4bCd1jkimwWyJk3txvLeGhvro5",
          "nHU2Y1mLGDvTbc2dpvpkQ16qdeTKv2aJwGJHFySSB9U3jkTmj4CA",
          "nHU2k8Po4dgygiQUG8wAADMk9RqkrActeKwsaC9MdtJ9KBvcpVji",
          "nHUbgDd63HiuP68VRWazKwZRzS61N37K3NbfQaZLhSQ24LGGmjtn",
          "nHUcNC5ni7XjVYfCMe38Rm3KQaq27jw7wJpcUYdo4miWwpNePRTw",
          "nHUcQnmEbCNq4uhntFudzfrZV8P5WLoBrR5h3R9jAd621Aaz1pSy",
          "nHUdjQgg33FRu88GQDtzLWRw95xKnBurUZcqPpe3qC9XVeBNrHeJ",
          "nHUd8g4DWm6HgjGTjKKSfYiRyf8qCvEN1PXR7YDJ5QTFyAnZHkbW",
          "nHUon2tpyJEHHYGmxqeGu37cvPYHzrMtUNQFVdCgGNvEkjmCpTqK",
          "nHUFE9prPXPrHcG3SkwP1UzAQbSphqyQkQK9ATXLZsfkezhhda3p",
          "nHUFCyRCrUjvtZmKiLeF8ReopzKuUoKeDeXo3wEUBVSaawzcSBpW",
          "nHUq9tJvSyoXQKhRytuWeydpPjvTz3M9GfUpEqfsg9xsewM7KkkK",
          "nHUtmbn4ALrdU6U8pmd8AMt4qKTdZTbYJ3u1LHyAzXga3Zuopv5Y",
          "nHUvcCcmoH1FJMMC6NtF9KKA4LpCWhjsxk2reCQidsp5AHQ7QY9H",
          "nHUvzia57LRXr9zqnYpyFUFeKvis2tqn4DkXBVGSppt5M4nNq43C",
          "nHDwHQGjKTz6R6pFigSSrNBrhNYyUGFPHA75HiTccTCQzuu9d7Za",
          "nHDB2PAPYqF86j9j3c6w1F1ZqwvQfiWcFShZ9Pokg9q4ohNDSkAz",
          "nHDH7bQJpVfDhVSqdui3Z8GPvKEBQpo6AKHcnXe21zoD4nABA6xj"
        ],
        "pubkey_publisher": "ED2677ABFFD1B33AC6FBC3062B71F1E8397C1505E1C42C64D11AD1B28FF73F4734",
        "seq": 70,
        "uri": "https://vl.ripple.com",
        "version": 1
      }
    ],
    "signing_keys": {
      "nHB8QMKGt9VB4Vg71VszjBVQnDW3v3QudM4DwFaJfy96bj4Pv9fA": "n9KeTQ3UyMtaJJD78vT7QiGRMv1GcWHEnhNbwKfdbW2HfRqtvUUt",
      "nHBdXSF6YHAHSZUk7rvox6jwbvvyqBnsWGcewBtq8x1XuH6KXKXr": "n9MfeCuZK2ra5eJtFDtuCTnvxfsi85k4J3GXJ1TvRVr2o4EQeHMF",
      "nHBgiH2aih5JoaL3wbiiqSQfhrC21vJjxXoCoD2fuqcNbriXsfLm": "n9KhsMP6jKFQPpjJ9VwqyZSwrL4shdX9YknRwmsAVL1RNVrx4jLm",
      "nHBidG3pZK11zQD6kpNDoAhDxH6WLGui6ZxSbUx7LSqLHsgzMPec": "n9KaxgJv69FucW5kkiaMhCqS6sAR1wUVxpZaZmLGVXxAcAse9YhR",
      "nHBk5DPexBjinXV8qHn7SEKzoxh2W92FxSbNTPgGtQYBzEF4msn9": "n9KnrcCmL5psyKtk2KWP6jy14Hj4EXuZDg7XMdQJ9cSDoFSp53hu",
      "nHBtDzdRDykxiuv7uSMPTcGexNm879RUUz5GW4h1qgjbtyvWZ1LE": "n9LCf7NtwcyXVc5fYB6UVByRoQZqJDhrMUoKnr3GQB6mFqpcmMzg",
      "nHDB2PAPYqF86j9j3c6w1F1ZqwvQfiWcFShZ9Pokg9q4ohNDSkAz": "n9Jk38y9XCznqiLq53UjREJQbZWnz4Pvmph55GP5ofUPg3RG8eVr",
      "nHDH7bQJpVfDhVSqdui3Z8GPvKEBQpo6AKHcnXe21zoD4nABA6xj": "n9MSTcx1fmfyKpaDTtpXucugcqM7yxpaggmwRxcyA3Nr4pE1pN3x",
      "nHDwHQGjKTz6R6pFigSSrNBrhNYyUGFPHA75HiTccTCQzuu9d7Za": "n9Kb81J9kqGgYkrNDRSPT3UCgz8Bei1CPHGMt85yxz9mUSvuzV5k",
      "nHU2Y1mLGDvTbc2dpvpkQ16qdeTKv2aJwGJHFySSB9U3jkTmj4CA": "n9K2FpCqZftM1xXXaWXFPVbEimLX6MEjrmQywfSutkdK1PRvqDb2",
      "nHU2k8Po4dgygiQUG8wAADMk9RqkrActeKwsaC9MdtJ9KBvcpVji": "n9MhLZsK7Av6ny2gV5SAGLDsnFXE9p85aYR8diD8xvuvuucqad85",
      "nHU95JxeaHJoSdpE7R49Mxp4611Yk5yL9SGEc12UDJLr4oEUN4NT": "n9JtY9MqUcwKWenHp8WoRobFRmB2mmBEJd1ruJmhKGKAwtFQkQjb",
      "nHUED59jjpQ5QbNhesXMhqii9gA8UfbBmv3i5StgyxG98qjsT4yn": "n9Km4Xz53K9kcTaVn3mYAHsXqNuAo7A2HazSr34SFufvNwBxYGLn",
      "nHUFCyRCrUjvtZmKiLeF8ReopzKuUoKeDeXo3wEUBVSaawzcSBpW": "n9Lqr4YZxk7WYRDTBZjjmoAraikLCjAgAswaPaZ6LaGW6Q4Y2eoo",
      "nHUFE9prPXPrHcG3SkwP1UzAQbSphqyQkQK9ATXLZsfkezhhda3p": "n9LMfcjE6dMyshCqiftLFXpB9K3Mnd2r5bG7K8osmrkFpHUoR3c1",
      "nHULqGBkJtWeNFjhTzYeAsHA3qKKS7HoBh8CV3BAGTGMZuepEhWC": "n9MZ7EVGKypqdyNguP31xSqhFqDBF4V5FESLMmLiGrBJ3khP2AzQ",
      "nHUT6Xa588zawXVdP2xyYXc87LQFm8uV38CxsVzq2RoQJP8LXpJF": "n9Lq9bekeVhCsW8dwqzfvKsqUiu9Qxvwk9YmF2hxkBJjNrGNL5Fw",
      "nHUUrjuEMtvzzTsiW2xKinUt7Jd83QFqYgfy3Feb7Hq1EJyoxoSz": "n9LLqqH1cVFPjEnQYFQ6DooxuhHPQxwXgMjDGrpJ6pb1WGDoi76Q",
      "nHUVPzAmAmQ2QSc4oE1iLfsGi17qN2ado8PhxvgEkou76FLxAz7C": "n9J1GJHtua77TBEzir3FvsgWX68xBFeC8os3s5TkCg97E1cwxKfH",
      "nHUXeusfwk61c4xJPneb9Lgy7Ga6DVaVLEyB29ftUdt9k2KxD6Hw": "n9McDrz9tPujrQK3vMXJXzuEJv1B8UG3opfZEsFA8t6QxdZh1H6m",
      "nHUY14bKLLm72ukzo2t6AVnQiu4bCd1jkimwWyJk3txvLeGhvro5": "n9M2UqXLK25h9YEQTskmCXbWPGhQmB1pFVqeXia38UwLaL838VbG",
      "nHUbgDd63HiuP68VRWazKwZRzS61N37K3NbfQaZLhSQ24LGGmjtn": "n9LkAv98aaGupypuLMH5ogjJ3rTEX178s9EnmRvmySL9k3cVuxTu",
      "nHUcNC5ni7XjVYfCMe38Rm3KQaq27jw7wJpcUYdo4miWwpNePRTw": "n9L3GcKLGWoz79RPfYq9GjEVyh57vpe1wM45i2tdczJ9u15ajAFB",
      "nHUcQnmEbCNq4uhntFudzfrZV8P5WLoBrR5h3R9jAd621Aaz1pSy": "n9KVcHedX11X6vCFNaZSGT2pUdbnd8PUpNGYP6BPutvYxQQy8DKo",
      "nHUd8g4DWm6HgjGTjKKSfYiRyf8qCvEN1PXR7YDJ5QTFyAnZHkbW": "n9KSXAVPy6ac8aX88fRsJN6eSrJ2gEfGrfskUVJJ7XkopGsKNg9X",
      "nHUdjQgg33FRu88GQDtzLWRw95xKnBurUZcqPpe3qC9XVeBNrHeJ": "n94RkpbJYRYQrWUmL8PAVQ1XTVKtfyKkLm8C6SWzWPcKEbuNb6EV",
      "nHUnhRJK3csknycNK5SXRFi8jvDp3sKoWvS9wKWLq1ATBBGgPBjp": "n9LbDLg9F7ExZCeMw1QZqsd1Ejs9uYpwd8bPUStF5hBJdd6B5aWj",
      "nHUon2tpyJEHHYGmxqeGu37cvPYHzrMtUNQFVdCgGNvEkjmCpTqK": "n9JebyUXwBa5GoYJQ6AbupoMKyE2zaiR3FTfDTMkxpMMv1KPmQEn",
      "nHUpJSKQTZdB1TDkbCREMuf8vEqFkk84BcvZDhsQsDufFDQVajam": "n9LFSE8fQ6Ljnc97ToHVtv1sYZ3GpzrXKpT94eFDk8jtdbfoBe7N",
      "nHUpcmNsxAw47yt2ADDoNoQrzLyTJPgnyq16u6Qx2kRPA17oUNHz": "n9Ls4GcrofTvLvymKh1wCqxw1aLzXUumyBBD9fAtbkk9WtdQ4TUH",
      "nHUq9tJvSyoXQKhRytuWeydpPjvTz3M9GfUpEqfsg9xsewM7KkkK": "n943ozDG74swHRmAjzY6A4KVFBhEirF4Sh1ACqvDePE3CZTgkMqn",
      "nHUryiyDqEtyWVtFG24AAhaYjMf9FRLietbGzviF3piJsMm9qyDR": "n9KAE7DUEB62ZQ3yWzygKWWqsj7ZqchW5rXg63puZA46k7WzGfQu",
      "nHUtmbn4ALrdU6U8pmd8AMt4qKTdZTbYJ3u1LHyAzXga3Zuopv5Y": "n9JkSnNqXxEct1t78dwVZDjq7PsznXtukxjyGvGJr4TdwVSbd7DJ",
      "nHUvcCcmoH1FJMMC6NtF9KKA4LpCWhjsxk2reCQidsp5AHQ7QY9H": "n9KQ2DVL7QhgovChk81W8idxm7wDsYzXutDMQzwUBKuxb9WTWBVG",
      "nHUvzia57LRXr9zqnYpyFUFeKvis2tqn4DkXBVGSppt5M4nNq43C": "n9KY4JZY11ndNbg55dThnoQdU9dii5q3egzoESVXw4Z7hu3maCba"
    },
    "trusted_validator_keys": [
      "nHUFCyRCrUjvtZmKiLeF8ReopzKuUoKeDeXo3wEUBVSaawzcSBpW",
      "nHUd8g4DWm6HgjGTjKKSfYiRyf8qCvEN1PXR7YDJ5QTFyAnZHkbW",
      "nHUUrjuEMtvzzTsiW2xKinUt7Jd83QFqYgfy3Feb7Hq1EJyoxoSz",
      "nHUcQnmEbCNq4uhntFudzfrZV8P5WLoBrR5h3R9jAd621Aaz1pSy",
      "nHBtDzdRDykxiuv7uSMPTcGexNm879RUUz5GW4h1qgjbtyvWZ1LE",
      "nHDH7bQJpVfDhVSqdui3Z8GPvKEBQpo6AKHcnXe21zoD4nABA6xj",
      "nHBidG3pZK11zQD6kpNDoAhDxH6WLGui6ZxSbUx7LSqLHsgzMPec",
      "nHUon2tpyJEHHYGmxqeGu37cvPYHzrMtUNQFVdCgGNvEkjmCpTqK",
      "nHUtmbn4ALrdU6U8pmd8AMt4qKTdZTbYJ3u1LHyAzXga3Zuopv5Y",
      "nHUryiyDqEtyWVtFG24AAhaYjMf9FRLietbGzviF3piJsMm9qyDR",
      "nHDwHQGjKTz6R6pFigSSrNBrhNYyUGFPHA75HiTccTCQzuu9d7Za",
      "nHUED59jjpQ5QbNhesXMhqii9gA8UfbBmv3i5StgyxG98qjsT4yn",
      "nHU2k8Po4dgygiQUG8wAADMk9RqkrActeKwsaC9MdtJ9KBvcpVji",
      "nHUq9tJvSyoXQKhRytuWeydpPjvTz3M9GfUpEqfsg9xsewM7KkkK",
      "nHUbgDd63HiuP68VRWazKwZRzS61N37K3NbfQaZLhSQ24LGGmjtn",
      "nHUT6Xa588zawXVdP2xyYXc87LQFm8uV38CxsVzq2RoQJP8LXpJF",
      "nHUpcmNsxAw47yt2ADDoNoQrzLyTJPgnyq16u6Qx2kRPA17oUNHz",
      "nHUvcCcmoH1FJMMC6NtF9KKA4LpCWhjsxk2reCQidsp5AHQ7QY9H",
      "nHUvzia57LRXr9zqnYpyFUFeKvis2tqn4DkXBVGSppt5M4nNq43C",
      "nHDB2PAPYqF86j9j3c6w1F1ZqwvQfiWcFShZ9Pokg9q4ohNDSkAz",
      "nHBk5DPexBjinXV8qHn7SEKzoxh2W92FxSbNTPgGtQYBzEF4msn9",
      "nHBgiH2aih5JoaL3wbiiqSQfhrC21vJjxXoCoD2fuqcNbriXsfLm",
      "nHU95JxeaHJoSdpE7R49Mxp4611Yk5yL9SGEc12UDJLr4oEUN4NT",
      "nHBdXSF6YHAHSZUk7rvox6jwbvvyqBnsWGcewBtq8x1XuH6KXKXr",
      "nHUVPzAmAmQ2QSc4oE1iLfsGi17qN2ado8PhxvgEkou76FLxAz7C",
      "nHB8QMKGt9VB4Vg71VszjBVQnDW3v3QudM4DwFaJfy96bj4Pv9fA",
      "nHUcNC5ni7XjVYfCMe38Rm3KQaq27jw7wJpcUYdo4miWwpNePRTw",
      "nHULqGBkJtWeNFjhTzYeAsHA3qKKS7HoBh8CV3BAGTGMZuepEhWC",
      "nHUXeusfwk61c4xJPneb9Lgy7Ga6DVaVLEyB29ftUdt9k2KxD6Hw",
      "nHUFE9prPXPrHcG3SkwP1UzAQbSphqyQkQK9ATXLZsfkezhhda3p",
      "nHUnhRJK3csknycNK5SXRFi8jvDp3sKoWvS9wKWLq1ATBBGgPBjp",
      "nHUY14bKLLm72ukzo2t6AVnQiu4bCd1jkimwWyJk3txvLeGhvro5",
      "nHUdjQgg33FRu88GQDtzLWRw95xKnBurUZcqPpe3qC9XVeBNrHeJ",
      "nHUpJSKQTZdB1TDkbCREMuf8vEqFkk84BcvZDhsQsDufFDQVajam",
      "nHU2Y1mLGDvTbc2dpvpkQ16qdeTKv2aJwGJHFySSB9U3jkTmj4CA"
    ],
    "validation_quorum": 28,
    "validator_list": {
      "count": 1,
      "expiration": "2022-Jun-01 00:00:00.000000000 UTC",
      "status": "active"
    }
  },
  "status": "success",
  "type": "response"
}
```
{% /tab %}

{% tab label="JSON-RPC" %}
```json
200 OK

{
  "result": {
    "local_static_keys": [],
    "publisher_lists": [
      {
        "available": true,
        "expiration": "2022-Jun-01 00:00:00.000000000 UTC",
        "list": [
          "nHBdXSF6YHAHSZUk7rvox6jwbvvyqBnsWGcewBtq8x1XuH6KXKXr",
          "nHBgiH2aih5JoaL3wbiiqSQfhrC21vJjxXoCoD2fuqcNbriXsfLm",
          "nHB8QMKGt9VB4Vg71VszjBVQnDW3v3QudM4DwFaJfy96bj4Pv9fA",
          "nHBidG3pZK11zQD6kpNDoAhDxH6WLGui6ZxSbUx7LSqLHsgzMPec",
          "nHBtDzdRDykxiuv7uSMPTcGexNm879RUUz5GW4h1qgjbtyvWZ1LE",
          "nHUryiyDqEtyWVtFG24AAhaYjMf9FRLietbGzviF3piJsMm9qyDR",
          "nHUpJSKQTZdB1TDkbCREMuf8vEqFkk84BcvZDhsQsDufFDQVajam",
          "nHUpcmNsxAw47yt2ADDoNoQrzLyTJPgnyq16u6Qx2kRPA17oUNHz",
          "nHUnhRJK3csknycNK5SXRFi8jvDp3sKoWvS9wKWLq1ATBBGgPBjp",
          "nHU95JxeaHJoSdpE7R49Mxp4611Yk5yL9SGEc12UDJLr4oEUN4NT",
          "nHUUrjuEMtvzzTsiW2xKinUt7Jd83QFqYgfy3Feb7Hq1EJyoxoSz",
          "nHUED59jjpQ5QbNhesXMhqii9gA8UfbBmv3i5StgyxG98qjsT4yn",
          "nHULqGBkJtWeNFjhTzYeAsHA3qKKS7HoBh8CV3BAGTGMZuepEhWC",
          "nHUT6Xa588zawXVdP2xyYXc87LQFm8uV38CxsVzq2RoQJP8LXpJF",
          "nHUVPzAmAmQ2QSc4oE1iLfsGi17qN2ado8PhxvgEkou76FLxAz7C",
          "nHUXeusfwk61c4xJPneb9Lgy7Ga6DVaVLEyB29ftUdt9k2KxD6Hw",
          "nHUY14bKLLm72ukzo2t6AVnQiu4bCd1jkimwWyJk3txvLeGhvro5",
          "nHU2Y1mLGDvTbc2dpvpkQ16qdeTKv2aJwGJHFySSB9U3jkTmj4CA",
          "nHU2k8Po4dgygiQUG8wAADMk9RqkrActeKwsaC9MdtJ9KBvcpVji",
          "nHUbgDd63HiuP68VRWazKwZRzS61N37K3NbfQaZLhSQ24LGGmjtn",
          "nHUcNC5ni7XjVYfCMe38Rm3KQaq27jw7wJpcUYdo4miWwpNePRTw",
          "nHUcQnmEbCNq4uhntFudzfrZV8P5WLoBrR5h3R9jAd621Aaz1pSy",
          "nHUdjQgg33FRu88GQDtzLWRw95xKnBurUZcqPpe3qC9XVeBNrHeJ",
          "nHUd8g4DWm6HgjGTjKKSfYiRyf8qCvEN1PXR7YDJ5QTFyAnZHkbW",
          "nHUon2tpyJEHHYGmxqeGu37cvPYHzrMtUNQFVdCgGNvEkjmCpTqK",
          "nHUFE9prPXPrHcG3SkwP1UzAQbSphqyQkQK9ATXLZsfkezhhda3p",
          "nHUFCyRCrUjvtZmKiLeF8ReopzKuUoKeDeXo3wEUBVSaawzcSBpW",
          "nHUq9tJvSyoXQKhRytuWeydpPjvTz3M9GfUpEqfsg9xsewM7KkkK",
          "nHUtmbn4ALrdU6U8pmd8AMt4qKTdZTbYJ3u1LHyAzXga3Zuopv5Y",
          "nHUvcCcmoH1FJMMC6NtF9KKA4LpCWhjsxk2reCQidsp5AHQ7QY9H",
          "nHUvzia57LRXr9zqnYpyFUFeKvis2tqn4DkXBVGSppt5M4nNq43C",
          "nHDwHQGjKTz6R6pFigSSrNBrhNYyUGFPHA75HiTccTCQzuu9d7Za",
          "nHDB2PAPYqF86j9j3c6w1F1ZqwvQfiWcFShZ9Pokg9q4ohNDSkAz",
          "nHDH7bQJpVfDhVSqdui3Z8GPvKEBQpo6AKHcnXe21zoD4nABA6xj"
        ],
        "pubkey_publisher": "ED2677ABFFD1B33AC6FBC3062B71F1E8397C1505E1C42C64D11AD1B28FF73F4734",
        "seq": 70,
        "uri": "https://vl.ripple.com",
        "version": 1
      }
    ],
    "signing_keys": {
      "nHB8QMKGt9VB4Vg71VszjBVQnDW3v3QudM4DwFaJfy96bj4Pv9fA": "n9KeTQ3UyMtaJJD78vT7QiGRMv1GcWHEnhNbwKfdbW2HfRqtvUUt",
      "nHBdXSF6YHAHSZUk7rvox6jwbvvyqBnsWGcewBtq8x1XuH6KXKXr": "n9MfeCuZK2ra5eJtFDtuCTnvxfsi85k4J3GXJ1TvRVr2o4EQeHMF",
      "nHBgiH2aih5JoaL3wbiiqSQfhrC21vJjxXoCoD2fuqcNbriXsfLm": "n9KhsMP6jKFQPpjJ9VwqyZSwrL4shdX9YknRwmsAVL1RNVrx4jLm",
      "nHBidG3pZK11zQD6kpNDoAhDxH6WLGui6ZxSbUx7LSqLHsgzMPec": "n9KaxgJv69FucW5kkiaMhCqS6sAR1wUVxpZaZmLGVXxAcAse9YhR",
      "nHBk5DPexBjinXV8qHn7SEKzoxh2W92FxSbNTPgGtQYBzEF4msn9": "n9KnrcCmL5psyKtk2KWP6jy14Hj4EXuZDg7XMdQJ9cSDoFSp53hu",
      "nHBtDzdRDykxiuv7uSMPTcGexNm879RUUz5GW4h1qgjbtyvWZ1LE": "n9LCf7NtwcyXVc5fYB6UVByRoQZqJDhrMUoKnr3GQB6mFqpcmMzg",
      "nHDB2PAPYqF86j9j3c6w1F1ZqwvQfiWcFShZ9Pokg9q4ohNDSkAz": "n9Jk38y9XCznqiLq53UjREJQbZWnz4Pvmph55GP5ofUPg3RG8eVr",
      "nHDH7bQJpVfDhVSqdui3Z8GPvKEBQpo6AKHcnXe21zoD4nABA6xj": "n9MSTcx1fmfyKpaDTtpXucugcqM7yxpaggmwRxcyA3Nr4pE1pN3x",
      "nHDwHQGjKTz6R6pFigSSrNBrhNYyUGFPHA75HiTccTCQzuu9d7Za": "n9Kb81J9kqGgYkrNDRSPT3UCgz8Bei1CPHGMt85yxz9mUSvuzV5k",
      "nHU2Y1mLGDvTbc2dpvpkQ16qdeTKv2aJwGJHFySSB9U3jkTmj4CA": "n9K2FpCqZftM1xXXaWXFPVbEimLX6MEjrmQywfSutkdK1PRvqDb2",
      "nHU2k8Po4dgygiQUG8wAADMk9RqkrActeKwsaC9MdtJ9KBvcpVji": "n9MhLZsK7Av6ny2gV5SAGLDsnFXE9p85aYR8diD8xvuvuucqad85",
      "nHU95JxeaHJoSdpE7R49Mxp4611Yk5yL9SGEc12UDJLr4oEUN4NT": "n9JtY9MqUcwKWenHp8WoRobFRmB2mmBEJd1ruJmhKGKAwtFQkQjb",
      "nHUED59jjpQ5QbNhesXMhqii9gA8UfbBmv3i5StgyxG98qjsT4yn": "n9Km4Xz53K9kcTaVn3mYAHsXqNuAo7A2HazSr34SFufvNwBxYGLn",
      "nHUFCyRCrUjvtZmKiLeF8ReopzKuUoKeDeXo3wEUBVSaawzcSBpW": "n9Lqr4YZxk7WYRDTBZjjmoAraikLCjAgAswaPaZ6LaGW6Q4Y2eoo",
      "nHUFE9prPXPrHcG3SkwP1UzAQbSphqyQkQK9ATXLZsfkezhhda3p": "n9LMfcjE6dMyshCqiftLFXpB9K3Mnd2r5bG7K8osmrkFpHUoR3c1",
      "nHULqGBkJtWeNFjhTzYeAsHA3qKKS7HoBh8CV3BAGTGMZuepEhWC": "n9MZ7EVGKypqdyNguP31xSqhFqDBF4V5FESLMmLiGrBJ3khP2AzQ",
      "nHUT6Xa588zawXVdP2xyYXc87LQFm8uV38CxsVzq2RoQJP8LXpJF": "n9Lq9bekeVhCsW8dwqzfvKsqUiu9Qxvwk9YmF2hxkBJjNrGNL5Fw",
      "nHUUrjuEMtvzzTsiW2xKinUt7Jd83QFqYgfy3Feb7Hq1EJyoxoSz": "n9LLqqH1cVFPjEnQYFQ6DooxuhHPQxwXgMjDGrpJ6pb1WGDoi76Q",
      "nHUVPzAmAmQ2QSc4oE1iLfsGi17qN2ado8PhxvgEkou76FLxAz7C": "n9J1GJHtua77TBEzir3FvsgWX68xBFeC8os3s5TkCg97E1cwxKfH",
      "nHUXeusfwk61c4xJPneb9Lgy7Ga6DVaVLEyB29ftUdt9k2KxD6Hw": "n9McDrz9tPujrQK3vMXJXzuEJv1B8UG3opfZEsFA8t6QxdZh1H6m",
      "nHUY14bKLLm72ukzo2t6AVnQiu4bCd1jkimwWyJk3txvLeGhvro5": "n9M2UqXLK25h9YEQTskmCXbWPGhQmB1pFVqeXia38UwLaL838VbG",
      "nHUbgDd63HiuP68VRWazKwZRzS61N37K3NbfQaZLhSQ24LGGmjtn": "n9LkAv98aaGupypuLMH5ogjJ3rTEX178s9EnmRvmySL9k3cVuxTu",
      "nHUcNC5ni7XjVYfCMe38Rm3KQaq27jw7wJpcUYdo4miWwpNePRTw": "n9L3GcKLGWoz79RPfYq9GjEVyh57vpe1wM45i2tdczJ9u15ajAFB",
      "nHUcQnmEbCNq4uhntFudzfrZV8P5WLoBrR5h3R9jAd621Aaz1pSy": "n9KVcHedX11X6vCFNaZSGT2pUdbnd8PUpNGYP6BPutvYxQQy8DKo",
      "nHUd8g4DWm6HgjGTjKKSfYiRyf8qCvEN1PXR7YDJ5QTFyAnZHkbW": "n9KSXAVPy6ac8aX88fRsJN6eSrJ2gEfGrfskUVJJ7XkopGsKNg9X",
      "nHUdjQgg33FRu88GQDtzLWRw95xKnBurUZcqPpe3qC9XVeBNrHeJ": "n94RkpbJYRYQrWUmL8PAVQ1XTVKtfyKkLm8C6SWzWPcKEbuNb6EV",
      "nHUnhRJK3csknycNK5SXRFi8jvDp3sKoWvS9wKWLq1ATBBGgPBjp": "n9LbDLg9F7ExZCeMw1QZqsd1Ejs9uYpwd8bPUStF5hBJdd6B5aWj",
      "nHUon2tpyJEHHYGmxqeGu37cvPYHzrMtUNQFVdCgGNvEkjmCpTqK": "n9JebyUXwBa5GoYJQ6AbupoMKyE2zaiR3FTfDTMkxpMMv1KPmQEn",
      "nHUpJSKQTZdB1TDkbCREMuf8vEqFkk84BcvZDhsQsDufFDQVajam": "n9LFSE8fQ6Ljnc97ToHVtv1sYZ3GpzrXKpT94eFDk8jtdbfoBe7N",
      "nHUpcmNsxAw47yt2ADDoNoQrzLyTJPgnyq16u6Qx2kRPA17oUNHz": "n9Ls4GcrofTvLvymKh1wCqxw1aLzXUumyBBD9fAtbkk9WtdQ4TUH",
      "nHUq9tJvSyoXQKhRytuWeydpPjvTz3M9GfUpEqfsg9xsewM7KkkK": "n943ozDG74swHRmAjzY6A4KVFBhEirF4Sh1ACqvDePE3CZTgkMqn",
      "nHUryiyDqEtyWVtFG24AAhaYjMf9FRLietbGzviF3piJsMm9qyDR": "n9KAE7DUEB62ZQ3yWzygKWWqsj7ZqchW5rXg63puZA46k7WzGfQu",
      "nHUtmbn4ALrdU6U8pmd8AMt4qKTdZTbYJ3u1LHyAzXga3Zuopv5Y": "n9JkSnNqXxEct1t78dwVZDjq7PsznXtukxjyGvGJr4TdwVSbd7DJ",
      "nHUvcCcmoH1FJMMC6NtF9KKA4LpCWhjsxk2reCQidsp5AHQ7QY9H": "n9KQ2DVL7QhgovChk81W8idxm7wDsYzXutDMQzwUBKuxb9WTWBVG",
      "nHUvzia57LRXr9zqnYpyFUFeKvis2tqn4DkXBVGSppt5M4nNq43C": "n9KY4JZY11ndNbg55dThnoQdU9dii5q3egzoESVXw4Z7hu3maCba"
    },
    "status": "success",
    "trusted_validator_keys": [
      "nHUFCyRCrUjvtZmKiLeF8ReopzKuUoKeDeXo3wEUBVSaawzcSBpW",
      "nHUd8g4DWm6HgjGTjKKSfYiRyf8qCvEN1PXR7YDJ5QTFyAnZHkbW",
      "nHUUrjuEMtvzzTsiW2xKinUt7Jd83QFqYgfy3Feb7Hq1EJyoxoSz",
      "nHUcQnmEbCNq4uhntFudzfrZV8P5WLoBrR5h3R9jAd621Aaz1pSy",
      "nHBtDzdRDykxiuv7uSMPTcGexNm879RUUz5GW4h1qgjbtyvWZ1LE",
      "nHDH7bQJpVfDhVSqdui3Z8GPvKEBQpo6AKHcnXe21zoD4nABA6xj",
      "nHBidG3pZK11zQD6kpNDoAhDxH6WLGui6ZxSbUx7LSqLHsgzMPec",
      "nHUon2tpyJEHHYGmxqeGu37cvPYHzrMtUNQFVdCgGNvEkjmCpTqK",
      "nHUtmbn4ALrdU6U8pmd8AMt4qKTdZTbYJ3u1LHyAzXga3Zuopv5Y",
      "nHUryiyDqEtyWVtFG24AAhaYjMf9FRLietbGzviF3piJsMm9qyDR",
      "nHDwHQGjKTz6R6pFigSSrNBrhNYyUGFPHA75HiTccTCQzuu9d7Za",
      "nHUED59jjpQ5QbNhesXMhqii9gA8UfbBmv3i5StgyxG98qjsT4yn",
      "nHU2k8Po4dgygiQUG8wAADMk9RqkrActeKwsaC9MdtJ9KBvcpVji",
      "nHUq9tJvSyoXQKhRytuWeydpPjvTz3M9GfUpEqfsg9xsewM7KkkK",
      "nHUbgDd63HiuP68VRWazKwZRzS61N37K3NbfQaZLhSQ24LGGmjtn",
      "nHUT6Xa588zawXVdP2xyYXc87LQFm8uV38CxsVzq2RoQJP8LXpJF",
      "nHUpcmNsxAw47yt2ADDoNoQrzLyTJPgnyq16u6Qx2kRPA17oUNHz",
      "nHUvcCcmoH1FJMMC6NtF9KKA4LpCWhjsxk2reCQidsp5AHQ7QY9H",
      "nHUvzia57LRXr9zqnYpyFUFeKvis2tqn4DkXBVGSppt5M4nNq43C",
      "nHDB2PAPYqF86j9j3c6w1F1ZqwvQfiWcFShZ9Pokg9q4ohNDSkAz",
      "nHBk5DPexBjinXV8qHn7SEKzoxh2W92FxSbNTPgGtQYBzEF4msn9",
      "nHBgiH2aih5JoaL3wbiiqSQfhrC21vJjxXoCoD2fuqcNbriXsfLm",
      "nHU95JxeaHJoSdpE7R49Mxp4611Yk5yL9SGEc12UDJLr4oEUN4NT",
      "nHBdXSF6YHAHSZUk7rvox6jwbvvyqBnsWGcewBtq8x1XuH6KXKXr",
      "nHUVPzAmAmQ2QSc4oE1iLfsGi17qN2ado8PhxvgEkou76FLxAz7C",
      "nHB8QMKGt9VB4Vg71VszjBVQnDW3v3QudM4DwFaJfy96bj4Pv9fA",
      "nHUcNC5ni7XjVYfCMe38Rm3KQaq27jw7wJpcUYdo4miWwpNePRTw",
      "nHULqGBkJtWeNFjhTzYeAsHA3qKKS7HoBh8CV3BAGTGMZuepEhWC",
      "nHUXeusfwk61c4xJPneb9Lgy7Ga6DVaVLEyB29ftUdt9k2KxD6Hw",
      "nHUFE9prPXPrHcG3SkwP1UzAQbSphqyQkQK9ATXLZsfkezhhda3p",
      "nHUnhRJK3csknycNK5SXRFi8jvDp3sKoWvS9wKWLq1ATBBGgPBjp",
      "nHUY14bKLLm72ukzo2t6AVnQiu4bCd1jkimwWyJk3txvLeGhvro5",
      "nHUdjQgg33FRu88GQDtzLWRw95xKnBurUZcqPpe3qC9XVeBNrHeJ",
      "nHUpJSKQTZdB1TDkbCREMuf8vEqFkk84BcvZDhsQsDufFDQVajam",
      "nHU2Y1mLGDvTbc2dpvpkQ16qdeTKv2aJwGJHFySSB9U3jkTmj4CA"
    ],
    "validation_quorum": 28,
    "validator_list": {
      "count": 1,
      "expiration": "2022-Jun-01 00:00:00.000000000 UTC",
      "status": "active"
    }
  }
}
```
{% /tab %}

{% tab label="Commandline" %}
```json
Loading: "/etc/rippled.cfg"
Connecting to 127.0.0.1:5005

{
  "result": {
    "local_static_keys": [],
    "publisher_lists": [
      {
        "available": true,
        "expiration": "2022-Jun-01 00:00:00.000000000 UTC",
        "list": [
          "nHBdXSF6YHAHSZUk7rvox6jwbvvyqBnsWGcewBtq8x1XuH6KXKXr",
          "nHBgiH2aih5JoaL3wbiiqSQfhrC21vJjxXoCoD2fuqcNbriXsfLm",
          "nHB8QMKGt9VB4Vg71VszjBVQnDW3v3QudM4DwFaJfy96bj4Pv9fA",
          "nHBidG3pZK11zQD6kpNDoAhDxH6WLGui6ZxSbUx7LSqLHsgzMPec",
          "nHBtDzdRDykxiuv7uSMPTcGexNm879RUUz5GW4h1qgjbtyvWZ1LE",
          "nHUryiyDqEtyWVtFG24AAhaYjMf9FRLietbGzviF3piJsMm9qyDR",
          "nHUpJSKQTZdB1TDkbCREMuf8vEqFkk84BcvZDhsQsDufFDQVajam",
          "nHUpcmNsxAw47yt2ADDoNoQrzLyTJPgnyq16u6Qx2kRPA17oUNHz",
          "nHUnhRJK3csknycNK5SXRFi8jvDp3sKoWvS9wKWLq1ATBBGgPBjp",
          "nHU95JxeaHJoSdpE7R49Mxp4611Yk5yL9SGEc12UDJLr4oEUN4NT",
          "nHUUrjuEMtvzzTsiW2xKinUt7Jd83QFqYgfy3Feb7Hq1EJyoxoSz",
          "nHUED59jjpQ5QbNhesXMhqii9gA8UfbBmv3i5StgyxG98qjsT4yn",
          "nHULqGBkJtWeNFjhTzYeAsHA3qKKS7HoBh8CV3BAGTGMZuepEhWC",
          "nHUT6Xa588zawXVdP2xyYXc87LQFm8uV38CxsVzq2RoQJP8LXpJF",
          "nHUVPzAmAmQ2QSc4oE1iLfsGi17qN2ado8PhxvgEkou76FLxAz7C",
          "nHUXeusfwk61c4xJPneb9Lgy7Ga6DVaVLEyB29ftUdt9k2KxD6Hw",
          "nHUY14bKLLm72ukzo2t6AVnQiu4bCd1jkimwWyJk3txvLeGhvro5",
          "nHU2Y1mLGDvTbc2dpvpkQ16qdeTKv2aJwGJHFySSB9U3jkTmj4CA",
          "nHU2k8Po4dgygiQUG8wAADMk9RqkrActeKwsaC9MdtJ9KBvcpVji",
          "nHUbgDd63HiuP68VRWazKwZRzS61N37K3NbfQaZLhSQ24LGGmjtn",
          "nHUcNC5ni7XjVYfCMe38Rm3KQaq27jw7wJpcUYdo4miWwpNePRTw",
          "nHUcQnmEbCNq4uhntFudzfrZV8P5WLoBrR5h3R9jAd621Aaz1pSy",
          "nHUdjQgg33FRu88GQDtzLWRw95xKnBurUZcqPpe3qC9XVeBNrHeJ",
          "nHUd8g4DWm6HgjGTjKKSfYiRyf8qCvEN1PXR7YDJ5QTFyAnZHkbW",
          "nHUon2tpyJEHHYGmxqeGu37cvPYHzrMtUNQFVdCgGNvEkjmCpTqK",
          "nHUFE9prPXPrHcG3SkwP1UzAQbSphqyQkQK9ATXLZsfkezhhda3p",
          "nHUFCyRCrUjvtZmKiLeF8ReopzKuUoKeDeXo3wEUBVSaawzcSBpW",
          "nHUq9tJvSyoXQKhRytuWeydpPjvTz3M9GfUpEqfsg9xsewM7KkkK",
          "nHUtmbn4ALrdU6U8pmd8AMt4qKTdZTbYJ3u1LHyAzXga3Zuopv5Y",
          "nHUvcCcmoH1FJMMC6NtF9KKA4LpCWhjsxk2reCQidsp5AHQ7QY9H",
          "nHUvzia57LRXr9zqnYpyFUFeKvis2tqn4DkXBVGSppt5M4nNq43C",
          "nHDwHQGjKTz6R6pFigSSrNBrhNYyUGFPHA75HiTccTCQzuu9d7Za",
          "nHDB2PAPYqF86j9j3c6w1F1ZqwvQfiWcFShZ9Pokg9q4ohNDSkAz",
          "nHDH7bQJpVfDhVSqdui3Z8GPvKEBQpo6AKHcnXe21zoD4nABA6xj"
        ],
        "pubkey_publisher": "ED2677ABFFD1B33AC6FBC3062B71F1E8397C1505E1C42C64D11AD1B28FF73F4734",
        "seq": 70,
        "uri": "https://vl.ripple.com",
        "version": 1
      }
    ],
    "signing_keys": {
      "nHB8QMKGt9VB4Vg71VszjBVQnDW3v3QudM4DwFaJfy96bj4Pv9fA": "n9KeTQ3UyMtaJJD78vT7QiGRMv1GcWHEnhNbwKfdbW2HfRqtvUUt",
      "nHBdXSF6YHAHSZUk7rvox6jwbvvyqBnsWGcewBtq8x1XuH6KXKXr": "n9MfeCuZK2ra5eJtFDtuCTnvxfsi85k4J3GXJ1TvRVr2o4EQeHMF",
      "nHBgiH2aih5JoaL3wbiiqSQfhrC21vJjxXoCoD2fuqcNbriXsfLm": "n9KhsMP6jKFQPpjJ9VwqyZSwrL4shdX9YknRwmsAVL1RNVrx4jLm",
      "nHBidG3pZK11zQD6kpNDoAhDxH6WLGui6ZxSbUx7LSqLHsgzMPec": "n9KaxgJv69FucW5kkiaMhCqS6sAR1wUVxpZaZmLGVXxAcAse9YhR",
      "nHBk5DPexBjinXV8qHn7SEKzoxh2W92FxSbNTPgGtQYBzEF4msn9": "n9KnrcCmL5psyKtk2KWP6jy14Hj4EXuZDg7XMdQJ9cSDoFSp53hu",
      "nHBtDzdRDykxiuv7uSMPTcGexNm879RUUz5GW4h1qgjbtyvWZ1LE": "n9LCf7NtwcyXVc5fYB6UVByRoQZqJDhrMUoKnr3GQB6mFqpcmMzg",
      "nHDB2PAPYqF86j9j3c6w1F1ZqwvQfiWcFShZ9Pokg9q4ohNDSkAz": "n9Jk38y9XCznqiLq53UjREJQbZWnz4Pvmph55GP5ofUPg3RG8eVr",
      "nHDH7bQJpVfDhVSqdui3Z8GPvKEBQpo6AKHcnXe21zoD4nABA6xj": "n9MSTcx1fmfyKpaDTtpXucugcqM7yxpaggmwRxcyA3Nr4pE1pN3x",
      "nHDwHQGjKTz6R6pFigSSrNBrhNYyUGFPHA75HiTccTCQzuu9d7Za": "n9Kb81J9kqGgYkrNDRSPT3UCgz8Bei1CPHGMt85yxz9mUSvuzV5k",
      "nHU2Y1mLGDvTbc2dpvpkQ16qdeTKv2aJwGJHFySSB9U3jkTmj4CA": "n9K2FpCqZftM1xXXaWXFPVbEimLX6MEjrmQywfSutkdK1PRvqDb2",
      "nHU2k8Po4dgygiQUG8wAADMk9RqkrActeKwsaC9MdtJ9KBvcpVji": "n9MhLZsK7Av6ny2gV5SAGLDsnFXE9p85aYR8diD8xvuvuucqad85",
      "nHU95JxeaHJoSdpE7R49Mxp4611Yk5yL9SGEc12UDJLr4oEUN4NT": "n9JtY9MqUcwKWenHp8WoRobFRmB2mmBEJd1ruJmhKGKAwtFQkQjb",
      "nHUED59jjpQ5QbNhesXMhqii9gA8UfbBmv3i5StgyxG98qjsT4yn": "n9Km4Xz53K9kcTaVn3mYAHsXqNuAo7A2HazSr34SFufvNwBxYGLn",
      "nHUFCyRCrUjvtZmKiLeF8ReopzKuUoKeDeXo3wEUBVSaawzcSBpW": "n9Lqr4YZxk7WYRDTBZjjmoAraikLCjAgAswaPaZ6LaGW6Q4Y2eoo",
      "nHUFE9prPXPrHcG3SkwP1UzAQbSphqyQkQK9ATXLZsfkezhhda3p": "n9LMfcjE6dMyshCqiftLFXpB9K3Mnd2r5bG7K8osmrkFpHUoR3c1",
      "nHULqGBkJtWeNFjhTzYeAsHA3qKKS7HoBh8CV3BAGTGMZuepEhWC": "n9MZ7EVGKypqdyNguP31xSqhFqDBF4V5FESLMmLiGrBJ3khP2AzQ",
      "nHUT6Xa588zawXVdP2xyYXc87LQFm8uV38CxsVzq2RoQJP8LXpJF": "n9Lq9bekeVhCsW8dwqzfvKsqUiu9Qxvwk9YmF2hxkBJjNrGNL5Fw",
      "nHUUrjuEMtvzzTsiW2xKinUt7Jd83QFqYgfy3Feb7Hq1EJyoxoSz": "n9LLqqH1cVFPjEnQYFQ6DooxuhHPQxwXgMjDGrpJ6pb1WGDoi76Q",
      "nHUVPzAmAmQ2QSc4oE1iLfsGi17qN2ado8PhxvgEkou76FLxAz7C": "n9J1GJHtua77TBEzir3FvsgWX68xBFeC8os3s5TkCg97E1cwxKfH",
      "nHUXeusfwk61c4xJPneb9Lgy7Ga6DVaVLEyB29ftUdt9k2KxD6Hw": "n9McDrz9tPujrQK3vMXJXzuEJv1B8UG3opfZEsFA8t6QxdZh1H6m",
      "nHUY14bKLLm72ukzo2t6AVnQiu4bCd1jkimwWyJk3txvLeGhvro5": "n9M2UqXLK25h9YEQTskmCXbWPGhQmB1pFVqeXia38UwLaL838VbG",
      "nHUbgDd63HiuP68VRWazKwZRzS61N37K3NbfQaZLhSQ24LGGmjtn": "n9LkAv98aaGupypuLMH5ogjJ3rTEX178s9EnmRvmySL9k3cVuxTu",
      "nHUcNC5ni7XjVYfCMe38Rm3KQaq27jw7wJpcUYdo4miWwpNePRTw": "n9L3GcKLGWoz79RPfYq9GjEVyh57vpe1wM45i2tdczJ9u15ajAFB",
      "nHUcQnmEbCNq4uhntFudzfrZV8P5WLoBrR5h3R9jAd621Aaz1pSy": "n9KVcHedX11X6vCFNaZSGT2pUdbnd8PUpNGYP6BPutvYxQQy8DKo",
      "nHUd8g4DWm6HgjGTjKKSfYiRyf8qCvEN1PXR7YDJ5QTFyAnZHkbW": "n9KSXAVPy6ac8aX88fRsJN6eSrJ2gEfGrfskUVJJ7XkopGsKNg9X",
      "nHUdjQgg33FRu88GQDtzLWRw95xKnBurUZcqPpe3qC9XVeBNrHeJ": "n94RkpbJYRYQrWUmL8PAVQ1XTVKtfyKkLm8C6SWzWPcKEbuNb6EV",
      "nHUnhRJK3csknycNK5SXRFi8jvDp3sKoWvS9wKWLq1ATBBGgPBjp": "n9LbDLg9F7ExZCeMw1QZqsd1Ejs9uYpwd8bPUStF5hBJdd6B5aWj",
      "nHUon2tpyJEHHYGmxqeGu37cvPYHzrMtUNQFVdCgGNvEkjmCpTqK": "n9JebyUXwBa5GoYJQ6AbupoMKyE2zaiR3FTfDTMkxpMMv1KPmQEn",
      "nHUpJSKQTZdB1TDkbCREMuf8vEqFkk84BcvZDhsQsDufFDQVajam": "n9LFSE8fQ6Ljnc97ToHVtv1sYZ3GpzrXKpT94eFDk8jtdbfoBe7N",
      "nHUpcmNsxAw47yt2ADDoNoQrzLyTJPgnyq16u6Qx2kRPA17oUNHz": "n9Ls4GcrofTvLvymKh1wCqxw1aLzXUumyBBD9fAtbkk9WtdQ4TUH",
      "nHUq9tJvSyoXQKhRytuWeydpPjvTz3M9GfUpEqfsg9xsewM7KkkK": "n943ozDG74swHRmAjzY6A4KVFBhEirF4Sh1ACqvDePE3CZTgkMqn",
      "nHUryiyDqEtyWVtFG24AAhaYjMf9FRLietbGzviF3piJsMm9qyDR": "n9KAE7DUEB62ZQ3yWzygKWWqsj7ZqchW5rXg63puZA46k7WzGfQu",
      "nHUtmbn4ALrdU6U8pmd8AMt4qKTdZTbYJ3u1LHyAzXga3Zuopv5Y": "n9JkSnNqXxEct1t78dwVZDjq7PsznXtukxjyGvGJr4TdwVSbd7DJ",
      "nHUvcCcmoH1FJMMC6NtF9KKA4LpCWhjsxk2reCQidsp5AHQ7QY9H": "n9KQ2DVL7QhgovChk81W8idxm7wDsYzXutDMQzwUBKuxb9WTWBVG",
      "nHUvzia57LRXr9zqnYpyFUFeKvis2tqn4DkXBVGSppt5M4nNq43C": "n9KY4JZY11ndNbg55dThnoQdU9dii5q3egzoESVXw4Z7hu3maCba"
    },
    "status": "success",
    "trusted_validator_keys": [
      "nHUFCyRCrUjvtZmKiLeF8ReopzKuUoKeDeXo3wEUBVSaawzcSBpW",
      "nHUd8g4DWm6HgjGTjKKSfYiRyf8qCvEN1PXR7YDJ5QTFyAnZHkbW",
      "nHUUrjuEMtvzzTsiW2xKinUt7Jd83QFqYgfy3Feb7Hq1EJyoxoSz",
      "nHUcQnmEbCNq4uhntFudzfrZV8P5WLoBrR5h3R9jAd621Aaz1pSy",
      "nHBtDzdRDykxiuv7uSMPTcGexNm879RUUz5GW4h1qgjbtyvWZ1LE",
      "nHDH7bQJpVfDhVSqdui3Z8GPvKEBQpo6AKHcnXe21zoD4nABA6xj",
      "nHBidG3pZK11zQD6kpNDoAhDxH6WLGui6ZxSbUx7LSqLHsgzMPec",
      "nHUon2tpyJEHHYGmxqeGu37cvPYHzrMtUNQFVdCgGNvEkjmCpTqK",
      "nHUtmbn4ALrdU6U8pmd8AMt4qKTdZTbYJ3u1LHyAzXga3Zuopv5Y",
      "nHUryiyDqEtyWVtFG24AAhaYjMf9FRLietbGzviF3piJsMm9qyDR",
      "nHDwHQGjKTz6R6pFigSSrNBrhNYyUGFPHA75HiTccTCQzuu9d7Za",
      "nHUED59jjpQ5QbNhesXMhqii9gA8UfbBmv3i5StgyxG98qjsT4yn",
      "nHU2k8Po4dgygiQUG8wAADMk9RqkrActeKwsaC9MdtJ9KBvcpVji",
      "nHUq9tJvSyoXQKhRytuWeydpPjvTz3M9GfUpEqfsg9xsewM7KkkK",
      "nHUbgDd63HiuP68VRWazKwZRzS61N37K3NbfQaZLhSQ24LGGmjtn",
      "nHUT6Xa588zawXVdP2xyYXc87LQFm8uV38CxsVzq2RoQJP8LXpJF",
      "nHUpcmNsxAw47yt2ADDoNoQrzLyTJPgnyq16u6Qx2kRPA17oUNHz",
      "nHUvcCcmoH1FJMMC6NtF9KKA4LpCWhjsxk2reCQidsp5AHQ7QY9H",
      "nHUvzia57LRXr9zqnYpyFUFeKvis2tqn4DkXBVGSppt5M4nNq43C",
      "nHDB2PAPYqF86j9j3c6w1F1ZqwvQfiWcFShZ9Pokg9q4ohNDSkAz",
      "nHBk5DPexBjinXV8qHn7SEKzoxh2W92FxSbNTPgGtQYBzEF4msn9",
      "nHBgiH2aih5JoaL3wbiiqSQfhrC21vJjxXoCoD2fuqcNbriXsfLm",
      "nHU95JxeaHJoSdpE7R49Mxp4611Yk5yL9SGEc12UDJLr4oEUN4NT",
      "nHBdXSF6YHAHSZUk7rvox6jwbvvyqBnsWGcewBtq8x1XuH6KXKXr",
      "nHUVPzAmAmQ2QSc4oE1iLfsGi17qN2ado8PhxvgEkou76FLxAz7C",
      "nHB8QMKGt9VB4Vg71VszjBVQnDW3v3QudM4DwFaJfy96bj4Pv9fA",
      "nHUcNC5ni7XjVYfCMe38Rm3KQaq27jw7wJpcUYdo4miWwpNePRTw",
      "nHULqGBkJtWeNFjhTzYeAsHA3qKKS7HoBh8CV3BAGTGMZuepEhWC",
      "nHUXeusfwk61c4xJPneb9Lgy7Ga6DVaVLEyB29ftUdt9k2KxD6Hw",
      "nHUFE9prPXPrHcG3SkwP1UzAQbSphqyQkQK9ATXLZsfkezhhda3p",
      "nHUnhRJK3csknycNK5SXRFi8jvDp3sKoWvS9wKWLq1ATBBGgPBjp",
      "nHUY14bKLLm72ukzo2t6AVnQiu4bCd1jkimwWyJk3txvLeGhvro5",
      "nHUdjQgg33FRu88GQDtzLWRw95xKnBurUZcqPpe3qC9XVeBNrHeJ",
      "nHUpJSKQTZdB1TDkbCREMuf8vEqFkk84BcvZDhsQsDufFDQVajam",
      "nHU2Y1mLGDvTbc2dpvpkQ16qdeTKv2aJwGJHFySSB9U3jkTmj4CA"
    ],
    "validation_quorum": 28,
    "validator_list": {
      "count": 1,
      "expiration": "2022-Jun-01 00:00:00.000000000 UTC",
      "status": "active"
    }
  }
}
```
{% /tab %}

{% /tabs %}

The response follows the [standard format][], with a successful result containing the following fields:

| `Field`                  | Type   | Description                              |
|:-------------------------|:-------|:-----------------------------------------|
| `local_static_keys`      | Array  | Array of public keys for validators explicitly trusted in the config file. |
| `publisher_lists`        | Array  | Array of **Publisher List** objects. (See below for details.) |
| `signing_keys`           | Object | Mapping from master public key to current ephemeral public key for all currently-trusted validators. Excludes validators that don't use an ephemeral signing key. |
| `trusted_validator_keys` | Array  | Array of master public keys of all currently trusted validators. |
| `validation_quorum`      | Number | Minimum number of trusted validations required to validate a ledger version. Some circumstances may cause the server to require more validations. |
| `validator_list_expires` | String | The human readable time when the current validator list expires. There are two special cases: the string `unknown` if the server has not yet loaded a published validator list, or the string `never` if the server uses a static validator list. |

Each member of the `publisher_lists` array is a **Publisher List** object with the following fields:

| `Field`            | Type             | Description                          |
|:-------------------|:-----------------|:-------------------------------------|
| `available`        | Boolean          | If `false`, the validator keys in `list` may no longer be supported by this publisher. |
| `expiration`       | String           | The human readable time when this published list is scheduled to expire. |
| `list`             | Array            | Array of published validator keys in the list.   |
| `pubkey_publisher` | String           | Ed25519 or ECDSA public key of the list publisher, as hexadecimal. |
| `seq`              | Unsigned Integer | The sequence number of this published list. |
| `version`          | Unsigned Integer | The version of the list format.      |

### Possible Errors

- Any of the [universal error types][].
- `reportingUnsupported` - ([Reporting Mode][] servers only) This method is not available in Reporting Mode.

{% raw-partial file="/docs/_snippets/common-links.md" /%}
