// Inspect the on-chain properties of a Trust Line token.
// Reads the issuer's AccountRoot (transfer rate, flags, domain, tick size),
// walks its trust lines for the given currency, and reconstructs the history
// of TransferRate changes from AccountSet transactions.
//
// Usage: go run ./inspect-trust-line-token [issuer] [currency]
package main

import (
	"encoding/hex"
	"fmt"
	"os"

	"github.com/Peersyst/xrpl-go/xrpl/queries/account"
	"github.com/Peersyst/xrpl-go/xrpl/queries/common"
	"github.com/Peersyst/xrpl-go/xrpl/websocket"
)

// Devnet example token from XRPLF/xrpl-dev-portal#3740.
const (
	defaultIssuer   = "ryWPRK3BqMovxEQSt5C3fXZkUCxrqVXgf"
	defaultCurrency = "USD"
	network         = "wss://s.devnet.rippletest.net:51233"
)

// AccountRoot flags that affect trust line token behavior.
// https://xrpl.org/docs/references/protocol/ledger-data/ledger-entry-types/accountroot#accountroot-flags
var accountRootFlags = []flag{
	{"lsfDefaultRipple", 0x00800000},
	{"lsfDepositAuth", 0x01000000},
	{"lsfDisallowIncomingTrustline", 0x20000000},
	{"lsfGlobalFreeze", 0x00400000},
	{"lsfNoFreeze", 0x00200000},
	{"lsfRequireAuth", 0x00040000},
	{"lsfRequireDestTag", 0x00020000},
	{"lsfAllowTrustLineClawback", 0x80000000},
}

type flag struct {
	name string
	bit  uint32
}

// accountTxRequest is a minimal wrapper for the account_tx method.
// The library does not ship a typed forward-paginated wrapper, so this
// implements the websocket Request interface inline.
type accountTxRequest struct {
	common.BaseRequest
	Account        string `json:"account"`
	LedgerIndexMin int    `json:"ledger_index_min"`
	LedgerIndexMax int    `json:"ledger_index_max"`
	Forward        bool   `json:"forward"`
	Limit          int    `json:"limit"`
	Marker         any    `json:"marker,omitempty"`
}

func (*accountTxRequest) Method() string  { return "account_tx" }
func (*accountTxRequest) Validate() error { return nil }
func (*accountTxRequest) APIVersion() int { return 2 }

// percentFromTransferRate converts a TransferRate from billionths to a
// percentage string. 0 or 1_000_000_000 → 0%. 2_000_000_000 → 100%.
func percentFromTransferRate(rate uint32) string {
	if rate == 0 || rate == 1_000_000_000 {
		return "0%"
	}
	return fmt.Sprintf("%.4f%%", float64(rate-1_000_000_000)/1e7)
}

// decodeFlags returns the flag names set in value.
func decodeFlags(value uint32, table []flag) []string {
	names := []string{}
	for _, f := range table {
		if value&f.bit != 0 {
			names = append(names, f.name)
		}
	}
	return names
}

// decodeHexDomain decodes an ASCII-hex Domain string, returning the raw value
// if it cannot be decoded.
func decodeHexDomain(raw string) string {
	if raw == "" {
		return "(none)"
	}
	if decoded, err := hex.DecodeString(raw); err == nil {
		return string(decoded)
	}
	return raw
}

type feeChange struct {
	LedgerIndex uint32
	TxHash      string
	Rate        uint32
	Percent     string
}

// fetchTransferRateHistory walks account_tx forward and records every
// AccountSet transaction that changes the issuer's TransferRate.
func fetchTransferRateHistory(client *websocket.Client, issuer string) ([]feeChange, error) {
	var history []feeChange
	var previous uint32
	var hasPrev bool
	var marker any

	for {
		resp, err := client.Request(&accountTxRequest{
			Account:        issuer,
			LedgerIndexMin: -1,
			LedgerIndexMax: -1,
			Forward:        true,
			Limit:          200,
			Marker:         marker,
		})
		if err != nil {
			return nil, err
		}

		txs, _ := resp.Result["transactions"].([]any)
		for _, entry := range txs {
			e, _ := entry.(map[string]any)
			tx, ok := e["tx_json"].(map[string]any)
			if !ok {
				tx, _ = e["tx"].(map[string]any)
			}
			if tx == nil || tx["TransactionType"] != "AccountSet" {
				continue
			}
			rateRaw, present := tx["TransferRate"]
			if !present {
				continue
			}
			rate := toUint32(rateRaw)
			if hasPrev && rate == previous {
				continue
			}
			history = append(history, feeChange{
				LedgerIndex: toUint32(e["ledger_index"]),
				TxHash:      stringOf(e["hash"]),
				Rate:        rate,
				Percent:     percentFromTransferRate(rate),
			})
			previous = rate
			hasPrev = true
		}

		nextMarker, ok := resp.Result["marker"]
		if !ok || nextMarker == nil {
			break
		}
		marker = nextMarker
	}
	return history, nil
}

