// deno-lint-ignore-file no-explicit-any
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const url = Deno.env.get('SUPABASE_URL')
const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
const botToken = Deno.env.get('TELEGRAM_BOT_TOKEN')

const supabase = createClient(url!, serviceKey!)

const sendTelegram = async (chatId: string, text: string) => {
  if (!botToken) return { ok: false, error: 'No bot token' }
  const resp = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text })
  })
  const data = await resp.json()
  return { ok: resp.ok, data }
}

const today = () => new Date().toISOString().slice(0, 10)

export default async function handler(req: Request): Promise<Response> {
  try {
    const tdy = today()
    let rows: any[] = []
    let sel = 'telegram_id,name,current_day,last_push_date'
    let { data, error } = await supabase
      .from('users')
      .select(sel)
      .lte('current_day', 10)
    if (error) {
      // fallback without last_push_date column
      const fallback = await supabase
        .from('users')
        .select('telegram_id,name,current_day')
        .lte('current_day', 10)
      rows = fallback.data || []
    } else {
      rows = data || []
    }

    const toPush = rows.filter(r => !r.last_push_date || r.last_push_date !== tdy)
    const results: any[] = []
    for (const u of toPush) {
      const text = `🎁 Привет, ${u.name || 'друг'}! Твой текущий день: ${u.current_day}. Возвращайся в календарь и продолжай приключение!`
      const res = await sendTelegram(u.telegram_id, text)
      if (res.ok) {
        const up = await supabase
          .from('users')
          .update({ last_push_date: tdy })
          .eq('telegram_id', String(u.telegram_id))
        results.push({ id: u.telegram_id, sent: true, updateError: up.error?.message })
      } else {
        results.push({ id: u.telegram_id, sent: false, error: res.error || res.data })
      }
    }
    return new Response(JSON.stringify({ pushed: results.length, results }), { status: 200, headers: { 'Content-Type': 'application/json' } })
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500 })
  }
}
