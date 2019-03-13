# Configure rippled to Serve APIs Over LAN

<!-- DRAFT / INCOMPLETE PAGE. THESE INSTRUCTIONS MAY NOT WORK AS DESCRIBED. DO NOT TRUST THEM UNTIL THIS HAS BEEN MORE THOROUGHLY REVIEWED. -->

***TODO: Describe how to generate a self-signed cert and use certificate-pinning on the client side to protect against MITM attacks AND/OR describe how to use Let's Encrypt to get and renew a ceritificate automatically. In either case, instruct how to configure the server w/ the cert.***

**Warning:** This configuration comes with the additional downside that anyone on the LAN can sniff traffic between your machines, potentially gaining access to your secret keys. Do not use this configuration on a network that may have strangers on it. For example, on the LAN at a colocation facility or cloud host, other customers may be able to get access to the traffic between your machines. If you employ several developers sending test transactions, you could run one `rippled` machine for your whole office, while the developers use cheaper hardware, but any user on your office network could potentially use a packet sniffer to get access to developers' secret keys. ***TODO: with proper certs set up this mostly doesn't apply***

To use this configuration:

1. [Install `rippled`](install-rippled.html) on the chosen machine.

    Be sure that this machine meets the minimum [system requirements for `rippled`](system-requirements.html).

2. Configure the `rippled` machine to have a static IP address in your private LAN.

    Consult your network administrator for instructions for setting up a static IP in your LAN. If you do not have a static IP, you must change your config and restart `rippled` every time the machine's IP changes.

    With IPv4, private LAN addresses commonly start with `10.`, `192.168.`, or `172.(16 to 31).`. With IPv6, private LAN addresses typically start with `fc` or `fd`.

3. Configure the `rippled` machine to accept connections from your local private network.

    ***TODO: These configuration options need some adjustment***

    In the `rippled`'s config file, modify the `[port_rpc_admin_local]` and `[port_ws_admin_local]` stanzas to use your server's private-LAN address:

        [port_rpc_admin_local]
      	port = 5005
        # Change the IP port to match the server's static IP
      	ip = 10.1.10.13
        # Only the client with the following IP is treated as admin
      	admin = 10.1.10.2
      	protocol = http

        [port_ws_admin_local]
      	port = 6006
        # Change the IP port to match the server's static IP
      	ip = 10.1.10.13
        # Only the client with the following IP is treated as admin
      	admin = 10.1.10.2
      	protocol = ws

4. If your `rippled` machine runs a software firewall, configure the firewall to accept connections on your local private network at the JSON-RPC and Websocket ports you configured in the previous step. (Ports `5005` and `6006` in the previous example.)

    The exact configuration depends on your firewall software.

    If you use Network Address Translation (NAT), **do not** configure your router or hardware firewall to forward these ports from the outside.

5. On the machine(s) that will submit transactions, connect to your server using your `rippled` server's private IP address and the configured ports. Use the [sign method][] (for single signatures) or [sign_for method][] (for multi-signatures).

    The example configuration from the previous steps uses port `5005` for JSON-RPC connections and port `6006` for Websocket connections.


    ***TODO: cert pinning stuff here?***

6. Keep the `rippled` server running, updated, and in sync with the network while you're using it.

    **Note:** You _can_ turn off your `rippled` server when you're not sending transactions, but it can take up to 15 minutes to sync with the network when you start it up again.