func toUint32(v any) uint32 {
	switch t := v.(type) {
	case float64:
		return uint32(t)
	case int:
		return uint32(t)
	case int64:
		return uint32(t)
	case uint32:
		return t
	}
	return 0
}

func stringOf(v any) string {
	if s, ok := v.(string); ok {
		return s
	}
	return ""
}

func printIssuerSettings(data any) {
	root, _ := data.(map[string]any)
	rate := toUint32(root["TransferRate"])
	flags := toUint32(root["Flags"])
	decoded := decodeFlags(flags, accountRootFlags)

	fmt.Println("\n--- Issuer AccountRoot settings ---")
	fmt.Printf("  Address       : %v\n", root["Account"])
	fmt.Printf("  TransferRate  : %d (%s)\n", rate, percentFromTransferRate(rate))
	if ts, ok := root["TickSize"]; ok {
		fmt.Printf("  TickSize      : %v\n", ts)
	} else {
		fmt.Println("  TickSize      : (default)")
	}
	fmt.Printf("  Domain        : %s\n", decodeHexDomain(stringOf(root["Domain"])))
	fmt.Printf("  Flags value   : %d\n", flags)
	if len(decoded) == 0 {
		fmt.Println("  Flags decoded : (none set)")
	} else {
		fmt.Printf("  Flags decoded : %v\n", decoded)
	}
}

func printTrustLines(lines []any, currency string) {
	filtered := []map[string]any{}
	for _, l := range lines {
		line, _ := l.(map[string]any)
		if line["currency"] == currency {
			filtered = append(filtered, line)
		}
	}
	fmt.Printf("\n--- Trust lines for currency %s (%d shown) ---\n", currency, len(filtered))
	for _, line := range filtered {
		fmt.Printf("  Counterparty : %v\n", line["account"])
		fmt.Printf("    balance      : %v\n", line["balance"])
		fmt.Printf("    limit        : %v\n", line["limit"])
		fmt.Printf("    no_ripple    : %v\n", line["no_ripple"] == true)
		fmt.Printf("    freeze       : %v\n", line["freeze"] == true)
		fmt.Printf("    authorized   : %v\n", line["authorized"] == true)
	}
}

func printFeeHistory(history []feeChange) {
	fmt.Printf("\n--- TransferRate history (%d changes) ---\n", len(history))
	if len(history) == 0 {
		fmt.Println("  No AccountSet transactions modified TransferRate.")
		return
	}
	for _, h := range history {
		fmt.Printf("  Ledger %d  →  %s  (tx %s)\n", h.LedgerIndex, h.Percent, h.TxHash)
	}
}

// accountLinesRequest is a minimal wrapper for account_lines.
type accountLinesRequest struct {
	common.BaseRequest
	Account     string                 `json:"account"`
	LedgerIndex common.LedgerSpecifier `json:"ledger_index,omitempty"`
}

func (*accountLinesRequest) Method() string  { return "account_lines" }
func (*accountLinesRequest) Validate() error { return nil }
func (*accountLinesRequest) APIVersion() int { return 2 }

func main() {
	issuer := defaultIssuer
	currency := defaultCurrency
	if len(os.Args) > 1 {
		issuer = os.Args[1]
	}
	if len(os.Args) > 2 {
		currency = os.Args[2]
	}

	client := websocket.NewClient(
		websocket.NewClientConfig().WithHost(network),
	)
	defer client.Disconnect()
	if err := client.Connect(); err != nil {
		panic(err)
	}
	fmt.Printf("Inspecting %s.%s on %s\n", currency, issuer, network)

	info, err := client.GetAccountInfo(&account.InfoRequest{Account: issuer})
	if err != nil {
		panic(err)
	}
	// account_data is exposed as a typed struct; marshal via generic map to
	// keep the printing helpers dialect-agnostic.
	printIssuerSettings(map[string]any{
		"Account":      info.AccountData.Account,
		"TransferRate": info.AccountData.TransferRate,
		"TickSize":     info.AccountData.TickSize,
		"Domain":       info.AccountData.Domain,
		"Flags":        info.AccountData.Flags,
	})

	linesResp, err := client.Request(&accountLinesRequest{
		Account:     issuer,
		LedgerIndex: common.Validated,
	})
	if err != nil {
		panic(err)
	}
	lines, _ := linesResp.Result["lines"].([]any)
	printTrustLines(lines, currency)

	history, err := fetchTransferRateHistory(client, issuer)
	if err != nil {
		panic(err)
	}
	printFeeHistory(history)
}
