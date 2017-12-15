#Build and Run `rippled` on Ubuntu 15.04 and Later

`rippled` is the core peer-to-peer server that manages the XRP Ledger. A `rippled` server can connect to a network of peers, relay cryptographically signed transactions, and maintain a local copy of the complete shared global ledger.

For an overview of `rippled`, see [Operating rippled Servers](tutorial-rippled-setup.html)

Use these instructions to build a `rippled` binary file and run it as a stock `rippled` server on Ubuntu. These instructions use Ubuntu's APT (Advanced Packaging Tool) to install software prerequisites. These instructions were tested on Ubuntu 16.04 LTS.

For information about building `rippled` for other platforms, see [Builds](https://github.com/ripple/rippled/tree/develop/Builds) in the `rippled` GitHub repository.

##System Requirements

Ripple recommends meeting the following **minimum** system requirements for building and running `rippled`.

**_To build rippled:_**

* RAM: 8GB

**_To run rippled:_**

* CPU: 64-bit x86_64, 2+ cores
* Disk: 50GB SSD with 500 IOPS for the database partition
* RAM: 4GB
* Network: A fast network connection is preferable.

If you are running `rippled` in an Amazon EC2 instance, Ripple recommends selecting a **Type** of **_m3.large_**. Keep in mind that if you choose to run a validating `rippled` server, you may need more resources. Naturally, your server's workload determines the resources it requires.

##Build and Run `rippled`

<ol>
<li><p>Update list of packages that can be installed or upgraded.</p>
<pre>
sudo apt-get update
</pre>
<br/>
</li>
<li><p>Retrieve and upgrade currently installed packages.</p>
<pre>
sudo apt-get -y upgrade
</pre>
<br/>
</li>
<li>
<p>Install git.</p>
<pre>
sudo apt-get -y install git
</pre>
<br/></li>
<li><p>Install SCons.</p>
<pre>
sudo apt-get -y install scons
</pre>
<br/></li>
<li>
<p>Install Ctags.</p>
<pre>
sudo apt-get -y install ctags
</pre>
<br/></li>
<li>
<p>Install <code>pkg-config</code>.</p>
<pre>
sudo apt-get -y install pkg-config
</pre>
<br/></li>
<li>
<p>Install Protocol Buffers.</p>
<pre>
sudo apt-get -y install protobuf-compiler
sudo apt-get -y install libprotobuf-dev
</pre>
<br/></li>
<li>
<p>
Install SSL.</p>
<pre>
sudo apt-get -y install libssl-dev
</pre>
<br/></li>
<li>
<p>Install <code>python-software properties</code>. Provides the <code>add-apt-repository</code> binary that you'll need to install Boost.</p>
<pre>
sudo apt-get install -y python-software-properties
</pre>
<br/></li>
<li>
<p>Install Boost.</p>
<pre>
sudo add-apt-repository -y ppa:boost-latest/ppa
sudo apt-get -y update
sudo apt-get install -y libboost-all-dev
</pre>
<br/></li>
<li>
<p>Get <code>rippled</code> source code.</p>
<pre>
git clone https://github.com/ripple/rippled.git
cd rippled
git checkout master
</pre>
<br/></li>
<li>
<p>Build <code>rippled</code> binary executable from source code. This may take about 30 minutes.</p>
<pre>
scons
</pre>
<br/></li>
<li>
<p>Configure <code>rippled.cfg</code>.</p>
<p><code>rippled.cfg</code> is the configuration file for <code>rippled</code>.</p>
<p>You can find an example configuration file (<code>rippled-example.cfg</code>) in <code>rippled/doc</code>. See the file for a description of all configuration options. You should be able to connect to the XRP Ledger using the default configuration defined in the example file.</p>
<p>Put <code>rippled.cfg</code> in <code>etc/opt/ripple/</code>.</p>
</li>
<li>
<p>Configure <code>validators.txt</code>.</p>
<p>When you start <code>rippled</code> for the first time, it uses an initial list of validators defined in <code>validators.txt</code> to retrieve validation information and form its UNL (unique node list). <code>validators.txt</code> also enables <code>rippled</code> clients to indirectly locate IPs they can use to contact the Ripple network.</p>
<p>You can find an example validators file (<code>validators-example.txt</code>) in <code>rippled/doc</code>. See the file for a description of all validator options. You should be able to connect to the XRP Ledger using the default validators defined in the example file.</p>
<p>Put <code>validators.txt</code> in <code>etc/opt/ripple/</code>.</p>
</li>
<li>
<p>Run <code>rippled</code>.</p>
<pre>
cd build
sudo ./rippled
</pre>
<p>You are now running a stock <code>rippled</code> server.</p>
</li>
</ol>

##Verify Your Running Instance

Here are excerpts of what you can expect to see in your terminal once `rippled` is running and connected to the XRP Ledger:

```
Loading: "/etc/opt/ripple/rippled.cfg"
Watchdog: Launching child 1
2017-Dec-15 18:27:37 JobQueue:NFO Auto-tuning to 4 validation/transaction/proposal threads for non-validator.
2017-Dec-15 18:27:37 Amendments:DBG Amendment C6970A8B603D8778783B61C0D445C23D1633CCFAEF0D43E7DBCD1521D34BD7C3 is supported.
2017-Dec-15 18:27:37 Amendments:DBG Amendment 4C97EBA926031A7CF7D7B36FDE3ED66DDA5421192D63DE53FFB46E43B9DC8373 is supported.

...

2017-Dec-15 18:27:37 ValidatorList:DBG Loading configured trusted validator list publisher keys

...

2017-Dec-15 18:27:37 ValidatorList:DBG Loading configured validator keys

...

2017-Dec-15 18:27:37 ValidatorSite:DBG Loading configured validator list sites

...

2017-Dec-15 18:27:38 LedgerConsensus:NFO Entering consensus process, watching, synced=no

...

2017-Dec-15 18:27:40 LedgerConsensus:WRN
{
	"accepted" : true,
	"account_hash" : "183D5235C7C1FB5AE67AD2F6CC3B28F5FB86E8C4F89DB50DD85641A96470534E",
	"close_flags" : 0,
	"close_time" : 566677650,
	"close_time_human" : "2017-Dec-15 18:27:30",
	"close_time_resolution" : 30,
	"closed" : true,
	"hash" : "014816C71F4B9AD5924AFBD7B02E0DF1522C4BC4BC45A69F97F51D4F2234FA10",
	"ledger_hash" : "014816C71F4B9AD5924AFBD7B02E0DF1522C4BC4BC45A69F97F51D4F2234FA10",
	"ledger_index" : "2",
	"parent_close_time" : 0,
	"parent_hash" : "AB868A6CFEEC779C2FF845C0AF00A642259986AF40C01976A7F842B6918936C7",
	"seqNum" : "2",
	"totalCoins" : "100000000000000000",
	"total_coins" : "100000000000000000",
	"transaction_hash" : "0000000000000000000000000000000000000000000000000000000000000000"
}

...

2017-Dec-15 18:27:48 LedgerConsensus:WRN Need consensus ledger BD5DA7BE8633FCBBBBD58BA62569397BCEE73848FD6068581F5E795243FDFF0B
2017-Dec-15 18:27:50 NetworkOPs:WRN We are not running on the consensus ledger
2017-Dec-15 18:27:50 LedgerConsensus:WRN Need consensus ledger 8459443546CCBE4E89A41E1D0C17F24FBEA7B344C1ED6A26292B4C5CD19B4321
2017-Dec-15 18:27:53 NetworkOPs:WRN We are not running on the consensus ledger

...

2017-Dec-15 18:38:28 OpenLedger:WRN Offer involves frozen asset
2017-Dec-15 18:38:28 OpenLedger:WRN Offer involves frozen asset
2017-Dec-15 18:38:31 LedgerConsensus:WRN Offer involves frozen asset
2017-Dec-15 18:38:31 LedgerConsensus:WRN Offer involves frozen asset
```

##Explore Next Steps

Now that you have a stock `rippled` server running, you may want to consider running it as a validating server. See the [rippled Setup Tutorial](tutorial-rippled-setup.html) for information about validating servers and why you might want to run one.

For information about updating and maintaining your `rippled` server, see [Updating rippled](tutorial-rippled-setup.html#updating-rippled).

For information about using the `rippled` API, see [rippled](reference-rippled.html).
