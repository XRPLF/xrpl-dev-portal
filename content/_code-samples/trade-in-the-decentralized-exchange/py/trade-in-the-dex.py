import asyncio
import pprint
from decimal import Decimal

from xrpl.asyncio.clients import AsyncWebsocketClient
from xrpl.asyncio.transaction import (
    autofill_and_sign,
    submit_and_wait,
)
from xrpl.asyncio.wallet import generate_faucet_wallet
from xrpl.models.currencies import (
    IssuedCurrency,
    XRP,
)
from xrpl.models.requests import (
    AccountLines,
    AccountOffers,
    BookOffers,
)
from xrpl.models.transactions import OfferCreate
from xrpl.utils import (
    drops_to_xrp,
    get_balance_changes,
    xrp_to_drops,
)


async def main() -> int:
    # Define the network client
    async with AsyncWebsocketClient("wss://s.altnet.rippletest.net:51233") as client:
        # Get credentials from the Testnet Faucet -----------------------------------
        print("Requesting addresses from the Testnet faucet...")
        wallet = await generate_faucet_wallet(client, debug=True)

        # Define the proposed trade. ------------------------------------------------
        # Technically you don't need to specify the amounts (in the "value" field)
        # to look up order books using book_offers, but for this tutorial we reuse
        # these variables to construct the actual Offer later.
        #
        # Note that XRP is represented as drops, whereas any other currency is
        # represented as a decimal value.
        we_want = {
            "currency": IssuedCurrency(
                currency="TST",
                issuer="rP9jPyP5kyvFRb6ZiRghAGw5u8SGAmU4bd"
            ),
            "value": "25",
        }

        we_spend = {
            "currency": XRP(),
            # 25 TST * 10 XRP per TST * 15% financial exchange (FX) cost
            "value": xrp_to_drops(25 * 10 * 1.15),
        }

        # "Quality" is defined as TakerPays / TakerGets. The lower the "quality"
        # number, the better the proposed exchange rate is for the taker.
        # The quality is rounded to a number of significant digits based on the
        # issuer's TickSize value (or the lesser of the two for token-token trades).
        proposed_quality = Decimal(we_spend["value"]) / Decimal(we_want["value"])

        # Look up Offers. -----------------------------------------------------------
        # To buy TST, look up Offers where "TakerGets" is TST:
        print("Requesting orderbook information...")
        orderbook_info = await client.request(
            BookOffers(
                taker=wallet.address,
                ledger_index="current",
                taker_gets=we_want["currency"],
                taker_pays=we_spend["currency"],
                limit=10,
            )
        )
        print(f"Orderbook:\n{pprint.pformat(orderbook_info.result)}")

        # Estimate whether a proposed Offer would execute immediately, and...
        # If so, how much of it? (Partial execution is possible)
        # If not, how much liquidity is above it? (How deep in the order book would
        # other Offers have to go before ours would get taken?)
        # Note: These estimates can be thrown off by rounding if the token issuer
        # uses a TickSize setting other than the default (15). In that case, you
        # can increase the TakerGets amount of your final Offer to compensate.

        offers = orderbook_info.result.get("offers", [])
        want_amt = Decimal(we_want["value"])
        running_total = Decimal(0)
        if len(offers) == 0:
            print("No Offers in the matching book. Offer probably won't execute immediately.")
        else:
            for o in offers:
                if Decimal(o["quality"]) <= proposed_quality:
                    print(f"Matching Offer found, funded with {o.get('owner_funds')} "
                          f"{we_want['currency']}")
                    running_total += Decimal(o.get("owner_funds", Decimal(0)))
                    if running_total >= want_amt:
                        print("Full Offer will probably fill")
                        break
                else:
                    # Offers are in ascending quality order, so no others after this
                    # will match either
                    print("Remaining orders too expensive.")
                    break

            print(f"Total matched: {min(running_total, want_amt)} {we_want['currency']}")
            if 0 < running_total < want_amt:
                print(f"Remaining {want_amt - running_total} {we_want['currency']} "
                      "would probably be placed on top of the order book.")

        if running_total == 0:
            # If part of the Offer was expected to cross, then the rest would be placed
            # at the top of the order book. If none did, then there might be other
            # Offers going the same direction as ours already on the books with an
            # equal or better rate. This code counts how much liquidity is likely to be
            # above ours.
            #
            # Unlike above, this time we check for Offers going the same direction as
            # ours, so TakerGets and TakerPays are reversed from the previous
            # book_offers request.

            print("Requesting second orderbook information...")
            orderbook2_info = await client.request(
                BookOffers(
                    taker=wallet.address,
                    ledger_index="current",
                    taker_gets=we_spend["currency"],
                    taker_pays=we_want["currency"],
                    limit=10,
                )
            )
            print(f"Orderbook2:\n{pprint.pformat(orderbook2_info.result)}")

            # Since TakerGets/TakerPays are reversed, the quality is the inverse.
            # You could also calculate this as 1 / proposed_quality.
            offered_quality = Decimal(we_want["value"]) / Decimal(we_spend["value"])

            tally_currency = we_spend["currency"]
            if isinstance(tally_currency, XRP):
                tally_currency = f"drops of {tally_currency}"

            offers2 = orderbook2_info.result.get("offers", [])
            running_total2 = Decimal(0)
            if len(offers2) == 0:
                print("No similar Offers in the book. Ours would be the first.")
            else:
                for o in offers2:
                    if Decimal(o["quality"]) <= offered_quality:
                        print(f"Existing offer found, funded with {o.get('owner_funds')} "
                              f"{tally_currency}")
                        running_total2 += Decimal(o.get("owner_funds", Decimal(0)))
                    else:
                        print("Remaining orders are below where ours would be placed.")
                        break

                print(f"Our Offer would be placed below at least {running_total2} "
                      f"{tally_currency}")
                if 0 < running_total2 < want_amt:
                    print(f"Remaining {want_amt - running_total2} {tally_currency} "
                          "will probably be placed on top of the order book.")

        # Send OfferCreate transaction ----------------------------------------------

        # For this tutorial, we already know that TST is pegged to
        # XRP at a rate of approximately 10:1 plus spread, so we use
        # hard-coded TakerGets and TakerPays amounts.

        tx = OfferCreate(
            account=wallet.address,
            taker_gets=we_spend["value"],
            taker_pays=we_want["currency"].to_amount(we_want["value"]),
        )

        # Sign and autofill the transaction (ready to submit)
        signed_tx = await autofill_and_sign(tx, client, wallet)
        print("Transaction:", signed_tx)

        # Submit the transaction and wait for response (validated or rejected)
        print("Sending OfferCreate transaction...")
        result = await submit_and_wait(signed_tx, client)
        if result.is_successful():
            print(f"Transaction succeeded: "
                  f"https://testnet.xrpl.org/transactions/{signed_tx.get_hash()}")
        else:
            raise Exception(f"Error sending transaction: {result}")

        # Check metadata ------------------------------------------------------------
        balance_changes = get_balance_changes(result.result["meta"])
        print(f"Balance Changes:\n{pprint.pformat(balance_changes)}")

        # For educational purposes the transaction metadata is analyzed manually in the
        # following section. However, there is also a get_order_book_changes(metadata)
        # utility function available in the xrpl library, which is generally the easier
        # and preferred choice for parsing the metadata and computing orderbook changes.

        # Helper to convert an XRPL amount to a string for display
        def amt_str(amt) -> str:
            if isinstance(amt, str):
                return f"{drops_to_xrp(amt)} XRP"
            else:
                return f"{amt['value']} {amt['currency']}.{amt['issuer']}"

        offers_affected = 0
        for affnode in result.result["meta"]["AffectedNodes"]:
            if "ModifiedNode" in affnode:
                if affnode["ModifiedNode"]["LedgerEntryType"] == "Offer":
                    # Usually a ModifiedNode of type Offer indicates a previous Offer that
                    # was partially consumed by this one.
                    offers_affected += 1
            elif "DeletedNode" in affnode:
                if affnode["DeletedNode"]["LedgerEntryType"] == "Offer":
                    # The removed Offer may have been fully consumed, or it may have been
                    # found to be expired or unfunded.
                    offers_affected += 1
            elif "CreatedNode" in affnode:
                if affnode["CreatedNode"]["LedgerEntryType"] == "RippleState":
                    print("Created a trust line.")
                elif affnode["CreatedNode"]["LedgerEntryType"] == "Offer":
                    offer = affnode["CreatedNode"]["NewFields"]
                    print(f"Created an Offer owned by {offer['Account']} with "
                          f"TakerGets={amt_str(offer['TakerGets'])} and "
                          f"TakerPays={amt_str(offer['TakerPays'])}.")

        print(f"Modified or removed {offers_affected} matching Offer(s)")

        # Check balances ------------------------------------------------------------
        print("Getting address balances as of validated ledger...")
        balances = await client.request(
            AccountLines(
                account=wallet.address,
                ledger_index="validated",
            )
        )
        pprint.pp(balances.result)

        # Check Offers --------------------------------------------------------------
        print(f"Getting outstanding Offers from {wallet.address} "
              f"as of validated ledger...")
        acct_offers = await client.request(
            AccountOffers(
                account=wallet.address,
                ledger_index="validated",
            )
        )
        pprint.pp(acct_offers.result)

    # End main()
    return 0


if __name__ == "__main__":
    asyncio.run(main())

