import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useReservations = (userId: string | undefined) => {
    return useQuery({
        queryKey: ['reservations', userId],
        queryFn: async () => {
            if (!userId) return [];
            const { data, error } = await supabase
                .from('reservations')
                .select('*')
                .eq('user_id', userId);

            if (error) throw error;
            return data;
        },
        enabled: !!userId,
    });
};
