package main

import (
	"github.com/Peersyst/xrpl-go/xrpl/queries/utility"
	"github.com/Peersyst/xrpl-go/xrpl/rpc"
)

func main() {
	// Define the network client configuration
	cfg, err := rpc.NewClientConfig("https://s.altnet.rippletest.net:51234/")
	if err != nil {
		panic(err)
	}

	// Initiate the network client
	client := rpc.NewClient(cfg)

	// Ping the network (used to avoid Go unused variable error, but useful to check connectivity)
	_, err = client.Ping(&utility.PingRequest{})
	if err != nil {
		panic(err)
	}

}
