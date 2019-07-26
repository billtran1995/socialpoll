import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Popup } from "semantic-ui-react";

const IconButton = ({
  classNames,
  icon,
  popupContent,
  popupPosition,
  handleOnClick,
  hasBox = true
}) => {
  return (
    <Popup
      trigger={
        hasBox ? (
          <button className={classNames} onClick={handleOnClick}>
            <FontAwesomeIcon icon={icon} />
          </button>
        ) : (
          <FontAwesomeIcon
            className={classNames}
            icon={icon}
            onClick={handleOnClick}
          />
        )
      }
      content={popupContent}
      position={popupPosition}
    />
  );
};

export default IconButton;
