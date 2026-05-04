"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { sendChat, type ChatMessage } from "@/lib/chat";

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const newMessages: ChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    try {
      const reply = await sendChat(newMessages);
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "오류가 발생했습니다. 다시 시도해주세요." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* 플로팅 버튼 */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-white text-black shadow-lg transition hover:scale-105 hover:shadow-xl"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>

      {/* 채팅창 */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 flex w-80 flex-col rounded-2xl bg-zinc-900 shadow-2xl ring-1 ring-white/10 md:w-96">
          {/* 헤더 */}
          <div className="flex items-center gap-2.5 border-b border-white/10 px-4 py-3">
            <MessageCircle size={16} className="text-white/60" />
            <p className="text-sm font-semibold">제목 찾기</p>
          </div>

          {/* 메시지 목록 */}
          <div className="flex h-80 flex-col gap-3 overflow-y-auto px-4 py-3">
            {messages.length === 0 && (
              <div className="my-auto text-center text-xs text-white/30 leading-relaxed">
                영화나 드라마 제목이 기억 안 날 때<br />
                줄거리나 장면을 설명해보세요!<br />
                <span className="mt-2 block text-white/20">예: "90년대 영화인데 주인공이 시간여행해요"</span>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                    m.role === "user"
                      ? "bg-white text-black rounded-br-sm"
                      : "bg-white/10 text-white/90 rounded-bl-sm"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-sm bg-white/10 px-3.5 py-2.5">
                  <Loader2 size={13} className="animate-spin text-white/50" />
                  <span className="text-xs text-white/40">찾는 중...</span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* 입력창 */}
          <div className="border-t border-white/10 p-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                placeholder="기억나는 내용을 입력하세요..."
                disabled={loading}
                className="flex-1 rounded-xl bg-white/10 px-3.5 py-2.5 text-sm outline-none placeholder:text-white/30 focus:bg-white/15 disabled:opacity-50"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-black transition hover:bg-white/90 disabled:opacity-40"
              >
                <Send size={15} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
