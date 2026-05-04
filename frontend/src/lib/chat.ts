import { api } from "./api";

export type ChatMessage = { role: "user" | "assistant"; content: string };

export async function sendChat(messages: ChatMessage[]): Promise<string> {
  const res = await api.post<{ success: boolean; data: { message: string } }>("/api/chat", { messages });
  return res.data.data.message;
}
