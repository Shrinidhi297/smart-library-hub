import React from "react";
import { CheckCircle, XCircle, Clock, User, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Reservation {
    id: string;
    user_id: string;
    book_id: string;
    status: 'pending' | 'active' | 'overdue' | 'returned';
    reserved_date: string;
    due_date: string;
    books: {
        title: string;
    };
}

export const AdminReservationPanel: React.FC = () => {
    const queryClient = useQueryClient();

    const { data: reservations = [], isLoading } = useQuery({
        queryKey: ['admin-pending-reservations'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('reservations')
                .select(`
                    *,
                    books (title),
                    profiles (full_name)
                `)
                .eq('status', 'pending')
                .order('reserved_date', { ascending: false });
            if (error) throw error;
            return data as any[];
        }
    });

    const updateReservationMutation = useMutation({
        mutationFn: async ({ id, status, bookId }: { id: string, status: 'active' | 'returned', bookId: string }) => {
            // Update reservation status
            const { error: statusError } = await supabase
                .from('reservations')
                .update({ status })
                .eq('id', id);

            if (statusError) throw statusError;

            // If rejected (returned), increment available copies back
            if (status === 'returned') {
                const { data: book } = await supabase
                    .from('books')
                    .select('available_copies')
                    .eq('id', bookId)
                    .single();

                if (book) {
                    const { error: copyError } = await supabase
                        .from('books')
                        .update({ available_copies: book.available_copies + 1 })
                        .eq('id', bookId);

                    if (copyError) throw copyError;
                }
            }
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['admin-pending-reservations'] });
            queryClient.invalidateQueries({ queryKey: ['books'] });
            queryClient.invalidateQueries({ queryKey: ['user-reservations'] });
            toast.success(
                variables.status === 'active' ? "Reservation Approved" : "Reservation Rejected",
                { description: variables.status === 'active' ? "The book is now officially reserved." : "Book copies have been restored." }
            );
        },
        onError: (error: any) => {
            toast.error("Action Failed", { description: error.message });
        }
    });

    if (reservations.length === 0 && !isLoading) return null;

    return (
        <div className="animate-nova-in" style={{ animationDelay: '150ms' }}>
            <div className="glass-panel p-10 md:p-16 relative overflow-hidden group border-blue-100 border-2 mb-10">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50 rounded-full blur-[100px] -mr-48 -mt-48 opacity-50 group-hover:opacity-100 transition-opacity" />

                <div className="relative z-10">
                    <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-8 md:mb-10 flex flex-wrap items-center gap-4">
                        <div className="w-2 md:w-3 h-8 md:h-10 bg-blue-500 rounded-full shrink-0" />
                        Pending <span className="text-blue-600 italic">Reservations</span>
                        <span className="px-3 md:py-1 bg-blue-100 text-blue-600 rounded-full text-[10px] md:text-sm font-black">
                            {reservations.length} New
                        </span>
                    </h3>

                    {isLoading && (
                        <div className="p-10 text-center">
                            <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto" />
                        </div>
                    )}

                    <div className="grid gap-6">
                        {reservations.map((res) => (
                            <div key={res.id} className="bg-white p-6 md:p-8 rounded-[1.5rem] md:rounded-3xl border-2 border-slate-100 hover:border-blue-200 transition-all group">
                                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                                    <div className="flex items-center gap-4 md:gap-6">
                                        <div className="shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center bg-blue-50 text-blue-600">
                                            <BookOpen className="h-6 w-6 md:h-7 md:w-7" />
                                        </div>
                                        <div className="min-w-0">
                                            <h4 className="text-lg md:text-xl font-black text-slate-900 mb-1 truncate md:whitespace-normal">{res.books?.title}</h4>
                                            <div className="flex flex-wrap items-center gap-2 md:gap-3 text-slate-400 text-[10px] md:text-sm font-bold">
                                                <div className="flex items-center gap-2">
                                                    <User className="h-3 w-3 md:h-4 md:w-4" />
                                                    <span className="truncate max-w-[150px] md:max-w-none">
                                                        {res.profiles?.full_name || `User: ${res.user_id.slice(-8).toUpperCase()}`}
                                                    </span>
                                                </div>
                                                <span>•</span>
                                                <span>{new Date(res.reserved_date).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-2 sm:gap-3">
                                        <Button
                                            onClick={() => updateReservationMutation.mutate({
                                                id: res.id,
                                                status: 'returned',
                                                bookId: res.book_id
                                            })}
                                            disabled={updateReservationMutation.isPending}
                                            variant="outline"
                                            className="h-10 md:h-12 px-5 md:px-6 rounded-xl md:rounded-2xl border-red-200 text-red-600 hover:bg-red-50 font-black text-[10px] md:text-xs uppercase tracking-widest flex-1 sm:flex-none"
                                        >
                                            Reject
                                        </Button>
                                        <Button
                                            onClick={() => updateReservationMutation.mutate({
                                                id: res.id,
                                                status: 'active',
                                                bookId: res.book_id
                                            })}
                                            disabled={updateReservationMutation.isPending}
                                            className="h-10 md:h-12 px-5 md:px-6 rounded-xl md:rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-[10px] md:text-xs uppercase tracking-widest flex-1 sm:flex-none"
                                        >
                                            Approve
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
