
// Set up client ----------------------

package main

import (
	"fmt"
	"strconv"
	"github.com/Peersyst/xrpl-go/xrpl/currency"
	"github.com/Peersyst/xrpl-go/xrpl/queries/account"
	"github.com/Peersyst/xrpl-go/xrpl/queries/server"
	"github.com/Peersyst/xrpl-go/xrpl/transaction/types"
	"github.com/Peersyst/xrpl-go/xrpl/websocket"
)

func main() {
	client := websocket.NewClient(
		websocket.NewClientConfig().
			WithHost("wss://xrplcluster.com"),
	)
	defer client.Disconnect()

	if err := client.Connect(); err != nil {
		panic(err)
	}

	// Look up reserve values ----------------------

	res, err := client.Request(&server.StateRequest{})
	if err != nil {
		panic(err)
	}
	var serverState server.StateResponse
	if err := res.GetResult(&serverState); err != nil {
		panic(err)
	}

	baseReserve := serverState.State.ValidatedLedger.ReserveBase
	reserveInc := serverState.State.ValidatedLedger.ReserveInc

	baseReserveXrp, err := currency.DropsToXrp(strconv.FormatUint(uint64(baseReserve), 10))
	if err != nil {
		panic(err)
	}
	reserveIncXrp, err := currency.DropsToXrp(strconv.FormatUint(uint64(reserveInc), 10))
	if err != nil {
		panic(err)
	}

	fmt.Printf("Base reserve: %v XRP\n", baseReserveXrp)
	fmt.Printf("Incremental reserve: %v XRP\n", reserveIncXrp)

	// Look up owner count ----------------------

	address := types.Address("rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn") // replace with any address
	accountInfo, err := client.GetAccountInfo(&account.InfoRequest{Account: address})
	if err != nil {
		panic(err)
	}

	ownerCount := accountInfo.AccountData.OwnerCount

	// Calculate total reserve ----------------------

	totalReserve := baseReserve + (uint(ownerCount) * reserveInc)

	totalReserveXrp, err := currency.DropsToXrp(strconv.FormatUint(uint64(totalReserve), 10))
	if err != nil {
		panic(err)
	}

	fmt.Printf("Owner count: %v\n", ownerCount)
	fmt.Printf("Total reserve: %v XRP\n", totalReserveXrp)
}
