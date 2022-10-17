import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../Modal/Modal";
import ModalContent from "../ModalContent/ModalContent";
import Alert from "../Alert/Alert";
import Like from "../Like/Like";
import {
  PostContent,
  PostUser,
  PostUserImg,
  PostUserInfo,
  PostUserName,
  PostUserId,
  MoreBtn,
  PostMain,
  ContentTxt,
  ContentImg,
  PostBtnWrap,
  MsgIcon,
  MsgBtn,
  PostDate,
  PostPopupWrap,
} from "./content.style";

export function Content(props) {
  const {
    userImg,
    userName,
    userId,
    posttext,
    postImg,
    commentNum,
    postDate,
    onClick,
    value,
    postId,
    heartCount,
    hearted,
  } = props;
  const [postModal, setPostModal] = useState(false);
  const [postAlert, setPostAlert] = useState(false);

  let navigate = useNavigate();

  const next = () => {
    navigate("/singlePost", {
      state: {
        postId: postId,
      },
    });
  };

  const postUpdate = () => {
    navigate(`/PostEdit?postId=${value}`, {
      state: {
        postId: value,
        postTxt: posttext,
        postImg: postImg,
        userImg: userImg,
      },
    });
  };

  // 유저의 프로필 이미지 클릭하면 프로필 페이지로 이동
  const moveProfile = () => {
    if (userId === localStorage.getItem("accountname")) {
      navigate(`/myProfile`);
    } else if (userId !== localStorage.getItem("accountname")) {
      navigate(`/yourProfile?id=${userId}`);
    }
  };

  return (
    <PostContent>
      <PostUser>
        <PostUserImg src={userImg} onClick={moveProfile} />
        <PostUserInfo>
          <PostUserName>{userName}</PostUserName>
          <PostUserId>{userId}</PostUserId>
        </PostUserInfo>
        <MoreBtn
          onClick={() => {
            setPostModal(true);
          }}
        ></MoreBtn>
      </PostUser>
      <PostMain onClick={next}>
        <ContentTxt>{posttext}</ContentTxt>
        {postImg.map((file, index) => {
          return <ContentImg src={file} key={index} />;
        })}
      </PostMain>
      <PostBtnWrap>
        <Like heartCount={heartCount} hearted={hearted} postid={value} />
        <MsgIcon>
          <MsgBtn onClick={next}></MsgBtn>
          <strong className="postMessageNum">{commentNum}</strong>
        </MsgIcon>
      </PostBtnWrap>
      <PostDate>
        {postDate
          .slice(0, 11)
          .replace("-", "년 ")
          .replace("-", "월 ")
          .replace("T", "일")}
      </PostDate>
      {window.localStorage.accountname === userId ? (
        <>
          <PostPopupWrap
            className={postModal}
            onClick={() => {
              setPostModal(false);
            }}
          >
            <Modal>
              <ModalContent
                txt="삭제"
                onClick={() => {
                  setPostAlert(true);
                  setPostModal(false);
                }}
              />
              <ModalContent txt="수정" onClick={postUpdate} />
            </Modal>
          </PostPopupWrap>
          <PostPopupWrap className={postAlert}>
            <Alert
              message="게시글을 삭제할까요?"
              cancel="취소"
              confirm="삭제"
              value={value}
              onClickConfirm={onClick}
              onClickCancel={() => setPostAlert(false)}
            />
          </PostPopupWrap>
        </>
      ) : (
        <>
          <PostPopupWrap
            className={postModal}
            onClick={() => {
              setPostModal(false);
            }}
          >
            <Modal>
              <ModalContent
                txt="신고하기"
                onClick={() => {
                  setPostAlert(true);
                  setPostModal(false);
                }}
              />
            </Modal>
          </PostPopupWrap>
          <PostPopupWrap className={postAlert}>
            <Alert
              message="신고하시겠습니까?"
              cancel="취소"
              confirm="신고"
              onClickCancel={() => setPostAlert(false)}
              onClickConfirm={() => setPostAlert(false)}
            />
          </PostPopupWrap>
        </>
      )}
    </PostContent>
  );
}

export function Contents(props) {
  const [content, setContent] = useState([]);
  const url = "https://mandarin.api.weniv.co.kr";
  const token = window.localStorage.getItem("token");
  const accountName = props.accountName;
  const init = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
  };

  useEffect(() => {
    const userpost = async () => {
      const userpostPath = `/post/${accountName}/userpost`;

      try {
        const res = await fetch(url + userpostPath, init);
        const json = await res.json();
        setContent(json.post);
      } catch (err) {
        console.error(err);
      }
    };
    userpost();
  }, []);

  return content.map((item, index) => {
    return (
      <Content
        postId={item.id}
        key={index}
        value={item.id}
        userImg={item.author.image}
        userName={item.author.username}
        userId={item.author.accountname}
        posttext={item.content}
        postImg={item.image ? item.image.split(",") : []}
        heartCount={item.heartCount}
        hearted={item.hearted}
        commentNum={item.commentCount}
        postDate={item.createdAt}
        onClick={props.onClick}
      />
    );
  });
}
