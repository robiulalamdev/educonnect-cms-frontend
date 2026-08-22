import type { Metadata } from "next";
import { MessagingApp } from "./messaging-app";

export const metadata: Metadata = {
  title: "Messages",
  description: "Your messages",
};

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ chat?: string }>;
}) {
  const { chat } = await searchParams;
  return <MessagingApp initialChatId={chat} />;
}