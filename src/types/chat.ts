type Role = "user" | "assistant";

export type Message = {
  role: Role;
  content: string;
};

export type BotState = "loading" | "typing" | "standby"