import React, { useContext, useState } from "react";
import { UserContext } from "../App";
import { toast } from "react-hot-toast";
import axios from "axios";
import { PostContext } from "../pages/PostPage";

const CommentField = ({
  action,
  index = undefined,
  replyingTo = undefined,
  setReplying,
}) => {
  const {
    post,
    post: {
      _id,
      author: { _id: post_author },
    },
    comments,
    activity,
    setPost,
    setTotalParentCommentsLoaded,
  } = useContext(PostContext);

  const {
    userAuth: { access_token, username, fullName, profile_img },
  } = useContext(UserContext);

  const commentArr = comments ? comments.results : [];

  const [comment, setComment] = useState("");

  const handleCommentChange = (e) => {
    let input = e.target;

    input.style.height = "fit-content";
    input.style.height = `${input.scrollHeight}px`;

    setComment(e.target.value);
  };

  const handleComment = () => {
    if (!access_token) {
      return toast.error("Login First To Leave Comment");
    }
    if (!comment.length) {
      return toast.error("Write something to leave a comment...");
    }
    axios
      .post(
        import.meta.env.VITE_SERVER_DOMAIN +
          "/api/v1/post/ineraction/add/comments",
        {
          _id,
          post_author,
          comment,
          replying_to: replyingTo,
        },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      )
      .then(({ data }) => {
        setComment("");
        // console.log(data);

        data.commented_by = {
          personal_info: { username, fullName, profile_img },
        };

        let newCommentArr;

        if (replyingTo) {
          commentArr[index].children.push(data._id);

          data.childrenLevel = commentArr[index].childrenLevel + 1;

          data.parentIndex = index;

          commentArr[index].isReplyLoaded = true;

          commentArr.splice(index + 1, 0, data);

          newCommentArr = commentArr;
        } else {
          data.childrenLevel = 0;

          newCommentArr = [data];
        }

        let totalComments = activity ? activity.total_comments : 0;
        // let totalParentComments = activity ? activity.total_parent_comments : 0;
        let totalParentComments = replyingTo ? 0 : 1;
        let parentCommentIncrementVal = 1;

        setPost({
          ...post,
          comments: { ...comments, results: newCommentArr },
          activity: {
            ...activity,
            total_comments: totalComments + 1,
            total_parent_comments:
              totalParentComments + parentCommentIncrementVal,
          },
        });

        setTotalParentCommentsLoaded(
          (preVal) => preVal + parentCommentIncrementVal
        );

        setTimeout(() => {
          location.reload();
        }, 100);

        // return toast.success(`Comment Added... Please Refresh the page`)
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <textarea
        name="title"
        rows="1"
        value={comment}
        placeholder="Add a delightful comment here! ✨"
        className="w-[100%] comment text-2xl h-fit border-b-2 border-purple focus:border-white text-purple focus:text-white py-3 leading-tight bg-transparent resize-none outline-none  focus:placeholder:text-white placeholder:text-purple"
        // onKeyDown={onCommentKeyDown}
        onChange={handleCommentChange}
        onFocus={handleCommentChange}
      />
      <button
        className="mt-3.5 px-10 btn-dark bg-purple rounded-2xl text-black font-semibold mouseenter capitalize"
        onClick={handleComment}
      >
        {action}
      </button>
    </>
  );
};

export default CommentField;
