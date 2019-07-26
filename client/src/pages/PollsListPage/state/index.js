import { useState, useEffect } from "react";

import { getPolls, vote, like, unlike, follow, unfollow } from "../../../api";

const usePollListState = paramObj => {
  const { defaultPollsState = [], limit = 0, user = {} } = paramObj;

  const [polls, setPolls] = useState(defaultPollsState);
  const [records, setRecords] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [filter, setFilter] = useState("default");
  const [isLoading, setIsLoading] = useState(false);

  function handleVote(pollId, choice, cb) {
    vote({ pollId, userId: user._id, choice }).then(({ data, status }) => {
      if (status === 200) {
        cb(null);
        const newPolls = polls.map(poll => {
          if (poll._id === pollId) {
            poll.totalVotes += 1;
          }

          return poll;
        });

        setPolls(newPolls);
      }

      // Todo: handle fail submit
    });
  }

  function handleLike(pollId) {
    like(pollId, { userId: user._id }).then(({ data, status }) => {
      if (status === 200) {
        const newPolls = polls.map(poll => {
          if (poll._id === pollId) {
            poll.totalLikes += 1;
          }

          return poll;
        });

        setPolls(newPolls);
      }

      // Todo: handle error
    });
  }

  function handleUnlike(pollId) {
    unlike(pollId, { userId: user._id }).then(({ data, status }) => {
      if (status === 200) {
        const newPolls = polls.map(poll => {
          if (poll._id === pollId) {
            poll.totalLikes -= 1;
          }

          return poll;
        });

        setPolls(newPolls);
      }
    });
  }

  function handleFollow(pollId) {
    follow(pollId, { userId: user._id }).then(({ data, status }) => {
      if (status === 200) {
        const newPolls = polls.map(poll => {
          if (poll._id === pollId) {
            poll.totalFollowings += 1;
          }

          return poll;
        });

        setPolls(newPolls);
      }
    });
  }

  function handleUnfollow(pollId) {
    unfollow(pollId, { userId: user._id }).then(({ data, status }) => {
      if (status === 200) {
        let newPolls = [];
        if (filter === FilterOptions.Following) {
          newPolls = polls.filter(poll => poll._id !== pollId);
        } else {
          newPolls = polls.map(poll => {
            if (poll._id === pollId) {
              poll.totalFollowings -= 1;
            }

            return poll;
          });
        }

        setPolls(newPolls);
      }
    });
  }

  function handleFilterChange(filterValue) {
    setIsLoading(true);
    setFilter(filterValue);
    loadPolls(filterValue, true).then(({ data, status }) => {
      if (status === 200) {
        setPolls([...data.polls]);
        setRecords([...data.records]);
        setHasMore(data.hasMore);
        setIsLoading(false);
      }
    });
  }

  function loadPolls(filter = "default", isFilterChanging = false) {
    return getPolls(
      `?skip=${isFilterChanging ? 0 : polls.length}&limit=${limit}&userId=${
        user._id
      }&filter=${filter}`
    );
  }

  useEffect(() => {
    if (hasMore && Object.keys(user).length !== 0) {
      setIsLoading(true);
      loadPolls().then(({ data, status }) => {
        if (status === 200) {
          setPolls([...polls, ...data.polls]);
          setRecords([...records, ...data.records]);
          setHasMore(data.hasMore);
          setIsLoading(false);
        }
      });
    }
    // eslint-disable-next-line
  }, [user]);

  return [
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
  ];
};

export default usePollListState;

export const FilterOptions = {
  Default: "default",
  Following: "following",
  Own: "own",
  Voted: "voted"
};
