"use client";

import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function ChatPage() {
  const [input, setInput] = useState<string>("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const { messages, status, stop, error, sendMessage } = useChat();

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, status]);

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendMessage({ text: input.trim() });
    setInput("");
  };

  return (
    <div className="stretch mx-auto flex w-full max-w-md flex-col py-24">
      {error && (
        <p className="text-sm font-semibold text-red-500">{error.message}</p>
      )}

      <div ref={scrollRef} className="max-h-180 space-y-4 overflow-y-auto pr-1">
        {messages.map((message) => (
          <div key={message.id} className="mb-4">
            <div className="font-semibold">
              {message.role === "user" ? "You:" : "AI:"}
            </div>
            {message.parts.map((part, index) => {
              switch (part.type) {
                case "text":
                  return (
                    <div
                      key={`${message.id}-${index}`}
                      className="whitespace-pre-wrap"
                    >
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {part.text}
                      </ReactMarkdown>
                    </div>
                  );
                default:
                  return null;
              }
            })}
          </div>
        ))}
      </div>

      {(status === "submitted" || status === "streaming") && (
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-blue-400"></div>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="fixed right-0 bottom-0 left-0 mx-auto w-full max-w-md border-t border-zinc-200 bg-zinc-50 p-4 shadow-lg dark:border-zinc-800 dark:bg-zinc-950"
      >
        <div className="flex gap-2">
          <input
            className="flex-1 rounded border border-zinc-300 p-2 shadow-xl dark:border-zinc-700 dark:bg-zinc-800"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="How can I help you?"
          />
          {status === "submitted" || status === "streaming" ? (
            <button
              onClick={stop}
              className="rounded bg-red-500 px-4 py-2 text-white transition-colors hover:bg-red-600"
            >
              Stop
            </button>
          ) : (
            <button
              type="submit"
              className="rounded bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={status !== "ready"}
            >
              Send
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
