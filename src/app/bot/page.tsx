"use client";

import InputField from "@/components/InputField";
import Chat from "@/components/Chat";
import { ChatMode, ChatState, Message } from "@/types";
import { useReducer, useState } from "react";

const initialState: ChatState = {
  messages: [],
  stream: { role: "assistant", image: "", content: "" },
  botState: "standby",
};

type Action =
  | { type: "ADD_USER_MESSAGE"; payload: string }
  | { type: "APPEND_STREAM_CONTENT"; payload: string }
  | { type: "APPEND_STREAM_IMAGE"; payload: string }
  | { type: "FINALIZE_ASSISTANT_MESSAGE" }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "RESET_BOT" };

function reducer(state: ChatState, action: Action): ChatState {
  switch (action.type) {
    case "ADD_USER_MESSAGE":
      return {
        ...state,

        messages: [
          ...state.messages,
          { role: "user", content: action.payload },
        ],
      };

    case "SET_LOADING":
      return { ...state, botState: "loading" };
    case "RESET_BOT":
      return { ...state, botState: "standby" };
    case "APPEND_STREAM_CONTENT":
      return {
        ...state,
        botState: "typing",
        stream: {
          ...state.stream,
          content: state.stream.content + action.payload,
        },
      };

    case "APPEND_STREAM_IMAGE":
      return {
        ...state,
        botState: "typing",
        stream: {
          ...state.stream,

          image: action.payload,
        },
      };
    case "FINALIZE_ASSISTANT_MESSAGE":
      return {
        ...state,
        botState: "standby",
        messages: [...state.messages, state.stream],
        stream: initialState.stream,
      };

    default:
      return state;
  }
}

export default function Bot() {
  const [mode, setMode] = useState<ChatMode>("chat");

  const toggleMode = () =>
    setMode((value) => (value === "chat" ? "search" : "chat"));

  const [chatState, dispatch] = useReducer(reducer, initialState);

  const sendMessage = async (userMessage: Message) => {
    const updatedMessages = [...chatState.messages, userMessage];

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ messages: updatedMessages }),
      });

      if (res.status !== 200) throw res.statusText;

      dispatch({ type: "SET_LOADING", payload: false });

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: doneReading } = await reader!.read();
        done = doneReading;
        const chunk = decoder.decode(value || new Uint8Array(), {
          stream: true,
        });

        console.log("chunk: ", chunk);

        dispatch({ type: "APPEND_STREAM_CONTENT", payload: chunk });
      }

      dispatch({ type: "FINALIZE_ASSISTANT_MESSAGE" });
    } catch (err) {
      // Catch network errors, JSON parsing errors, etc.
      console.error("Fetch error:", err);
      dispatch({ type: "RESET_BOT" });
      alert(`Network error: ${err}`);
    }
  };

  const search = async (messageContent: string) => {
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        body: JSON.stringify({ message: messageContent }),
      });

      if (res.status !== 200) throw res.statusText;

      dispatch({ type: "SET_LOADING", payload: false });

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let done = false;

      if (!reader) {
        return;
      }

      while (!done && reader) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        const chunk = decoder.decode(value);

        for (const line of chunk.split("\n")) {
          if (!line.trim()) continue;
          try {
            const parsed = JSON.parse(line);
            if (parsed.type === "image")
              dispatch({
                type: "APPEND_STREAM_IMAGE",
                payload: parsed.data.image,
              });
            else if (parsed.type === "text")
              dispatch({
                type: "APPEND_STREAM_CONTENT",
                payload: parsed.data,
              });
          } catch (err) {
            console.error("Failed to parse chunk:", line, err);
          }
        }
      }

      dispatch({ type: "FINALIZE_ASSISTANT_MESSAGE" });
    } catch (err) {
      // Catch network errors, JSON parsing errors, etc.
      console.error("Fetch error:", err);
      dispatch({ type: "RESET_BOT" });
      alert(`Network error: ${err}`);
    }
  };

  const submit = async (messageContent: string) => {
    if (!messageContent.trim()) return;

    const userMessage: Message = { role: "user", content: messageContent };

    dispatch({ type: "ADD_USER_MESSAGE", payload: messageContent });

    dispatch({ type: "SET_LOADING", payload: true });

    if (mode === "chat") {
      sendMessage(userMessage);
    } else {
      search(messageContent);
    }
  };

  return (
    <div className={"h-[calc(100vh-4rem)] p-6 max-w-3xl mx-auto "}>
      <h1 className="text-xl font-bold mb-4">
        {mode === "chat" ? "Chat" : "Search the web"} with AP Bot
      </h1>

      <div className="flex flex-col h-full justify-center">
        {chatState.messages.length > 0 ? (
          <Chat mode={mode} chatState={chatState} />
        ) : (
          <p className="text-center text-4xl">
            Welcome to AP chat bot, Enjoy your stay here!
          </p>
        )}

        <InputField
          mode={mode}
          toggleMode={toggleMode}
          botState={chatState.botState}
          isDisabled={chatState.botState !== "standby"}
          sendMessage={submit}
        />
      </div>
    </div>
  );
}
