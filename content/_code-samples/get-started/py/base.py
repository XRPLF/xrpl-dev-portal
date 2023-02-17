import asyncio
from xrpl.asyncio.clients import AsyncWebsocketClient


async def main():
    # Define the network client
    async with AsyncWebsocketClient("wss://s.altnet.rippletest.net:51233") as client:
        # inside the context the client is open

        # ... custom code goes here

    # after exiting the context, the client is closed


asyncio.run(main())

