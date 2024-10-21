import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";

const DescriptionBox = (props) => {
  const [markdown, setMarkdown] = useState(props.description || "");

  const handleChange = (event) => {
    setMarkdown(event.target.value);
    if (props.handleChange) {
      props.handleChange(event);
    }
  };

  const renderers = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || "");
      return !inline && match ? (
        <SyntaxHighlighter
          style={materialDark}
          language={match[1]}
          PreTag="div"
          {...props}
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
    image({ node, ...props }) {
      return (
        <img
          style={{ maxWidth: "100%", height: "auto" }}
          alt={props.alt}
          {...props}
        />
      );
    },
  };

  return (
    <div>
      <textarea
        name="description"
        value={markdown}
        onChange={handleChange}
        placeholder="Description"
        rows={10}
      />

      {markdown.length > 0 && (
        <div
          className="markdown-preview"
          style={{
            maxHeight: "40vh",
            overflow: "auto",
          }}
        >
          <ReactMarkdown components={renderers} remarkPlugins={[remarkGfm]}>
            {markdown}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
};

export default DescriptionBox;
