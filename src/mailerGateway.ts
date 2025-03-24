export interface MailerGateway {
  send(to: string, subject: string, body: string): Promise<void>
}

export class MailerGatewayMemory implements MailerGateway {
  async send(to: string, subject: string, body: string): Promise<void> {
    console.log(`Sending email to ${to} with subject ${subject} and body ${body}`)
  }
}
