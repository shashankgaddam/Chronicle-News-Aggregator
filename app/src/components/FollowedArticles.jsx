import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import NewsCard from "./NewsCard";
import { faThumbsUp, faXmark } from "@fortawesome/free-solid-svg-icons";
import { hasFollowedNews } from "./../utilities/helper";

const FollowedArticles = () => {
  const [rotate, setRotate] = useState(0);

  // write task 10 get followed news solution here
  const [followedArticles, setFollowedArticles] = useState(null);

  useEffect(() => {
    function getFollowedArticles() {
      if (hasFollowedNews) {
        let followedArticles = JSON.parse(
          localStorage.getItem("followed-articles")
        );
        setFollowedArticles(followedArticles);
      }
    }
    getFollowedArticles();
  }, []);

  return (
    <details className="mt-3" open>
      <summary
        className="d-flex align-items-center justify-content-between pl-2 pr-4 border rounded bg-light p-3 "
        onClick={() => setRotate(rotate + 45)}
      >
        <div className="title d-flex align-items-center gap-3">
          <FontAwesomeIcon icon={faThumbsUp} className="fa_Icon" />
          <h3 className="ml-4 mb-0">Followed Articles</h3>
        </div>
        <div className="accordion-icon">
          <FontAwesomeIcon
            icon={faXmark}
            style={{ transform: `rotate(${rotate}deg)` }}
          />
        </div>
      </summary>

      {followedArticles &&
        followedArticles.map((item, index) => {
          return (
            <NewsCard key={index} isFollowed={true} newsData={item} />
          );
        })}
    </details>
  );
};

export default FollowedArticles;
