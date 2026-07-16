import type { Metadata } from "next";
import { MessagingApp } from "./messaging-app";

export const metadata: Metadata = {
  title: "Messages",
  description: "Your messages",
};

export default function MessagesPage() {
  return <MessagingApp />;
}
