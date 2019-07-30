import React from "react";
import { Grid, Header, List } from "semantic-ui-react";
import { XYPlot, XAxis, YAxis, VerticalBarSeries } from "react-vis";

const AxisStyle = {
  line: { stroke: "#ADDDE1" },
  ticks: { stroke: "#ADDDE1" },
  text: {
    stroke: "none",
    fill: "#6b6b76",
    fontWeight: 600
  }
};

const GraphStat = ({ poll, getData, calculatePercentage }) => {
  const rep = ["a", "b", "c", "d", "e", "f"];

  function renderGeneralInfo() {
    return (
      <>
        <Header>General Info:</Header>
        <div>
          <strong>Submitted by:</strong> {poll.author.nickName}
        </div>
        <div>
          <strong>Total votes:</strong> {poll.totalVotes}
        </div>
        <div>
          <strong>Total likes:</strong> {poll.totalLikes}
        </div>
        <div>
          <strong>Total follows: </strong>
          {poll.totalFollowings}
        </div>
      </>
    );
  }

  function renderReferences() {
    return (
      <>
        <Header>References:</Header>
        <List as="ol">
          {poll.choices.map((choice, idx) => {
            return (
              <List.Item
                as="li"
                value={rep[idx] + " -"}
                key={rep[idx] + "-" + choice.choice}
              >
                {`${choice.choice} (${calculatePercentage(
                  choice.votes
                )}% of total votes)`}
              </List.Item>
            );
          })}
        </List>
      </>
    );
  }

  return (
    <Grid>
      <Grid.Row>
        <Grid.Column width={10}>
          <div>
            <span>Votes</span>
            {/* Size 200 x 200 for mobile */}
            <XYPlot xType="ordinal" width={500} height={400} xDistance={100}>
              <XAxis style={AxisStyle} />
              <YAxis style={AxisStyle} />
              <VerticalBarSeries data={getData(rep)} />
            </XYPlot>
          </div>
        </Grid.Column>
        <Grid.Column width={6}>
          {renderGeneralInfo()}
          {renderReferences()}
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

export default GraphStat;
