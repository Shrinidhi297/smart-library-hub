import React from "react";
import { CheckCircle, XCircle, Clock, User, Trash2, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface RenewalRequest {
    id: string;
    user_name: string;
    book_title: string;
    request_date: string;
    status: 'pending' | 'approved' | 'rejected';
    reservation_id: string;
}

interface Reservation {
    id: string;
    user_id: string;
    book_id: string;
    status: 'pending' | 'active' | 'overdue' | 'returned';
    reserved_date: string;
    due_date: string;
    books?: {
        title: string;
    };
    profiles?: {
        full_name: string;
    };
}

export const AdminRenewalPanel: React.FC = () => {
    const queryClient = useQueryClient();

    // 1. Fetch Renewal Requests
    const { data: renewalRequests = [], isLoading: loadingRenewals } = useQuery({
        queryKey: ['renewal-requests'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('renewal_requests')
                .select('*')
                .order('request_date', { ascending: false });
            if (error) throw error;
            return data as RenewalRequest[];
        }
    });

    // 2. Fetch Pending Reservations
    const { data: reservations = [], isLoading: loadingReservations } = useQuery({
        queryKey: ['admin-pending-reservations'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('reservations')
                .select(`
                    *,
                    books (title)
                `)
                .order('reserved_date', { ascending: false });

            if (error) throw error;

            const allPending = data?.filter(r => r.status?.toLowerCase() === 'pending') || [];

            if (allPending.length === 0) return [];

            const userIds = [...new Set(allPending.map(r => r.user_id))];
            if (userIds.length > 0) {
                const { data: profiles } = await supabase
                    .from('profiles')
                    .select('id, full_name')
                    .in('id', userIds);

                if (profiles) {
                    const profileMap = Object.fromEntries(profiles.map(p => [p.id, p.full_name]));
                    return allPending.map(r => ({
                        ...r,
                        profiles: { full_name: profileMap[r.user_id] }
                    }));
                }
            }
            return allPending as any[];
        }
    });

    // Mutations
    const updateRenewalMutation = useMutation({
        mutationFn: async ({ id, status, reservationId }: { id: string, status: 'approved' | 'rejected', reservationId: string }) => {
            const { error: updateError } = await supabase
                .from('renewal_requests')
                .update({ status })
                .eq('id', id);

            if (updateError) throw updateError;

            if (status === 'approved') {
                const { data: reservation } = await supabase
                    .from('reservations')
                    .select('due_date')
                    .eq('id', reservationId)
                    .single();

                if (reservation) {
                    const currentDueDate = new Date(reservation.due_date);
                    const newDueDate = new Date(currentDueDate.getTime() + 14 * 24 * 60 * 60 * 1000);

                    const { error: extendError } = await supabase
                        .from('reservations')
                        .update({ due_date: newDueDate.toISOString() })
                        .eq('id', reservationId);

                    if (extendError) throw extendError;
                }
            }
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['renewal-requests'] });
            queryClient.invalidateQueries({ queryKey: ['user-reservations'] });
            toast.success(variables.status === 'approved' ? "Request Approved" : "Request Rejected");
        },
        onError: (error: any) => toast.error("Action Failed", { description: error.message })
    });

    const deleteRenewalMutation = useMutation({
        mutationFn: async (id: string) => {
            const { error } = await supabase.from('renewal_requests').delete().eq('id', id);
            if (error) throw error;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['renewal-requests'] });
            toast.success("Record Deleted");
        }
    });

    const updateReservationMutation = useMutation({
        mutationFn: async ({ id, status, bookId }: { id: string, status: 'active' | 'returned', bookId: string }) => {
            const { error: statusError } = await supabase
                .from('reservations')
                .update({ status })
                .eq('id', id);

            if (statusError) throw statusError;

            if (status === 'returned') {
                const { data: book } = await supabase.from('books').select('available_copies').eq('id', bookId).single();
                if (book) {
                    await supabase.from('books').update({ available_copies: book.available_copies + 1 }).eq('id', bookId);
                }
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-pending-reservations'] });
            queryClient.invalidateQueries({ queryKey: ['books'] });
            toast.success("Reservation Updated");
        },
        onError: (error: any) => toast.error("Update Failed", { description: error.message })
    });

    const pendingRenewals = renewalRequests.filter(r => r.status === 'pending');

    return (
        <div className="space-y-10 animate-nova-in">
            {/* RESERVATIONS SECTION */}
            <div className="glass-panel p-10 md:p-16 relative overflow-hidden group border-blue-100 border-2">
                <div className="absolute top-0 left-0 w-96 h-96 bg-blue-50 rounded-full blur-[100px] -ml-48 -mt-48 opacity-50 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                    <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-8 md:mb-10 flex flex-wrap items-center gap-4">
                        <div className="w-2 md:w-3 h-8 md:h-10 bg-blue-500 rounded-full shrink-0" />
                        Pending <span className="text-blue-600 italic">Reservations</span>
                        {reservations.length > 0 && (
                            <span className="px-3 md:py-1 bg-blue-100 text-blue-600 rounded-full text-[10px] md:text-sm font-black">
                                {reservations.length} New
                            </span>
                        )}
                    </h3>

                    {(loadingReservations) && (
                        <div className="p-10 text-center">
                            <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mx-auto" />
                        </div>
                    )}

                    {!loadingReservations && reservations.length === 0 && (
                        <div className="p-10 text-center bg-slate-50 rounded-3xl">
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No pending reservations found.</p>
                        </div>
                    )}

                    <div className="grid gap-6">
                        {reservations.map((res: any) => (
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
                                            onClick={() => updateReservationMutation.mutate({ id: res.id, status: 'returned', bookId: res.book_id })}
                                            disabled={updateReservationMutation.isPending}
                                            variant="outline"
                                            className="h-10 md:h-12 px-5 md:px-6 rounded-xl md:rounded-2xl border-red-200 text-red-600 hover:bg-red-50 font-black text-[10px] md:text-xs tracking-widest flex-1 sm:flex-none"
                                        >
                                            Reject
                                        </Button>
                                        <Button
                                            onClick={() => updateReservationMutation.mutate({ id: res.id, status: 'active', bookId: res.book_id })}
                                            disabled={updateReservationMutation.isPending}
                                            className="h-10 md:h-12 px-5 md:px-6 rounded-xl md:rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black text-[10px] md:text-xs tracking-widest flex-1 sm:flex-none"
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

            {/* RENEWALS SECTION */}
            <div className="glass-panel p-10 md:p-16 relative overflow-hidden group border-emerald-100 border-2">
                <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-50 rounded-full blur-[100px] -mr-48 -mt-48 opacity-50 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                    <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-8 md:mb-10 flex flex-wrap items-center gap-4">
                        <div className="w-2 md:w-3 h-8 md:h-10 bg-emerald-500 rounded-full shrink-0" />
                        Renewal <span className="text-emerald-600 italic">Requests</span>
                        {pendingRenewals.length > 0 && (
                            <span className="px-3 md:py-1 bg-amber-100 text-amber-600 rounded-full text-[10px] md:text-sm font-black">
                                {pendingRenewals.length} Pending
                            </span>
                        )}
                    </h3>

                    {loadingRenewals && (
                        <div className="p-10 text-center">
                            <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mx-auto" />
                        </div>
                    )}

                    {!loadingRenewals && renewalRequests.length === 0 && (
                        <div className="p-10 text-center bg-slate-50 rounded-3xl">
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No renewal requests found.</p>
                        </div>
                    )}

                    <div className="grid gap-6">
                        {renewalRequests.map((request) => (
                            <div key={request.id} className="bg-white p-6 md:p-8 rounded-[1.5rem] md:rounded-3xl border-2 border-slate-100 hover:border-emerald-200 transition-all group">
                                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
                                    <div className="flex items-center gap-4 md:gap-6">
                                        <div className={`shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center ${request.status === 'pending' ? 'bg-amber-100 text-amber-600' : request.status === 'approved' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                            {request.status === 'pending' ? <Clock className="h-6 w-6" /> : request.status === 'approved' ? <CheckCircle className="h-6 w-6" /> : <XCircle className="h-6 w-6" />}
                                        </div>
                                        <div className="min-w-0">
                                            <h4 className="text-lg md:text-xl font-black text-slate-900 mb-1 truncate">{request.book_title}</h4>
                                            <div className="flex flex-wrap items-center gap-3 text-slate-400 text-[10px] md:text-sm font-bold">
                                                <div className="flex items-center gap-2">
                                                    <User className="h-3 w-3" />
                                                    <span>{request.user_name}</span>
                                                </div>
                                                <span>•</span>
                                                <span>{new Date(request.request_date).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {request.status === 'pending' && (
                                        <div className="flex gap-2 sm:gap-3">
                                            <Button
                                                onClick={() => updateRenewalMutation.mutate({ id: request.id, status: 'rejected', reservationId: request.reservation_id })}
                                                disabled={updateRenewalMutation.isPending}
                                                variant="outline"
                                                className="h-10 md:h-12 px-5 md:px-6 rounded-xl md:rounded-2xl border-red-200 text-red-600 hover:bg-red-50 font-black text-[10px] md:text-xs tracking-widest"
                                            >
                                                Reject
                                            </Button>
                                            <Button
                                                onClick={() => updateRenewalMutation.mutate({ id: request.id, status: 'approved', reservationId: request.reservation_id })}
                                                disabled={updateRenewalMutation.isPending}
                                                className="h-10 md:h-12 px-5 md:px-6 rounded-xl md:rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[10px] md:text-xs tracking-widest"
                                            >
                                                Approve
                                            </Button>
                                        </div>
                                    )}

                                    {request.status !== 'pending' && (
                                        <div className="flex items-center gap-3">
                                            <div className={`px-4 md:px-6 py-2 md:py-3 rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest ${request.status === 'approved' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                                {request.status}
                                            </div>
                                            <Button
                                                onClick={() => { if (window.confirm("Delete record?")) deleteRenewalMutation.mutate(request.id); }}
                                                variant="ghost"
                                                className="h-10 w-10 text-slate-400 hover:text-red-600"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
