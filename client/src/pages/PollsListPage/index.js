import React, { useContext } from "react";
import { Header } from "semantic-ui-react";

import { UserContext } from "../../auth";
import PollListContext from "./context";
import usePollListState from "./state";
import PollList from "./components/PollsList";
import DimLoader from "../shared/DimLoader";

const PollListContainer = () => {
  const user = useContext(UserContext);
  const [
    polls,
    filter,
    records,
    hasMore,
    loadPolls,
    handleVote,
    handleLike,
    handleUnlike,
    handleFollow,
    handleUnfollow,
    handleFilterChange,
    isLoading
  ] = usePollListState({
    limit: 10,
    user
  });
  const PollListProviderValue = {
    handleVote,
    handleLike,
    handleUnlike,
    handleFollow,
    handleUnfollow
  };
  const { nickName } = user;

  return (
    <PollListContext.Provider value={PollListProviderValue}>
      <Header as="h2" textAlign="center">
        Welcome, {nickName}!
      </Header>
      {!isLoading ? (
        <PollList
          polls={polls}
          filter={filter}
          records={records}
          hasMore={hasMore}
          loadPolls={loadPolls}
          handleFilterChange={handleFilterChange}
        />
      ) : (
        <DimLoader text="Loading Data..." />
      )}
    </PollListContext.Provider>
  );
};

export default PollListContainer;
