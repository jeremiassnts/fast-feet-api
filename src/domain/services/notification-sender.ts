export abstract class NotificationSender {
  abstract send(
    title: string,
    recipient: string,
    content: string,
  ): Promise<void>;
}
