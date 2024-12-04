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
type UserPreferencesUpdate = Database['public']['Tables']['user_preferences']['Update'];

export const UserProfile = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { regions } = useRegions();
    const [saving, setSaving] = useState(false);
    const [preferences, setPreferences] = useState<UserPreferences>({
        id: '',
        name: '',
        location: null,
        map_preferences: {},
        last_selected_region: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    });
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

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
                    const defaultPreferences: UserPreferences = {
                        id: user.id,
                        name: '',
                        location: null,
                        map_preferences: {},
                        last_selected_region: null,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                    };

                    const { error: insertError } = await supabase
                        .from('user_preferences')
                        .insert([defaultPreferences]);

                    if (insertError) throw insertError;
                    setPreferences(defaultPreferences);
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
        setSuccessMessage(null);

        try {
            const updateData: UserPreferencesUpdate = {
                name: preferences.name,
                location: preferences.location,
                map_preferences: preferences.map_preferences,
                last_selected_region: preferences.last_selected_region,
                updated_at: new Date().toISOString(),
            };

            const { error } = await supabase
                .from('user_preferences')
                .update(updateData)
                .eq('id', user.id);

            if (error) throw error;
            setSuccessMessage('Settings saved successfully!');
            setTimeout(() => setSuccessMessage(null), 3000);
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

                {successMessage && (
                    <div className="rounded-md bg-green-900/50 p-4">
                        <div className="text-sm text-green-400">{successMessage}</div>
                    </div>
                )}

                <Input
                    label="Name"
                    required
                    value={preferences.name}
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