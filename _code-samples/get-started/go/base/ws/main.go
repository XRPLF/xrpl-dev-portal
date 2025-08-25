package main

import (
    "fmt"

    "github.com/Peersyst/xrpl-go/xrpl/websocket"
)

func main() {

    // Define the network client
	client := websocket.NewClient(websocket.NewClientConfig().
		WithHost("wss://s.altnet.rippletest.net:51233").
		WithFaucetProvider(faucet.NewTestnetFaucetProvider()),
	)

    // Disconnect the client when done. (Defer executes at the end of the function)
    defer client.Disconnect()

    // Connect to the network
    if err := client.Connect(); err != nil {
        fmt.Println(err)
        return
    }

    // ... custom code goes here
}
