"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LastDirectChildNoMargin = exports.Markdown = void 0;
const classnames_1 = __importDefault(require("classnames"));
const react_1 = __importDefault(require("react"));
const react_bootstrap_1 = require("react-bootstrap");
const react_markdown_1 = require("react-markdown/lib/react-markdown");
const remark_gfm_1 = __importDefault(require("remark-gfm"));
const styled_components_1 = __importDefault(require("styled-components"));
const Markdown = (_a) => {
    var { children } = _a, props = __rest(_a, ["children"]);
    const StyledBlockquote = LightStyledBlockquote;
    return (react_1.default.createElement("div", Object.assign({}, props, { className: (0, classnames_1.default)(props.className), style: Object.assign({}, props.style) }),
        react_1.default.createElement(exports.LastDirectChildNoMargin, null,
            react_1.default.createElement(react_markdown_1.ReactMarkdown, { components: {
                    p: (props) => react_1.default.createElement("p", { className: "mb-0" }, props.children),
                    h1: (props) => react_1.default.createElement("h1", { style: { fontSize: 23 } }, props.children),
                    h2: (props) => react_1.default.createElement("h2", { style: { fontSize: 22 } }, props.children),
                    h3: (props) => react_1.default.createElement("h3", { style: { fontSize: 21 } }, props.children),
                    h4: (props) => react_1.default.createElement("h4", { style: { fontSize: 20 } }, props.children),
                    h5: (props) => react_1.default.createElement("h5", { style: { fontSize: 19 } }, props.children),
                    h6: (props) => react_1.default.createElement("h6", { style: { fontSize: 18 } }, props.children),
                    blockquote: (props) => react_1.default.createElement(StyledBlockquote, null, props.children),
                    // ul: (props: any) => <ul>{props.children}</ul>, // List -
                    // ol: (props: any) => <ol>{props.children}</ol>, // Ordered list 1.
                    // li: (props: any) => <li>{props.children}</li>, // List item
                    table: (props) => (react_1.default.createElement(react_bootstrap_1.Table, { striped: true, bordered: true, responsive: true }, props.children)),
                    // thead: (props: any) => <thead>{props.children}</thead>, // Table head
                    // tbody: (props: any) => <tbody>{props.children}</tbody>, // Table body
                    // tr: (props: any) => <tr>{props.children}</tr>, // Table row
                    // td: (props: any) => <td>{props.children}</td>, // Table cell
                    // th: (props: any) => <th>{props.children}</th>, // Table header
                    // code: ({ ...props }) => {
                    //   return <CodeWithCopy {...props} />;
                    // }, // Code ```code```
                    // inlineCode: (props: any) => <code>{props.children}</code>, // InlineCode `inlineCode`
                    // pre: (props: any) => <pre>{props.children}</pre>, // Pre ```code```
                    // em: (props: any) => <em>{props.children}</em>, // Emphasis _emphasis_
                    // strong: (props: any) => <strong>{props.children}</strong>, // Strong **strong**
                    // del: (props: any) => <del>{props.children}</del>, // Delete ~~strikethrough~~
                    // hr: (props: any) => <hr />, // Thematic break --- or ***
                    // a: ({ children, ...aProps }: any) => <a {...aProps}>{children}</a>, // Link <https://google.com> or [MDX](https://google.com)
                    img: (props) => react_1.default.createElement(react_bootstrap_1.Image, Object.assign({}, props, { fluid: true, rounded: true })), // Image ![alt](https://google.com/kitten.jpg)
                }, remarkPlugins: [remark_gfm_1.default] }, `${children}`))));
};
exports.Markdown = Markdown;
const LightStyledBlockquote = styled_components_1.default.blockquote `
  background: rgba(0, 0, 0, 0.05);
  border-left: 10px solid rgba(0, 0, 0, 0.25);
  margin: 1.5em 10px;
  padding: 0.5em 10px;
  // Ensure no bottom margin exists on the last direct child
  > *:last-child {
    margin-bottom: 0;
  }
`;
exports.LastDirectChildNoMargin = styled_components_1.default.div `
  // Ensure no bottom margin exists on the last direct child
  > *:last-child {
    margin-bottom: 0 !important;
  }
`;
