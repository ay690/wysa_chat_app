import React, { createRef, useEffect, useRef, useState } from "react";
import { ChatInput, StyledChat } from "./styles";
import { v4 as uuidv4 } from "uuid";
import { Navigate } from "react-router-dom";
import { TransitionGroup, CSSTransition } from "react-transition-group";

import { defaultChats } from "../../constants/chats";
import { getFromLocalStorage } from "../../helpers/storage";

import { Icon } from "../../components/Icon";
import ChatBubble, { ChatType, IChat } from "../../components/ChatBubble";

type Props = {
  chatAnimationDelay: number;
};

const TRANSITION_DELAY = 100;

const Chat: React.FC<Props> = ({ chatAnimationDelay }) => {
  const [chats, setChats] = useState<IChat[]>(defaultChats);
  const [animate, setAnimate] = useState(false);

  const inputRef = createRef<HTMLInputElement>();
  const chatsEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Getting login state from local storage
  const loggedIn = getFromLocalStorage("login-state");

  // Scrolling to the bottom of chats container
  // and animating the chat bubbles
  useEffect(() => {
    if (!chatsEndRef.current) return;
    chatsEndRef.current.scrollIntoView({ behavior: "smooth" });
  }, [chats]);

  // Starting the text bubble animation
  useEffect(() => {
    setAnimate(true);
  }, []);

  const inputChatHandler = () => {
    if (!inputRef.current) return;

    const text = inputRef.current.value.trim();
    if (text === "") return;

    inputRef.current.value = "";
    inputRef.current.focus();

    const chat = {
      id: uuidv4(),
      text: text,
      type: ChatType.USER,
    };
    setChats((prev) => [...prev, chat]);
  };

  const picUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Trigger file input click event
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const chat = {
          id: uuidv4(),
          image: reader.result as string,
          type: ChatType.IMAGE,
        };
        setChats((prev) => [...prev, chat]);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <StyledChat>
      {!loggedIn && <Navigate to="/" replace />}
      <TransitionGroup component="ul">
        <>
          {chats.map((chat, index) => (
            <CSSTransition
              in={animate}
              key={chat.id}
              classNames="chat-bubble"
              timeout={{
                enter: chat.isDefault
                  ? chatAnimationDelay * (index + 1)
                  : TRANSITION_DELAY,
              }}
            >
              {chat.type === ChatType.IMAGE ? (
                <img
                  src={chat.image}
                  alt="Uploaded"
                  style={{ maxWidth: "25%", alignSelf: "flex-end" }}
                />
              ) : (
                <ChatBubble text={chat.text} type={chat.type} />
              )}
            </CSSTransition>
          ))}
        </>
        <div ref={chatsEndRef} />
      </TransitionGroup>
      <ChatInput>
        <input
          ref={inputRef}
          type="text"
          placeholder="Ask something..."
          onKeyDown={(e) => e.key !== "Enter" || inputChatHandler()}
        />
        <button onClick={() => picUpload()}>
          <Icon src="/src/assets/paper-clip-svgrepo-com.svg" />
        </button>
        <button onClick={() => inputChatHandler()}>
          <Icon src="/src/assets/send.svg" />
        </button>
      </ChatInput>
      {/* Hidden file input for image upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFileInputChange}
      />
    </StyledChat>
  );
};

export default Chat;

