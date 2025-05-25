export interface Message {
  sender: 'user' | 'bot'
  text: string | {
    action: string
    response: any
  }
}