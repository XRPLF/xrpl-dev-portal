import React from 'react';
import { useTranslate } from "@portal/hooks";
import { Link } from "@redocly/portal/dist/client/App/Link";
import { slugify } from "./slugify";
import { CommandGroup, CommandMethod } from './types';

interface RightSideBarProps {
  commandList: CommandGroup[];
  currentMethod: CommandMethod;
  setCurrentMethod: any;
}

export const RightSideBar: React.FC<RightSideBarProps> = ({
                                                            commandList,
                                                            currentMethod,
                                                            setCurrentMethod,
                                                          }) => {
  const { translate } = useTranslate();
  return (
    <div className="command-list-wrapper">
      <div className="toc-header">
        <h4>{translate("API Methods")}</h4>
      </div>
      <ul className="command-list" id="command_list">
        {commandList.map((list) => (
          <>
            <li className="separator">{list.group}</li>
            {list.methods.map((method) => (
              <li
                className={`method${method === currentMethod ? " active" : ""}`}
                key={method.name}
              >
                <Link
                  to={`resources/dev-tools/websocket-api-tool#${slugify(method.name)}`}
                  onClick={() => setCurrentMethod(method)}
                >
                  {method.name}&nbsp;
                  {method.status === "not_enabled" && (
                    <span
                      className="status not_enabled"
                      title="This feature is not currently enabled on the production XRP Ledger."
                    >
                      <i className="fa fa-flask"></i>
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </>
        ))}
      </ul>
    </div>
  );
};
