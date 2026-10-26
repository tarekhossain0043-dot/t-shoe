"use client";

import { MessageCircle } from "lucide-react";

const MESSENGER_URL = "https://m.me/61593737953583";

export default function MessengerButton() {
  return (
    <a
      className="messenger-float"
      href={MESSENGER_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Message T-Shoe on Facebook Messenger"
      title="Message us on Messenger"
    >
      <MessageCircle size={25} strokeWidth={2.5} aria-hidden="true" />
      <span>Message us</span>
    </a>
  );
}
