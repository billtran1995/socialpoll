import React from "react";
import { Dimmer, Loader } from "semantic-ui-react";

const DimLoader = ({ inverted = true, text }) => {
  return (
    <Dimmer active inverted={inverted}>
      <Loader size="huge">{text}</Loader>
    </Dimmer>
  );
};

export default DimLoader;
