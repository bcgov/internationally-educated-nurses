export interface ChesResponse {
  txId: string;
  messages: [
    {
      msgId: string;
      to: string[];
    },
  ];
}
