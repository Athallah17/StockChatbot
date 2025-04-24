export type IntentType =
  | 'trend'
  | 'historical'
  | 'live_price'
  | 'full_analysis'
  | 'financial'
  | 'dividends'
  | 'sector_info'
  | 'buy_sell'
  | 'analysis'
  | 'unknown'

export const classifyIntent = (message: string): IntentType => {
  const msg = message.toLowerCase()

  if (/historical|past|previous|history/.test(msg)) return 'historical'
  if (/trend|growth|moving average|direction/.test(msg)) return 'trend'
  if (/price|today|current|value now/.test(msg)) return 'live_price'
  if (/volatility|support|resistance|technical|full/.test(msg)) return 'full_analysis'
  if (/financial|pe|eps|market cap/.test(msg)) return 'financial'
  if (/dividend|earnings/.test(msg)) return 'dividends'
  if (/sector|industry/.test(msg)) return 'sector_info'
  if (/buy|sell|recommend|suggest|advice/.test(msg)) return 'buy_sell'
  if (/analysis|analyze|analyzer|crew/.test(msg)) return 'analysis'

  return 'unknown'
}
