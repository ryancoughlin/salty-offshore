import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/AuthContext';
import { supabase } from '../../auth/supabase';
import { useRegions } from '../../hooks/useRegions';
import { Database } from '../../types/supabase';

type UserPreferences = Database['public']['Tables']['user_preferences']['Row'];

export const UserProfile = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { regions } = useRegions();
    const [loading, setLoading] = useState(true);
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
            } finally {
                setLoading(false);
            }
        };

        loadPreferences();
    }, [user]);

    const handleSave = async () => {
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
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error saving preferences');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white shadow sm:rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Profile Settings</h3>

                        {error && (
                            <div className="mt-4 rounded-md bg-red-50 p-4">
                                <div className="text-sm text-red-700">{error}</div>
                            </div>
                        )}

                        <div className="mt-6 space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Theme</label>
                                <select
                                    value={preferences.theme}
                                    onChange={(e) => setPreferences({ ...preferences, theme: e.target.value })}
                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                >
                                    <option value="light">Light</option>
                                    <option value="dark">Dark</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Default Region</label>
                                <select
                                    value={preferences.last_selected_region || ''}
                                    onChange={(e) => setPreferences({
                                        ...preferences,
                                        last_selected_region: e.target.value || null
                                    })}
                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                >
                                    <option value="">No default region</option>
                                    {regions.map((region) => (
                                        <option key={region.id} value={region.id}>
                                            {region.name}
                                        </option>
                                    ))}
                                </select>
                                <p className="mt-1 text-sm text-gray-500">
                                    This region will be automatically selected when you log in.
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Map Preferences</label>
                                <div className="mt-1 space-y-2">
                                    <label className="inline-flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={preferences.map_preferences?.showLabels ?? true}
                                            onChange={(e) => setPreferences({
                                                ...preferences,
                                                map_preferences: {
                                                    ...preferences.map_preferences,
                                                    showLabels: e.target.checked,
                                                },
                                            })}
                                            className="form-checkbox h-4 w-4 text-blue-600"
                                        />
                                        <span className="ml-2 text-sm text-gray-600">Show Labels</span>
                                    </label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Notifications</label>
                                <div className="mt-1 space-y-2">
                                    <label className="inline-flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={preferences.notification_settings?.emailUpdates ?? true}
                                            onChange={(e) => setPreferences({
                                                ...preferences,
                                                notification_settings: {
                                                    ...preferences.notification_settings,
                                                    emailUpdates: e.target.checked,
                                                },
                                            })}
                                            className="form-checkbox h-4 w-4 text-blue-600"
                                        />
                                        <span className="ml-2 text-sm text-gray-600">Email Updates</span>
                                    </label>
                                </div>
                            </div>

                            <div className="flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => navigate(-1)}
                                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="bg-blue-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                                >
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}; 