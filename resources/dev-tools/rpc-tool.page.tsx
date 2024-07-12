import { useThemeHooks } from '@redocly/theme/core/hooks';
import { Link } from '@redocly/theme/components/Link/Link';
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import JsonView from 'react18-json-view'
import { Client, isValidAddress } from 'xrpl'

import { RPCResponseGroup } from './components/rpc-tool/rpc-response-group';
import { clsx } from 'clsx';

export const frontmatter = {
  seo: {
    title: 'RPC Tool',
    description: "Quickly query several key details about an XRP Ledger account or transaction",
  }
};

export default function RpcTool() {
  const { hash: slug } = useLocation();
  const [accountInfoResponse, setAccountInfoResponse] = useState(null);
  const [accountLinesResponse, setAccountLinesResponse] = useState(null);
  const [accountTxResponse, setAccountTxResponse] = useState(null);
  const [accountObjectsResponse, setAccountObjectsResponse] = useState(null);
  const [txResponse, setTxResponse] = useState(null);
  const [ledgerResponse, setLedgerResponse] = useState(null);
  const [inputText, setInputText] = useState(slug ? slug.slice(1) : "");
  const [errorText, setErrorText] = useState(null);
  const { useTranslate } = useThemeHooks();
  const { translate } = useTranslate();
  const [inputType, setInputType] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [progressBarWidth, setProgressBarWidth] = useState("0%");

  const FULL_HISTORY_SERVER = "wss://s2.ripple.com";
  const reTxId = /^[0-9A-Fa-f]{64}$/;
  const reLedgerSeq = /^[0-9]+$/;

  /*
    XRPL requests
    * account_info
    * account_lines
    * account_tx
    * account_objects
    * tx
    * ledger
  */

  const accountInfo = async (
    client: Client,
    address: string
  ): Promise<void> => {
    const response = await client.request({
      command: "account_info",
      account: address,
    });
    setProgressBarWidth("20%");
    setAccountInfoResponse(response);
  };

  const accountLines = async (
    client: Client,
    address: string
  ): Promise<void> => {
    const response = await client.request({
      command: "account_lines",
      account: address,
    });
    setProgressBarWidth("40%");
    setAccountLinesResponse(response);
  };

  const accountTx = async (
    client: Client,
    address: string
  ): Promise<void> => {
    const response = await client.request({
      command: "account_tx",
      account: address,
      ledger_index_min: -1,
      ledger_index_max: -1,
      binary: false,
      limit: 20,
      forward: false,
    });
    setProgressBarWidth("60%");
    setAccountTxResponse(response);
  };

  const accountObjects = async (
    client: Client,
    address: string
  ): Promise<void> => {
    const response = await client.request({
      command: "account_objects",
      account: address,
    });
    setProgressBarWidth("80%");
    setAccountObjectsResponse(response);
  };

  const tx = async (
    client: Client,
    transactionId: string
  ): Promise<void> => {
    const response = await client.request({
      command: "tx",
      transaction: transactionId,
      binary: false,
    });
    setProgressBarWidth("100%");
    setTxResponse(response);
  };

  const ledger = async (
    client: Client,
    ledgerSequence: string
  ): Promise<void> => {
    const response = await client.request({
      command: "ledger",
      ledger_index: parseInt(ledgerSequence),
      transactions: true,
      expand: true,
    });
    setProgressBarWidth("100%");
    setLedgerResponse(response);
  };

  useEffect(() => {
    if (slug && slug !== "") {
      getInfo();
    }
  }, []);

  const getInfo = async (): Promise<void> => {
    setAccountInfoResponse(null);
    setAccountLinesResponse(null);
    setAccountTxResponse(null);
    setAccountObjectsResponse(null);
    setTxResponse(null);
    setLedgerResponse(null);
    setErrorText(null);
    setShowResult(true);
    setProgressBarWidth("0%");

    const client = new Client(FULL_HISTORY_SERVER);
    await client.connect();

    if (isValidAddress(inputText)) {
      // Example input: rh3VLyj1GbQjX7eA15BwUagEhSrPHmLkSR
      setInputType("accounts");
      setErrorText("");

      setProgressBarWidth("10%");

      // account_info
      await accountInfo(client, inputText);

      // account_lines
      await accountLines(client, inputText);

      // account_tx
      await accountTx(client, inputText);

      // account_objects
      await accountObjects(client, inputText);
      setProgressBarWidth("100%");
    } else if (reTxId.test(inputText)) {
      // Example input: A25795C88E176FFF85B8D595D1960229F4ACC825BAE634ADF38F6AE38E0D24D8
      setInputType("transactions");
      setErrorText("");
      setProgressBarWidth("10%");

      // tx
      await tx(client, inputText);
    } else if (reLedgerSeq.test(inputText)) {
      // Example input: 131524184
      setInputType("ledgers");
      setErrorText("");
      setProgressBarWidth("10%");

      // ledger
      await ledger(client, inputText);
    } else {
      setProgressBarWidth("100%");

      setErrorText("Input is not a valid address or transaction hash");
    }

    await client.disconnect();
  };

  return (
    <div className="container-fluid rpc-tool" role="document" id="main_content_wrapper">
      <div className="row">
        <main
          className="main order-md-3"
          role="main"
          id="main_content_body"
        >
          <section className="container-fluid pt-3 p-md-3">
            <h1>{translate('RPC Tool')}</h1>
            <div className="content">
              <p>
                {translate(
                  "This is a debug tool for printing raw information about an account (by classic address), a transaction (by hash) or a ledger (by sequence number)."
                )}
              </p>
              <div className="input-group">
                <input
                  onChange={(event) => setInputText(event.target.value)}
                  value={inputText}
                  id="target"
                  className="form-control"
                  required
                  type="text"
                  placeholder={translate(
                    "XRP Ledger address, transaction ID, or ledger index"
                  )}
                />
              </div>
              <span className="help-block">
                <small>
                  {translate("resourses.rpc-tool.help-block.part1", "Try an account like ")}
                  <em>rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn</em>
                  {translate("resourses.rpc-tool.help-block.part2", ".")}
                </small>
              </span>&nbsp;
              <button className="btn btn-primary" onClick={getInfo}>
                {translate("Get info")}
              </button>
              {showResult && (
                <div id="result">
                  <h2>{translate("Result")}</h2>
                    <div
                    id="progress"
                    className="progress"
                    style={
                      progressBarWidth === "100%" ?
                        { transition: 'opacity 0.5s ease-out', opacity: 0, } :
                        { opacity: 1 }
                    }
                  >
                    <div
                      className="progress-bar progress-bar-striped progress-bar-animated"
                      role="progressbar"
                      style={{
                        width: progressBarWidth,
                      }}
                    />
                  </div>

                  {errorText && (
                    <div id="error" className="devportal-callout warning">
                      {translate(errorText)}
                    </div>
                  )}
                  {errorText === "" && (
                    <ul id="links" className="nav nav-pills">
                      <li className="nav-link">
                        <Link
                          id="permalink"
                          to={`/resources/dev-tools/rpc-tool#${inputText}`}
                          target="_blank"
                        >
                          {translate("Permalink")}
                        </Link>
                      </li>
                      <li className="nav-link">
                        <Link
                          id="explorerlink"
                          to={`https://livenet.xrpl.org/${inputType}/${inputText}`}
                          target="_blank"
                        >
                          {translate("Explorer")}
                        </Link>
                      </li>
                    </ul>
                  )}
                  {txResponse && (
                    <RPCResponseGroup response={txResponse}
                                      anchor={<a href="tx.html">tx</a>}
                                      customExpanded={3}
                                      customExpandedText={translate("expand tx")}
                    />
                  )}
                  <div className="group group-account">
                    {accountInfoResponse && (
                      <>
                        <h3>
                          <a href="account_info.html">account_info</a>
                        </h3>
                        <JsonView
                          src={accountInfoResponse}
                          collapsed={1}
                          collapseStringsAfterLength={100}
                          enableClipboard={false}
                        />
                      </>
                    )}
                    {accountLinesResponse && (
                      <RPCResponseGroup response={accountLinesResponse}
                                        anchor={<a href="account_lines.html">account_lines</a>}
                      />)
                    }
                    {accountTxResponse && (
                      <RPCResponseGroup response={accountTxResponse}
                                        anchor={<><a href="account_tx.html">account_tx</a>{" "} {translate("(last 20)")}</>}
                                        customExpanded={3}
                                        customExpandedText={translate("expand tx")}
                      />)
                    }
                    {accountObjectsResponse && (
                        <RPCResponseGroup response={accountObjectsResponse}
                                          anchor={<a href="account_objects.html">account_objects</a>}
                        />)
                    }
                  </div>
                  {ledgerResponse && (
                    <RPCResponseGroup response={ledgerResponse}
                                      anchor={<a href="ledger.html">ledger</a>}
                    />)
                  }
                </div>
              )}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
