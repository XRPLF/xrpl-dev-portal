# Airgapped Wallet
Airgapped describes a state where a device or a system becomes fully disconnected from other devices and systems. It is the maximum protection for a system against unwanted visitors/viruses, this allows any sensitive data like a private key to be stored without worry of it being compromised as long as reasonable security practices are being practiced.

This airgapped XRP wallet allows users to sign a Payment transaction in a secure environment without the private key being exposed to a machine connected to the internet. The private key and seed is encrypted by password and stored securely.

*Note*: You should not use this airgapped wallet in production, it should only be used for educational purposes only. 

This code sample consists of 2 parts:

- `airgapped-wallet.js` - This code should be stored in a standalone airgapped machine, it consist of features to generate a wallet, store a keypair securely, sign a transaction and share the signed transaction via QR code.
- `relay-transaction.js` - This code could be stored in any online machine, no credentials is stored on this code other than a signed transaction which would be sent to an XRPL node for it to be validated on the ledger.

Preferably, `airgapped-wallet.js` should be on a Linux machine while `relay-transaction.js` could be on any operating system.

# Security Practices
Strongly note that an airgapped system's security is not determined by its code alone but the security practices that are being followed by an operator.

There are channels that can be maliciously used by outside parties to infiltrate an airgapped system and steal sensitive information.

There are other ways malware could interact across airgapped networks, but they all involve an infected USB drive or a similar device introducing malware onto the airgapped machine. They could also involve a person physically accessing the computer, compromising it and installing malware or modifying its hardware.

This is why it is also recommended to encrypt sensitive information being stored in an airgapped machine.

The airgapped machine should have a few rules enforced to close any possible channels getting abused to leak information outside of the machine:

### Wifi

- Disable any wireless networking hardware on the airgapped machine. For example, if you have a desktop PC with a Wifi card, open the PC and remove the Wifi hardware. If you cannot do that, you could go to the system’s BIOS or UEFI firmware and disable the Wifi hardware.

### BlueTooth

- BlueTooth can be maliciously used by neighboring devices to steal data from an airgapped machine. It is recommended to remove or disable the BlueTooth hardware.  

### USB

- The USB port can be used to transfer files in and out of the airgapped machine and this may act as a threat to an airgapped machine if the USB drive is infected with a malware. So after installing & setting up this airgapped wallet, it is highly recommended to block off all USB ports by using a USB blocker and not use them.

Do not reconnect the airgapped machine to a network, even when you need to transfer files! An effective airgapped machine should only serve 1 purpose, which is to store data and never open up a gateway for hackers to abuse and steal data.

# Tutorial
For testing purposes, you would need to have 2 machines and 1 phone in hand to scan the QR code.

1. 1st machine would be airgapped, following the security practices written [here](#security-practices). It stores and manages an XRPL Wallet. 
2. 2nd machine would be a normal computer connected to the internet. It relays a signed transaction blob to a rippled node.
3. The phone would be used to scan a QR code, which contains a signed transaction blob. The phone would transmit it to the 2nd machine.

The diagram below shows you the process of submitting a transaction to the XRPL:
<p align="center">
  <img src="https://user-images.githubusercontent.com/87929946/197970678-2a1b7f7e-d91e-424e-915e-5ba7d34689cc.png" width=75% height=75%>
</p>

# Setup
- Machine 1 - An airgapped computer (during setup, it must be connected to the internet to download the files)
- Machine 2 - A normal computer connected to the internet
- Phone - A normal phone with a working camera to scan a QR

## Machine 1 Setup
Since this machine will be airgapped, it is best to use Linux as the Operating System.

1. Clone all the files under the [`airgapped-wallet`](https://github.com/XRPLF/xrpl-dev-portal/tree/master/_code-samples/airgapped-wallet/js) directory

2. Import all the modules required by running: `npm install`

3. Airgap the machine by following the security practices written [here](#security-practices).

4. Run `node airgapped-wallet.js`

5. Scan the QR code and fund the account using the [testnet faucet](https://test.bithomp.com/faucet/) 

6. Re-run the script and input '1' to generate a new transaction by following the instructions.

7. Use your phone to scan the QR code, then to send the signed transaction to Machine 2 for submission

## Phone Setup
The phone requires a working camera that is able to scan a QR code and an internet connection for it to be able to transmit the signed transaction blob to Machine 2.

Once you have signed a transaction in the airgapped machine, a QR code will be generated which will contain the signed transaction blob. Example:

<img src="https://user-images.githubusercontent.com/87929946/196018292-f210a9f2-c5f8-412e-98c1-361a72286378.png" width=20% height=20%>

Scan the QR code using the phone, copy it to the clipboard,  and transmit it to Machine 2, which will then be sending it to a rippled node.

You can send a message to yourself using Discord, WhatsApp or even e-mail, then open up the message using Machine 2 to receive the signed transaction blob.

## Machine 2 Setup
This machine will be used to transmit a signed transaction blob from Machine 1, it would require internet access.

1. Clone all the files under the [`airgapped-wallet`](https://github.com/XRPLF/xrpl-dev-portal/tree/master/_code-samples/airgapped-wallet/js) directory

2. Import all the modules required by running `npm install`

3. Run `relay-transaction.js` and copy-and-paste the received output of Machine 1 when prompted
