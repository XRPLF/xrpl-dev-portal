import { useEffect, useState, useRef } from 'react';
import { useLocation } from "react-router-dom";
import { useThemeHooks } from '@redocly/theme/core/hooks';
import { Link } from "@redocly/theme/components/Link/Link";
import {
  JsonParam,
  StringParam,
  useQueryParams,
  withDefault,
  QueryParamProvider
} from "use-query-params"
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6';

import { PermalinkButton } from './components/websocket-api/permalink-modal';
import { CurlButton } from './components/websocket-api/curl-modal';
import { ConnectionModal } from "./components/websocket-api/connection-modal";

import { RightSideBar } from "./components/websocket-api/right-sidebar";
import { slugify } from "./components/websocket-api/slugify";
import { JsonEditor } from '../../shared/editor/json-editor';
import { CommandGroup, CommandMethod } from './components/websocket-api/types';

import commandList from "./components/websocket-api/data/command-list.json";
import connections from "./components/websocket-api/data/connections.json";
import { Loader } from './components/Loader';

export const frontmatter = {
  seo: {
    title: 'WebSocket API Tool',
    description: "Interact directly with XRP Ledger servers using the WebSocket API with this handy tool.",
  }
};

export function WebsocketApiTool() {

  const [params, setParams] = useQueryParams({
    server: withDefault(StringParam, null),
    req: withDefault(JsonParam, null)
  })

  const { hash: slug } = useLocation();
  const { useTranslate } = useThemeHooks();
  const { translate } = useTranslate();
  const [isConnectionModalVisible, setIsConnectionModalVisible] =
    useState(false);
  const [selectedConnection, setSelectedConnection] = useState((params.server) ? connections.find((connection) => { return connection?.ws_url === params.server }) : connections[0]);  const [connected, setConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  const [keepLast, setKeepLast] = useState(50);
  const [streamPaused, setStreamPaused] = useState(false);
  const streamPausedRef = useRef(streamPaused);
  const [wsLoading, setWsLoading] = useState(false);
  const [sendLoading, setSendLoading] = useState(false);

  const getInitialMethod = (): CommandMethod => {
    for (const group of (commandList as CommandGroup[])) {
      for (const method of group.methods) {
        if (slug.slice(1) === slugify(method.name) || params.req?.command == method.body.command) {
          return method;
        }
      }
    }
    return commandList[0].methods[0] as CommandMethod;
  };

  const setMethod = (method: CommandMethod) => {
    setCurrentMethod(method)
    setCurrentBody(JSON.stringify(method.body, null, 2))
  }

  const [currentMethod, setCurrentMethod] = useState<CommandMethod>(getInitialMethod);
  const [currentBody, setCurrentBody] = useState(
    JSON.stringify(params.req || currentMethod.body, null, 2)
  );
  streamPausedRef.current = streamPaused;

  const handleCurrentBodyChange = (value: any) => {
    setCurrentBody(value);
  };

  const handleKeepLastChange = (event) => {
    const newValue = event.target.value;
    setKeepLast(newValue);
  };

  const openConnectionModal = () => {
    setIsConnectionModalVisible(true);
  };

  const closeConnectionModal = () => {
    setIsConnectionModalVisible(false);
  };

  const [ws, setWs] = useState(null);
  const [responses, setResponses] = useState([]);

  useEffect(() => {
    if (ws && ws.readyState < 2) {
      ws.close();
    }
    const newWs = new WebSocket(selectedConnection.ws_url);
    setWs(newWs);
    setWsLoading(true);
    newWs.onopen = function handleOpen(event) {
      setConnected(true);
      setConnectionError(false);
      setWsLoading(false);
    };

    newWs.onclose = function handleClose(event) {
      if (event.wasClean) {
        setConnected(false);
        setWsLoading(false);
      } else {
        console.debug(
          "socket close event discarded (new socket status already provided):",
          event
        );
      }
    };

    newWs.onerror = function handleError(event) {
      setConnectionError(true);
      setWsLoading(false);
      console.error("socket error:", event);
    };

    newWs.onmessage = function handleMessage(event) {
      const message = event.data;
      let data;
      try {
        data = JSON.parse(message);
      } catch (error) {
        console.error("Error parsing validation message", error);
        return;
      }
      if (data.type === "response") {
        setSendLoading(false);
      }
      if (data.type === "response" || !streamPausedRef.current) {
        setResponses((prevResponses) =>
          [JSON.stringify(data, null, 2)].concat(prevResponses)
        );
      }
    };

    return () => {
      newWs.close();
    };
  }, [selectedConnection.ws_url]);

  useEffect(() => {
    if (responses.length > keepLast) {
      setResponses(responses.slice(0, keepLast));
    }
  }, [responses, keepLast]);

  const sendWebSocketMessage = (messageBody) => {
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      alert("Can't send request: Must be connected first!");
      return;
    }
    try {
      JSON.parse(messageBody); // we only need the text version, but test JSON syntax
    } catch (e) {
      alert("Invalid request JSON");
      return;
    }

    setSendLoading(true);

    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(messageBody);
    }
  };

  return (
    <div className="container-fluid" role="document" id="main_content_wrapper">
      <div className="row">
        <aside
          className="right-sidebar col-lg-3 order-lg-4"
          role="complementary"
        >
          <RightSideBar
            commandList={commandList}
            currentMethod={currentMethod}
            setCurrentMethod={setMethod}
          />
        </aside>
        <main
          className="main col-lg-9"
          role="main"
          id="main_content_body"
        >
          <section
            className="container-fluid pt-3 p-md-3 websocket-tool"
            id="wstool-1"
          >
            <h1>{translate("WebSocket Tool")}</h1>
            <div className="api-method-description-wrapper">
              <h3>
                <a
                  href={`${currentMethod.name.split(" ")[0]}.html`}
                  className="selected_command"
                >
                  {currentMethod.name}
                </a>
              </h3>
              {currentMethod.description && (
                <p
                  className="blurb"
                  dangerouslySetInnerHTML={{
                    __html: currentMethod.description,
                  }}
                />
              )}
              {currentMethod.link && (
                <Link
                  className="btn btn-outline-secondary api-readmore"
                  to={currentMethod.link}
                >
                  {translate("Read more")}
                </Link>
              )}
            </div>

            <div className="api-input-area pt-4">
              <h4>{translate("Request")}</h4>
              <div className="request-body">
                <JsonEditor
                  value={currentBody}
                  onChange={handleCurrentBodyChange}
                />
              </div>
              <div
                className="btn-toolbar justify-content-between pt-4"
                role="toolbar"
              >
                <div className="btn-group mr-3" role="group">
                  <button
                    className="btn btn-outline-secondary send-request"
                    onClick={() => sendWebSocketMessage(currentBody)}
                  >
                    {translate("Send request")}
                  </button>
                  {sendLoading && (
                    <div className="input-group loader send-loader">
                      <span className="input-group-append">
                        <Loader />
                      </span>
                    </div>
                  )}
                </div>
                <div className="btn-group request-options" role="group">
                  <button
                    className={`btn connection ${
                      connected ? "btn-success" : "btn-outline-secondary"
                    } ${connectionError ?? "btn-danger"}`}
                    onClick={openConnectionModal}
                    data-toggle="modal"
                    data-target="#wstool-1-connection-settings"
                  >
                    {`${selectedConnection.shortname}${
                      connected ? ` (${translate('Connected')})` : ` (${translate('Not Connected')})`
                    }${connectionError ? ` (${translate('Failed to Connect')})` : ""}`}
                  </button>
                  {isConnectionModalVisible && (
                    <ConnectionModal
                      selectedConnection={selectedConnection}
                      setSelectedConnection={setSelectedConnection}
                      closeConnectionModal={closeConnectionModal}
                      connections={connections}
                    />
                  )}
                  {wsLoading && (
                    <div className="input-group loader connect-loader">
                      <span className="input-group-append">
                        <Loader />
                      </span>
                    </div>
                  )}
                  <PermalinkButton
                    currentBody={currentBody}
                    selectedConnection={selectedConnection}
                  />
                  {!currentMethod.ws_only &&
                    (<CurlButton currentBody={currentBody} selectedConnection={selectedConnection}/>)
                  }
                </div>
              </div>
            </div>

            <div className="api-response-area pt-4">
              <h4>{translate("Responses")}</h4>

              <div
                className="btn-toolbar justify-content-between response-options"
                role="toolbar"
              >
                <div className="input-group">
                  <div className="input-group-prepend">
                    <div
                      className="input-group-text"
                      id="wstool-1-keep-last-label"
                    >
                      {translate("Keep last:")}
                    </div>
                  </div>
                  <input
                    type="number"
                    value={keepLast}
                    min="1"
                    aria-label="Number of responses to keep at once"
                    aria-describedby="wstool-1-keep-last-label"
                    className="form-control keep-last"
                    onChange={handleKeepLastChange}
                  />
                </div>

                <div className="btn-group" role="group">
                  {!streamPaused && (
                    <button
                      className="btn btn-outline-secondary stream-pause"
                      title={translate("Pause Subscriptions")}
                      onClick={() => setStreamPaused(true)}
                    >
                      <i className="fa fa-pause"></i>
                    </button>
                  )}
                  {streamPaused && (
                    <button
                      className="btn btn-outline-secondary stream-unpause"
                      title={translate("Unpause Subscriptions")}
                      onClick={() => setStreamPaused(false)}
                    >
                      <i className="fa fa-play"></i>
                    </button>
                  )}
                  <button
                    className="btn btn-outline-secondary wipe-responses"
                    title={translate("Delete All Responses")}
                    onClick={() => setResponses([])}
                  >
                    <i className="fa fa-trash"></i>
                  </button>
                </div>
              </div>

              <div className="response-body-wrapper">
                {responses.map((response, i) => (
                  <div className="response-metadata" key={response.id + '_' + i}>
                    <span className="timestamp">
                      {new Date().toISOString()}
                    </span>
                    <div className="response-json">
                      <JsonEditor value={response} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default function Page() {
  return <QueryParamProvider adapter={ReactRouter6Adapter}>
    <WebsocketApiTool />
  </QueryParamProvider>
}
