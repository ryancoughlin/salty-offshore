export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            user_preferences: {
                Row: {
                    id: string
                    theme: string
                    map_preferences: Json
                    notification_settings: Json
                    last_selected_region: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    theme?: string
                    map_preferences?: Json
                    notification_settings?: Json
                    last_selected_region?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    theme?: string
                    map_preferences?: Json
                    notification_settings?: Json
                    last_selected_region?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
    }
} 