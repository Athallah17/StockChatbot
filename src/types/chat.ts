export type Message = {
    sender: 'user' | 'bot'
    text: string | {
      action: string
      response: any
    }
  }
