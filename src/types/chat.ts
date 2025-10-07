type Role = "user" | "assistant";

export type ChatMode = "chat" | "search";
export type BotState = "loading" | "typing" | "standby"

export type Message = {
  role: Role;
  content: string;

  image?: string
};


export type ChatState = {
  messages: Message[];
  stream: Message;
  botState: "loading" | "typing" | "standby";
};
