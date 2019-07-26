import React from "react";
import { Card, Item, Loader, Form } from "semantic-ui-react";
import InfiniteScroller from "react-infinite-scroller";

import PollItem from "./Poll";
import { FilterOptions } from "../state";

const filterOptions = [
  { key: "default", text: "Newest", value: "default" },
  { key: "following", text: "Following", value: "following" },
  { key: "own", text: "Own", value: "own" },
  { key: "voted", text: "Voted", value: "voted" }
];

const PollsList = ({
  polls,
  filter,
  records,
  hasMore,
  loadPolls,
  handleFilterChange
}) => {
  function handleOnFilterChange(e, { value }) {
    handleFilterChange(value);
  }

  function printNoPollMessage() {
    if (filter === FilterOptions.Default) {
      return "No polls are found...";
    }

    if (filter === FilterOptions.Following) {
      return "You are not following any polls...";
    }

    if (filter === FilterOptions.Own) {
      return "You haven't created any polls...";
    }

    if (filter === FilterOptions.Voted) {
      return "You haven't voted any polls...";
    }
  }

  return (
    <div>
      <Form>
        <Form.Select
          options={filterOptions}
          label="Filter"
          value={filter}
          onChange={handleOnFilterChange}
        />
      </Form>
      {polls.length ? (
        <Item.Group>
          <InfiniteScroller
            pageStart={0}
            loadMore={loadPolls}
            hasMore={hasMore}
            loader={<Loader key={0} />}
          >
            {polls.map(poll => (
              <PollItem key={poll._id} poll={poll} records={records} />
            ))}
          </InfiniteScroller>
        </Item.Group>
      ) : (
        <Card style={{ width: "100%", height: "100%" }}>
          <Card.Content>
            <h3 style={{ textAlign: "center" }}>{printNoPollMessage()}</h3>
          </Card.Content>
        </Card>
      )}
    </div>
  );
};

export default PollsList;
