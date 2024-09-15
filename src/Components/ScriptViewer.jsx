import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useUser } from "../Context/UserProvider";

const customStyle = {
  ...dracula,
  'pre[class*="language-"]': {
    ...dracula['pre[class*="language-"]'],
    background: "none", // Remove background color
    padding: "0", // Remove padding
    margin: "0", // Remove margin
  },
};

const ScriptViewer = (props) => {
  const { currentUser, userProfile } = useUser();

  const script = props.script;
  const scriptName = props.scriptName;
  const scriptType = scriptName.split(".").pop();
  const [scriptContent, setScriptContent] = useState("");
  const [purchased, setPurchased] = useState(false);

  useEffect(() => {
    const isPurchased =
      (currentUser &&
        userProfile &&
        userProfile.purchasedItems &&
        userProfile.purchasedItems.includes(props.id)) ||
      props.price === 0;

    setPurchased(isPurchased);

    axios
      .get(script)
      .then((response) => {
        if (isPurchased) {
          setScriptContent(response.data);
        } else {
          setScriptContent(response.data.substring(0, 600) + "...");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [currentUser, userProfile, props.price, script, props.id]);

  return (
    <div className="script_viewer_main">
      <div className="container">
        {!purchased && (
          <div className="locked_content">
            <i className="icon fas fa-lock"></i>
            <span>Purchase to view full script</span>
          </div>
        )}

        <div className="header">
          <h2>{scriptName}</h2>

          {purchased && (
            <button
              onClick={() => {
                navigator.clipboard.writeText(scriptContent);
                const copyBtn = document.querySelector(".copy_btn");

                copyBtn.innerHTML = `<i class="fa-solid fa-check"></i>`;

                setTimeout(() => {
                  copyBtn.innerHTML = '<i class="far fa-copy"></i>';
                }, 3000);
              }}
              className="copy_btn"
            >
              <i className="far fa-copy"></i>
            </button>
          )}
        </div>
        <div className={`code ${purchased ? "" : "locked"}`}>
          <SyntaxHighlighter language={scriptType} style={customStyle}>
            {scriptContent}
          </SyntaxHighlighter>
        </div>
      </div>
    </div>
  );
};

export default ScriptViewer;
