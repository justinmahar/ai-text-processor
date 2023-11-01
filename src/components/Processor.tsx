import 'bootstrap/dist/css/bootstrap.css';
import classNames from 'classnames';
import React from 'react';
import { Card } from 'react-bootstrap';
import { DivProps } from 'react-html-props';

export interface ProcessorProps extends DivProps {}

export const Processor = ({ ...props }: ProcessorProps) => {
  return (
    <div {...props} className={classNames(props.className)} style={{ ...props.style }}>
      <Card>
        <Card.Header>Processor</Card.Header>
        <Card.Body>
          <Card.Text>
            Some quick example text to build the card out and make up the bulk of the card's content.
          </Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
};
