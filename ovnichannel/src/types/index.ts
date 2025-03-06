export interface Channel {
  id: string
  name: string
  provider: string
  created_at: string
  user_id: string
}

export interface Conversation {
  id: string
  channel_id: string
  participant_id: string
  last_message: string | null
  last_message_time: string | null
  created_at: string
  user_id: string
  participant_name?: string
  participant_avatar?: string
}

export interface Message {
  id: string
  content: string
  sender_id: string
  conversation_id: string
  is_read: boolean
  created_at: string
}

export interface Profile {
  id: string
  name: string | null
  avatar_url: string | null
  email: string | null
}

