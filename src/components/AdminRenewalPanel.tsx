import React from "react";
import { CheckCircle, XCircle, Clock, User } from "lucide-react";
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

export const AdminRenewalPanel: React.FC = () => {
    const queryClient = useQueryClient();

    const { data: renewalRequests = [], isLoading } = useQuery({
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

    const updateRequestMutation = useMutation({
        mutationFn: async ({ id, status, reservationId }: { id: string, status: 'approved' | 'rejected', reservationId: string }) => {
            // Update the renewal request status
            const { error: updateError } = await supabase
                .from('renewal_requests')
                .update({ status })
                .eq('id', id);

            if (updateError) throw updateError;

            // If approved, extend the due date by 14 days
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
            toast.success(
                variables.status === 'approved' ? "Request Approved" : "Request Rejected",
                { description: variables.status === 'approved' ? "Due date extended by 14 days." : "User has been notified." }
            );
        },
        onError: (error: any) => {
            toast.error("Action Failed", { description: error.message });
        }
    });

    const pendingRequests = renewalRequests.filter(r => r.status === 'pending');

    return (
        <div className="animate-nova-in" style={{ animationDelay: '200ms' }}>
            <div className="glass-panel p-10 md:p-16 relative overflow-hidden group border-emerald-100 border-2">
                <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-50 rounded-full blur-[100px] -ml-48 -mt-48 opacity-50 group-hover:opacity-100 transition-opacity" />

                <div className="relative z-10">
                    <h3 className="text-3xl font-black text-slate-900 mb-10 flex items-center gap-4">
                        <div className="w-3 h-10 bg-emerald-500 rounded-full" />
                        Renewal <span className="text-emerald-600 italic">Requests</span>
                        {pendingRequests.length > 0 && (
                            <span className="px-4 py-1 bg-amber-100 text-amber-600 rounded-full text-sm font-black">
                                {pendingRequests.length} Pending
                            </span>
                        )}
                    </h3>

                    {isLoading && (
                        <div className="p-20 text-center">
                            <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mx-auto" />
                            <p className="mt-4 text-slate-400 font-bold uppercase tracking-widest text-xs">Loading Requests...</p>
                        </div>
                    )}

                    {!isLoading && renewalRequests.length === 0 && (
                        <div className="p-20 text-center bg-slate-50 rounded-3xl">
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No renewal requests found.</p>
                        </div>
                    )}

                    <div className="grid gap-6">
                        {renewalRequests.map((request) => (
                            <div key={request.id} className="bg-white p-8 rounded-3xl border-2 border-slate-100 hover:border-emerald-200 transition-all group">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="flex items-center gap-6">
                                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${request.status === 'pending' ? 'bg-amber-100 text-amber-600' :
                                                request.status === 'approved' ? 'bg-green-100 text-green-600' :
                                                    'bg-red-100 text-red-600'
                                            }`}>
                                            {request.status === 'pending' ? <Clock className="h-7 w-7" /> :
                                                request.status === 'approved' ? <CheckCircle className="h-7 w-7" /> :
                                                    <XCircle className="h-7 w-7" />}
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-black text-slate-900 mb-1">{request.book_title}</h4>
                                            <div className="flex items-center gap-3 text-slate-400 text-sm font-bold">
                                                <div className="flex items-center gap-2">
                                                    <User className="h-4 w-4" />
                                                    {request.user_name}
                                                </div>
                                                <span>•</span>
                                                <span>{new Date(request.request_date).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {request.status === 'pending' && (
                                        <div className="flex gap-3">
                                            <Button
                                                onClick={() => updateRequestMutation.mutate({
                                                    id: request.id,
                                                    status: 'rejected',
                                                    reservationId: request.reservation_id
                                                })}
                                                disabled={updateRequestMutation.isPending}
                                                variant="outline"
                                                className="h-12 px-6 rounded-2xl border-red-200 text-red-600 hover:bg-red-50 font-black text-xs uppercase tracking-widest"
                                            >
                                                Reject
                                            </Button>
                                            <Button
                                                onClick={() => updateRequestMutation.mutate({
                                                    id: request.id,
                                                    status: 'approved',
                                                    reservationId: request.reservation_id
                                                })}
                                                disabled={updateRequestMutation.isPending}
                                                className="h-12 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-widest"
                                            >
                                                Approve
                                            </Button>
                                        </div>
                                    )}

                                    {request.status !== 'pending' && (
                                        <div className={`px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest ${request.status === 'approved' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                                            }`}>
                                            {request.status}
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
