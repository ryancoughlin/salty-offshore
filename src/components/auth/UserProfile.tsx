import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { supabase } from '../../auth/supabase';
import { useRegions } from '../../hooks/useRegions';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { AccountLayout } from '../account/AccountLayout';
import { AccountRegionSelect } from '../account/AccountRegionSelect';
import type { Database } from '../../types/supabase';

type UserPreferences = Database['public']['Tables']['user_preferences']['Row'];

export const UserProfile = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { regions } = useRegions();
    const [saving, setSaving] = useState(false);
    const [preferences, setPreferences] = useState<Partial<UserPreferences>>({
        theme: 'light',
        map_preferences: {},
        notification_settings: {},
        last_selected_region: null,
    });
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadPreferences = async () => {
            if (!user) return;

            try {
                const { data, error } = await supabase
                    .from('user_preferences')
                    .select('*')
                    .eq('id', user.id)
                    .single();

                if (error) throw error;

                if (data) {
                    setPreferences(data);
                } else {
                    // Create default preferences if none exist
                    const { error: insertError } = await supabase
                        .from('user_preferences')
                        .insert([
                            {
                                id: user.id,
                                theme: 'light',
                                map_preferences: {},
                                notification_settings: {},
                                last_selected_region: null,
                            },
                        ]);

                    if (insertError) throw insertError;
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Error loading preferences');
            }
        };

        loadPreferences();
    }, [user]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setSaving(true);
        setError(null);

        try {
            const { error } = await supabase
                .from('user_preferences')
                .upsert({
                    id: user.id,
                    ...preferences,
                    updated_at: new Date().toISOString(),
                });

            if (error) throw error;
            navigate(-1);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error saving preferences');
        } finally {
            setSaving(false);
        }
    };

    return (
        <AccountLayout>
            <form onSubmit={handleSave} className="space-y-6">
                {error && (
                    <div className="rounded-md bg-red-900/50 p-4">
                        <div className="text-sm text-red-400">{error}</div>
                    </div>
                )}

                <Input
                    label="Name"
                    required
                    value={preferences.name || ''}
                    onChange={(e) => setPreferences({ ...preferences, name: e.target.value })}
                />

                <Input
                    label="Location"
                    value={preferences.location || ''}
                    onChange={(e) => setPreferences({ ...preferences, location: e.target.value })}
                />

                <AccountRegionSelect
                    label="Favorite Region"
                    helperText="This region will be automatically selected when you log in."
                    regions={regions}
                    value={preferences.last_selected_region || null}
                    onChange={(value) => setPreferences({
                        ...preferences,
                        last_selected_region: value
                    })}
                />

                <div className="flex justify-end gap-2 mt-8">
                    <Button
                        variant="secondary"
                        type="button"
                        onClick={() => navigate(-1)}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        type="submit"
                        disabled={saving}
                    >
                        {saving ? 'Saving...' : 'Save'}
                    </Button>
                </div>
            </form>
        </AccountLayout>
    );
}; 