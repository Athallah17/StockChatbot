import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

interface Props {
  value: string
  onChange: (val: string) => void
  onSend: () => void
}

const ChatInput = ({ value, onChange, onSend }: Props) => {
  return (
    <div className="flex gap-2">
      <Textarea
        rows={1}
        className="flex-grow resize-none rounded-xl border px-4 py-2"
        placeholder="Message..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            onSend()
          }
        }}
      />
      <Button onClick={onSend}>Send</Button>
    </div>
  )
}

export default ChatInput
