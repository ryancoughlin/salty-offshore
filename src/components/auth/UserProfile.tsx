import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../auth/AuthContext';
import { supabase } from '../../auth/supabase';
import { useRegions } from '../../hooks/useRegions';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { AccountLayout } from '../account/AccountLayout';
import { AccountRegionSelect } from '../account/AccountRegionSelect';
import { Banner } from '../ui/Banner';
import { useState } from 'react';

type FormValues = {
    name: string;
    location: string;
    last_selected_region: string | null;
};

export const UserProfile = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { regions } = useRegions();
    const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setValue,
        watch
    } = useForm<FormValues>({
        defaultValues: async () => {
            if (!user) return { name: '', location: '', last_selected_region: null };

            const { data } = await supabase
                .from('user_preferences')
                .select('*')
                .eq('id', user.id)
                .single();

            return {
                name: data?.name || '',
                location: data?.location || '',
                last_selected_region: data?.last_selected_region || null
            };
        }
    });

    const onSubmit = async (data: FormValues) => {
        if (!user) return;

        const updates = {
            name: data.name.trim(),
            location: data.location?.trim() || null,
            last_selected_region: data.last_selected_region,
            updated_at: new Date().toISOString()
        };

        try {
            const { error } = await supabase
                .from('user_preferences')
                .update(updates)
                .eq('id', user.id);

            if (error) throw error;

            setNotification({ type: 'success', message: 'Profile updated successfully' });
        } catch (error) {
            console.error('Failed to update profile:', error);
            setNotification({
                type: 'error',
                message: error instanceof Error ? error.message : 'Failed to update profile. Please try again.'
            });
        }
    };

    return (
        <AccountLayout>
            {notification && (
                <Banner
                    type={notification.type}
                    message={notification.message}
                    onClose={() => {
                        setNotification(null);
                        if (notification.type === 'success') {
                            navigate(-1);
                        }
                    }}
                />
            )}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
                <Input
                    label="Name"
                    required
                    error={errors.name?.message}
                    {...register('name', {
                        required: 'Name is required',
                        minLength: {
                            value: 2,
                            message: 'Name must be at least 2 characters'
                        }
                    })}
                />

                <Input
                    label="Location"
                    error={errors.location?.message}
                    {...register('location')}
                />

                <AccountRegionSelect
                    label="Favorite Region"
                    helperText="This region will be automatically selected when you log in."
                    regions={regions}
                    value={watch('last_selected_region')}
                    onChange={(value) => setValue('last_selected_region', value)}
                />

                <div className="flex justify-end">
                    <Button
                        variant="primary"
                        type="submit"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Saving...' : 'Save'}
                    </Button>
                </div>
            </form>
        </AccountLayout>
    );
}; 