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
                    name: string | null
                    location: string | null
                    map_preferences: Json
                    last_selected_region: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    name?: string | null
                    location?: string | null
                    map_preferences?: Json
                    last_selected_region?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    name?: string | null
                    location?: string | null
                    map_preferences?: Json
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