type Role = "user" | "assistant";

export type ChatMode = "chat" | "search";
export type BotState = "loading" | "typing" | "standby"

export type Message = {
  role: Role;
  content: string;
};


export type ChatState = {
  messages: Message[];
  stream: string;
  botState: "loading" | "typing" | "standby";
};
