import React, { useEffect, useState } from "react";
import { Segment, Header, Tab } from "semantic-ui-react";

import { getPoll } from "../../api";
import DimLoader from "../shared/DimLoader";
import GraphStat from "./components/GraphStat";
import MonthlyStat from "./components/MonthlyStat";
import CommentsSection from "./components/CommentsSection";

const PollStatsContainer = ({ match }) => {
  const [poll, setPoll] = useState();
  const panes = [
    {
      menuItem: "Graph",
      render: () => (
        <GraphStat
          poll={poll}
          getData={getData}
          calculatePercentage={calculatePercentage}
        />
      )
    },
    {
      menuItem: "Monthly Stats",
      render: () => (
        <MonthlyStat poll={poll} calculatePercentage={calculatePercentage} />
      )
    }
  ];

  useEffect(() => {
    getPoll(match.params.id).then(({ data, status }) => {
      if (status === 200) {
        setPoll(data);
      }
    });
    // eslint-disable-next-line
  }, []);

  function getData(rep) {
    if (poll)
      return poll.choices.map((choice, idx) => ({
        x: rep[idx],
        y: choice.votes
      }));
    return null;
  }

  function calculatePercentage(value) {
    const result = Math.round(value / poll.totalVotes);
    return isNaN(result) ? 0 : result;
  }

  if (!poll) {
    return <DimLoader text="Loading Poll..." />;
  }

  return (
    <>
      <Segment>
        <Header>{poll.question}</Header>
      </Segment>
      <Segment>
        <Tab menu={{ attached: false, secondary: true }} panes={panes} />
      </Segment>
      <br />
      <CommentsSection poll={poll} updatePoll={setPoll} />
    </>
  );
};

export default PollStatsContainer;
