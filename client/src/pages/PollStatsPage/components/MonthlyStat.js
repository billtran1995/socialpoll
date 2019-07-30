import React, { useState } from "react";
import { Form, Button, Table, Header, List } from "semantic-ui-react";

import { getStatistic } from "../../../api";

const MonthlyStat = ({ poll, calculatePercentage }) => {
  const months = [
    { key: "January", text: "January", value: 1 },
    { key: "February", text: "February", value: 2 },
    { key: "March", text: "March", value: 3 },
    { key: "April", text: "April", value: 4 },
    { key: "May", text: "May", value: 5 },
    { key: "June", text: "June", value: 6 },
    { key: "July", text: "July", value: 7 },
    { key: "August", text: "August", value: 8 },
    { key: "September", text: "September", value: 9 },
    { key: "October", text: "October", value: 10 },
    { key: "November", text: "November", value: 11 },
    { key: "December", text: "December", value: 12 },
    { key: "Total", text: "Total", value: 0 }
  ];
  const [stat, setStat] = useState();
  const [year, setYear] = useState("");

  function handleOnYearChange({ target: { value } }) {
    if (value.length <= 4 && /^[0-9]*$/.test(value)) {
      setYear(value);
    }
  }

  function handleGetStat(e) {
    e.preventDefault();
    getStatistic(poll._id, year).then(({ data, status }) => {
      if (status === 200) {
        setStat(data);
      }
    });
  }

  function renderTableHeader() {
    return (
      <Table.Header fullWidth>
        <Table.Row>
          <Table.HeaderCell />
          {months.map(month => {
            return (
              <Table.HeaderCell keys={month.key}>{month.text}</Table.HeaderCell>
            );
          })}
        </Table.Row>
      </Table.Header>
    );
  }

  function renderTableBody() {
    let total = 0;
    return (
      <Table.Body>
        {poll.choices.map(choice => {
          total = 0;
          return (
            <Table.Row key={choice.choice}>
              <Table.Cell key={`${choice.choice}-cell`}>
                {choice.choice}
              </Table.Cell>
              {months.map(month => {
                const result = stat.monthlyVoteStats.find(
                  voteStat =>
                    voteStat.month === month.value &&
                    voteStat.votedChoice === choice.choice
                );
                let statValue = result ? result.numberOfVotes : 0;
                if (month.value === 0) {
                  statValue = total;
                } else {
                  total += statValue;
                }
                return (
                  <Table.Cell key={`${choice.choice}-${month.value}`}>
                    {`${statValue} - (${calculatePercentage(statValue)}%)`}
                  </Table.Cell>
                );
              })}
            </Table.Row>
          );
        })}
      </Table.Body>
    );
  }

  function renderTableFooter() {
    return (
      <Table.Footer fullWidth>
        <Table.Row key={"footer"}>
          <Table.HeaderCell colSpan="14">
            <span style={{ color: "red" }}>*Note: </span>
            <List as="ul">
              <List.Item as="li" key={"note-1"}>
                The percents are calculated based on dividing by the total votes
                of the poll
              </List.Item>
              <List.Item as="li" key={"note-2"}>
                All percent values are rounded
              </List.Item>
            </List>
          </Table.HeaderCell>
        </Table.Row>
      </Table.Footer>
    );
  }

  return (
    <>
      <Form onSubmit={handleGetStat}>
        <Form.Group>
          <Form.Input
            label="Year"
            value={year}
            onChange={handleOnYearChange}
            required
          />
        </Form.Group>
        <Button color="instagram">Get Stats</Button>
      </Form>
      <br />
      {stat && (
        <>
          <Header as="h3">Overall Total Votes: {poll.totalVotes}</Header>
          <Table celled compact definition>
            {renderTableHeader()}
            {renderTableBody()}
            {renderTableFooter()}
          </Table>
        </>
      )}
    </>
  );
};

export default MonthlyStat;
