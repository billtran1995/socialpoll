import React, { useState, useEffect, useContext } from "react";
import { withRouter } from "react-router-dom";
import { Item, List, Header, Image } from "semantic-ui-react";
import { Card, Label } from "semantic-ui-react";
import {
  faVoteYea,
  faThumbsUp,
  faStar,
  faInfo
} from "@fortawesome/free-solid-svg-icons";
import cs from "classnames";
import moment from "moment";

import { UserContext } from "../../../auth";
import IconButton from "../../shared/IconButton";
import VoteForm from "./VoteForm";
import PollListContext from "../context";

import "../styles/PollStyles.css";

const Poll = ({ poll, records, history }) => {
  const user = useContext(UserContext);
  const { handleLike, handleUnlike, handleFollow, handleUnfollow } = useContext(
    PollListContext
  );
  const [open, setOpen] = useState(false);
  const [record, setRecord] = useState({
    isVoted: false,
    isLiked: false,
    isFollowed: false,
    votedChoice: ""
  });

  useEffect(() => {
    let tempRecord = records.filter(rec => rec.pollId === poll._id);

    if (tempRecord.length) {
      tempRecord = tempRecord[0];

      !tempRecord.isVoted && (tempRecord.votedChoice = "");
      tempRecord.isLiked = Boolean(tempRecord.isLiked);
      tempRecord.isFollowed = Boolean(tempRecord.isFollowed);
      setRecord(tempRecord);
    }

    // eslint-disable-next-line
  }, [records]);

  function openModal() {
    setOpen(true);
  }

  function closeModal() {
    setOpen(false);
  }

  function handleOnInfoClick() {
    history.push(`/poll/info/${poll._id}`);
  }

  function handleOnVoteClick() {
    openModal();
  }

  function handleOnLikeClick() {
    if (!record.isLiked) {
      handleLike(poll._id);
    } else {
      handleUnlike(poll._id);
    }
    setRecord({ ...record, isLiked: !record.isLiked });
  }

  function handleOnFollowClick() {
    if (!record.isFollowed) {
      handleFollow(poll._id);
    } else {
      handleUnfollow(poll._id);
    }
    setRecord({ ...record, isFollowed: !record.isFollowed });
  }

  function getVotedChoice() {
    if (record.votedChoice.length) {
      return record.votedChoice;
    }

    return "";
  }

  function setIsVoted(voteValue) {
    setRecord({ ...record, isVoted: true, votedChoice: voteValue });
  }

  const { isVoted, isLiked, isFollowed } = record;

  return (
    <div className="PollItem">
      <Item>
        <Item.Content>
          <Card style={{ width: "100%" }}>
            <Card.Content>
              <Header as="h4" size="small">
                <Image src={poll.author.picture} avatar />
                {" " + poll.author.nickName}
                <Card.Meta textAlign="right">
                  <span className="date">
                    Created {moment(poll.createdAt).fromNow()}
                  </span>
                </Card.Meta>
              </Header>
            </Card.Content>
            <Card.Content>
              <Header>{poll.question}</Header>
              <List bulleted>
                {poll.choices.map(choice => (
                  <List.Item key={choice._id}>{choice.choice}</List.Item>
                ))}
              </List>
            </Card.Content>
            <Card.Content extra style={{ padding: "0 0 5px 0" }}>
              <div
                style={{
                  marginTop: "10px",
                  marginLeft: "10px",
                  color: "black"
                }}
              >
                <Item.Extra>
                  <Label>{poll.totalVotes} Total Votes</Label>
                  <Label>{poll.totalLikes} Likes</Label>
                  <Label>{poll.totalFollowings} Followings</Label>
                </Item.Extra>
              </div>
              <div className="PollItem-iconbtns">
                <IconButton
                  classNames="PollItem-iconbtn info"
                  icon={faInfo}
                  popupContent="View Details"
                  popupPosition="top center"
                  handleOnClick={handleOnInfoClick}
                />
                {poll.author._id !== user._id && (
                  <IconButton
                    classNames={cs("PollItem-iconbtn star", {
                      active: isFollowed
                    })}
                    icon={faStar}
                    popupContent={cs({
                      Follow: !isFollowed,
                      Unfollow: isFollowed
                    })}
                    popupPosition="top center"
                    handleOnClick={handleOnFollowClick}
                  />
                )}
                <IconButton
                  classNames={cs("PollItem-iconbtn thumbsup", {
                    active: isLiked
                  })}
                  icon={faThumbsUp}
                  popupContent={cs({ Like: !isLiked, Unlike: isLiked })}
                  popupPosition="top center"
                  handleOnClick={handleOnLikeClick}
                />
                <IconButton
                  classNames={cs("PollItem-iconbtn vote", { active: isVoted })}
                  icon={faVoteYea}
                  popupContent={cs({ Vote: !isVoted, Voted: isVoted })}
                  popupPosition="top center"
                  handleOnClick={handleOnVoteClick}
                />
              </div>
            </Card.Content>
          </Card>
        </Item.Content>
      </Item>
      {open && (
        <VoteForm
          poll={poll}
          isVoted={isVoted}
          setIsVoted={setIsVoted}
          closeModal={closeModal}
          getVotedChoice={getVotedChoice}
        />
      )}
    </div>
  );
};

export default withRouter(Poll);
