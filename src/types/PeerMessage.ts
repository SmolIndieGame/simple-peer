type TextMessage = {
  type: "textMessage";
  message: string;
};

type UserNameMessage = {
  type: "userName";
  name: string;
};

export type PeerMessage = TextMessage | UserNameMessage | undefined;
