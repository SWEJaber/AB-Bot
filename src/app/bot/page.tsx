"use client";

import { useEffect, useMemo, useReducer, useRef, useState } from "react";

type Role = "user" | "assistant";

type Message = {
  role: Role;
  content: string;
};

type State = {
  input: string;
  messages: Message[];
  stream: string;
  botState: "loading" | "typing" | "standby";
};

const initialState: State = {
  input: "",
  messages: [],
  stream: "",
  botState: "standby",
};

type Action =
  | { type: "SET_INPUT"; payload: string }
  | { type: "ADD_USER_MESSAGE"; payload: string }
  | { type: "APPEND_STREAM"; payload: string }
  | { type: "RESET_STREAM" }
  | { type: "FINALIZE_ASSISTANT_MESSAGE" }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_BOT_TYPING"; payload: boolean };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_INPUT":
      return { ...state, input: action.payload };
    case "ADD_USER_MESSAGE":
      return {
        ...state,

        input: "",
        messages: [
          ...state.messages,
          { role: "user", content: action.payload },
        ],
      };
    case "APPEND_STREAM":
      return {
        ...state,
        botState: "standby",
        stream: state.stream + action.payload,
      };
    case "RESET_STREAM":
      return { ...state, stream: "" };
    case "FINALIZE_ASSISTANT_MESSAGE":
      return {
        ...state,
        messages: [
          ...state.messages,
          { role: "assistant", content: state.stream },
        ],
        stream: "",
      };
    case "SET_LOADING":
      return { ...state, botState: "loading" };
    default:
      return state;
  }
}

export default function Bot() {
  const [mode, setMode] = useState<"chat" | "search">("chat");
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleMode = () =>
    setMode((value) => (value === "chat" ? "search" : "chat"));

  const [chatState, dispatch] = useReducer(reducer, initialState);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!chatState.input.trim()) return;

    const userMessage: Message = { role: "user", content: chatState.input };
    const updatedMessages = [...chatState.messages, userMessage];

    dispatch({ type: "ADD_USER_MESSAGE", payload: chatState.input });

    dispatch({ type: "SET_LOADING", payload: true });

    const res = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({ mode, messages: updatedMessages }),
    });

    const reader = res.body?.getReader();
    const decoder = new TextDecoder();
    let done = false;

    dispatch({ type: "SET_LOADING", payload: false });

    while (!done) {
      const { value, done: doneReading } = await reader!.read();
      done = doneReading;
      const chunk = decoder.decode(value || new Uint8Array(), {
        stream: true,
      });

      console.log("chunk: ", chunk);

      dispatch({ type: "APPEND_STREAM", payload: chunk });
    }

    dispatch({ type: "FINALIZE_ASSISTANT_MESSAGE" });
  };

  useEffect(() => {
    const container = containerRef.current;

    if (container) container.scrollTop = container.scrollHeight;
  }, [chatState.messages.length, chatState.stream]);

  const isInputEnabled = useMemo(
    () => chatState.botState === "standby",
    [chatState.botState, chatState.input]
  );

  return (
    <div className="h-[calc(100vh-4rem)] p-6 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Chat with AP Bot</h1>
      <h2>{mode}</h2>

      <div
        ref={containerRef}
        className="no-scrollbar h-[75%] space-y-4 mb-4 h-[50vh] overflow-y-scroll scroll-smooth"
      >
        {chatState.messages.map((msg, i) => (
          <p key={i}>
            <strong>{msg.role}:</strong> {msg.content}
          </p>
        ))}

        {chatState.stream && (
          <p>
            <strong>assistant:</strong> {chatState.stream}
          </p>
        )}

        {chatState.botState === "loading" ? "loading..." : ""}
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50 hover:cursor-pointer"
        disabled={chatState.botState === "loading"}
        onClick={toggleMode}
      >
        Switch to {mode === "chat" ? "search" : "chat"} mode
      </button>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          className="border px-3 py-2 rounded flex-1"
          value={chatState.input}
          onChange={(e) =>
            dispatch({ type: "SET_INPUT", payload: e.target.value })
          }
          placeholder={
            mode === "chat" ? "Type your message" : "Let's search the web!"
          }
          disabled={!isInputEnabled}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50 hover:cursor-pointer"
          disabled={!isInputEnabled}
        >
          Send
        </button>
      </form>
    </div>
  );
}
