import React, { Fragment } from 'react';
import { useTranslate } from "@portal/hooks";
import { Link } from "@portal/Link";
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
        {commandList.map((list, index) => (
          <Fragment key={index}>
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
                  {method.clio_only && (
                    <span
                      className="status clio_only"
                      title="This method is only available from the Clio server."
                    >
                      <i className=" fa fa-exclamation-circle"></i>
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </Fragment>
        ))}
      </ul>
    </div>
  );
};
