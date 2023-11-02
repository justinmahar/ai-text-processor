import classNames from 'classnames';
import React from 'react';
import { Image, Table } from 'react-bootstrap';
import { DivProps } from 'react-html-props';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import remarkGfm from 'remark-gfm';
import styled from 'styled-components';

export interface MarkdownProps extends DivProps {}

export const Markdown = ({ children, ...props }: MarkdownProps) => {
  const StyledBlockquote = LightStyledBlockquote;
  return (
    <div {...props} className={classNames(props.className)} style={{ ...props.style }}>
      <LastDirectChildNoMargin>
        <ReactMarkdown
          components={{
            p: (props: any) => <p className="mb-0">{props.children}</p>, // Paragraph
            h1: (props: any) => <h1 style={{ fontSize: 23 }}>{props.children}</h1>, // Heading 1 #
            h2: (props: any) => <h2 style={{ fontSize: 22 }}>{props.children}</h2>, // Heading 2 ##
            h3: (props: any) => <h3 style={{ fontSize: 21 }}>{props.children}</h3>, // Heading 3 ###
            h4: (props: any) => <h4 style={{ fontSize: 20 }}>{props.children}</h4>, // Heading 4 ####
            h5: (props: any) => <h5 style={{ fontSize: 19 }}>{props.children}</h5>, // Heading 5 #####
            h6: (props: any) => <h6 style={{ fontSize: 18 }}>{props.children}</h6>, // Heading 6 ######
            blockquote: (props: any) => <StyledBlockquote>{props.children}</StyledBlockquote>, // Blockquote >
            // ul: (props: any) => <ul>{props.children}</ul>, // List -
            // ol: (props: any) => <ol>{props.children}</ol>, // Ordered list 1.
            // li: (props: any) => <li>{props.children}</li>, // List item
            table: (props: any) => (
              <Table striped bordered responsive>
                {props.children}
              </Table>
            ), // Table
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
            img: (props: any) => <Image {...props} fluid rounded />, // Image ![alt](https://google.com/kitten.jpg)
          }}
          remarkPlugins={[remarkGfm]}
        >
          {`${children}`}
        </ReactMarkdown>
      </LastDirectChildNoMargin>
    </div>
  );
};

const LightStyledBlockquote = styled.blockquote`
  background: rgba(0, 0, 0, 0.05);
  border-left: 10px solid rgba(0, 0, 0, 0.25);
  margin: 1.5em 10px;
  padding: 0.5em 10px;
  // Ensure no bottom margin exists on the last direct child
  > *:last-child {
    margin-bottom: 0;
  }
`;

export const LastDirectChildNoMargin = styled.div`
  // Ensure no bottom margin exists on the last direct child
  > *:last-child {
    margin-bottom: 0 !important;
  }
`;
