// Inspect the on-chain properties of a Multi-Purpose Token (MPT).
// Reads the MPTokenIssuance ledger entry, decodes flags, formats the transfer
// fee, and decodes the XLS-89 metadata blob.
//
// Usage: go run ./inspect-mpt [mpt_issuance_id]
package main

import (
	"encoding/hex"
	"encoding/json"
	"fmt"
	"os"

	"github.com/Peersyst/xrpl-go/xrpl/queries/common"
	"github.com/Peersyst/xrpl-go/xrpl/websocket"
)

// Devnet example MPT from XRPLF/xrpl-dev-portal#3740.
const (
	defaultIssuanceID = "002A2749DE74AF5C22DC62DF3E2E95D64B9A9E305C092CE8"
	network           = "wss://s.devnet.rippletest.net:51233"
)

// MPTokenIssuance flags.
// https://xrpl.org/docs/references/protocol/ledger-data/ledger-entry-types/mptokenissuance#mptokenissuance-flags
var mptIssuanceFlags = []flag{
	{"lsfMPTLocked", 0x00000001},
	{"lsfMPTCanLock", 0x00000002},
	{"lsfMPTRequireAuth", 0x00000004},
	{"lsfMPTCanEscrow", 0x00000008},
	{"lsfMPTCanTrade", 0x00000010},
	{"lsfMPTCanTransfer", 0x00000020},
	{"lsfMPTCanClawback", 0x00000040},
}

type flag struct {
	name string
	bit  uint32
}

// mptIssuanceEntryRequest looks up an MPTokenIssuance ledger entry by its ID.
// The library's GetLedgerEntry() only accepts a ledger entry ID, so this uses
// the generic Request() method.
type mptIssuanceEntryRequest struct {
	common.BaseRequest
	MPTIssuance string                 `json:"mpt_issuance"`
	LedgerIndex common.LedgerSpecifier `json:"ledger_index,omitempty"`
}

func (*mptIssuanceEntryRequest) Method() string  { return "ledger_entry" }
func (*mptIssuanceEntryRequest) Validate() error { return nil }
func (*mptIssuanceEntryRequest) APIVersion() int { return 2 }

// percentFromTransferFee converts an MPT TransferFee from tenths of a basis
// point to a percentage string. 0 → 0%, 50_000 → 50%.
func percentFromTransferFee(fee uint32) string {
	if fee == 0 {
		return "0%"
	}
	return fmt.Sprintf("%.3f%%", float64(fee)/1000)
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

func toUint32(v any) uint32 {
	switch t := v.(type) {
	case float64:
		return uint32(t)
	case int:
		return uint32(t)
	case uint32:
		return t
	}
	return 0
}

func stringOr(v any, fallback string) string {
	if s, ok := v.(string); ok && s != "" {
		return s
	}
	return fallback
}

func printIssuance(node map[string]any) {
	flags := toUint32(node["Flags"])
	fee := toUint32(node["TransferFee"])
	decoded := decodeFlags(flags, mptIssuanceFlags)

	fmt.Println("\n--- MPTokenIssuance ---")
	fmt.Printf("  Issuer            : %v\n", node["Issuer"])
	fmt.Printf("  AssetScale        : %v\n", node["AssetScale"])
	fmt.Printf("  MaximumAmount     : %s\n", stringOr(node["MaximumAmount"], "(unlimited: 2^63 - 1)"))
	fmt.Printf("  OutstandingAmount : %s\n", stringOr(node["OutstandingAmount"], "0"))
	fmt.Printf("  LockedAmount      : %s\n", stringOr(node["LockedAmount"], "0"))
	fmt.Printf("  TransferFee       : %d (%s)\n", fee, percentFromTransferFee(fee))
	fmt.Printf("  Flags value       : %d\n", flags)
	if len(decoded) == 0 {
		fmt.Println("  Flags decoded     : (none set)")
	} else {
		fmt.Printf("  Flags decoded     : %v\n", decoded)
	}
}

// printMetadata hex-decodes MPTokenMetadata and pretty-prints it as JSON if it
// parses. Falls back to the raw hex otherwise.
//
// XLS-89 defines both long field names (ticker, name, desc, ...) and compact
// short keys (t, n, d, ...). The xrpl-go SDK does not yet ship a helper that
// expands the compact keys, so this prints whichever form the issuer stored.
func printMetadata(hexBlob string) {
	fmt.Println("\n--- MPTokenMetadata (XLS-89) ---")
	if hexBlob == "" {
		fmt.Println("  (none)")
		return
	}
	raw, err := hex.DecodeString(hexBlob)
	if err != nil {
		fmt.Printf("  Failed to hex-decode: %v\n", err)
		fmt.Printf("  Raw hex: %s\n", hexBlob)
		return
	}
	var parsed any
	if err := json.Unmarshal(raw, &parsed); err != nil {
		fmt.Printf("  Not valid JSON: %v\n", err)
		fmt.Printf("  Raw text: %s\n", string(raw))
		return
	}
	pretty, _ := json.MarshalIndent(parsed, "", "  ")
	fmt.Println(string(pretty))
}

func main() {
	issuanceID := defaultIssuanceID
	if len(os.Args) > 1 {
		issuanceID = os.Args[1]
	}

	client := websocket.NewClient(
		websocket.NewClientConfig().WithHost(network),
	)
	defer client.Disconnect()
	if err := client.Connect(); err != nil {
		panic(err)
	}
	fmt.Printf("Inspecting MPT %s on %s\n", issuanceID, network)

	resp, err := client.Request(&mptIssuanceEntryRequest{
		MPTIssuance: issuanceID,
		LedgerIndex: common.Validated,
	})
	if err != nil {
		panic(err)
	}
	node, _ := resp.Result["node"].(map[string]any)
	printIssuance(node)
	printMetadata(stringOr(node["MPTokenMetadata"], ""))

	// MPT issuance fields (except lsfMPTLocked) are immutable in MPTokensV1.
	// XLS-94 (dynamic MPT) will add mutability — historical inspection will
	// become useful then.
	fmt.Println("\nNote: MPT issuance fields are immutable in MPTokensV1;")
	fmt.Println("      dynamic mutation is proposed in XLS-94.")
}
