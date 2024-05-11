import React from "react"
import { StyledChatBubble } from "./styles"

export enum ChatType {
  USER = "sender",
  SYSTEM = "receiver",
  IMAGE = "image",
}

export type IChat = {
  id: string
  text: string
  type: ChatType
  isDefault?: boolean
  image?: string;
}

type Props = {
  text: string
  type: ChatType
}

const ChatBubble: React.FC<Props> = (props) => {
  return (
    <StyledChatBubble className={props.type}>{props.text}</StyledChatBubble>
  )
}

export default ChatBubble