import React, { useState } from "react";
import { CreditCard, History, Clock, AlertCircle, Search, ShieldCheck, BookOpen, ExternalLink, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/clerk-react";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

interface Reservation {
    id: number;
    bookTitle: string;
    reservedDate: string;
    dueDate: string;
    status: 'active' | 'overdue' | 'returned';
}

interface UserDashboardProps {
    onNavigateToSearch: () => void;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ onNavigateToSearch }) => {
    const { user } = useUser();
    const [fines, setFines] = useState(15.50);

    const [reservations] = useState<Reservation[]>([
        { id: 1, bookTitle: "Atomic Habits", reservedDate: "2024-02-01", dueDate: "2024-02-15", status: 'active' },
        { id: 2, bookTitle: "Deep Work", reservedDate: "2024-01-10", dueDate: "2024-01-24", status: 'overdue' },
    ]);

    const calculateFine = (dueDate: string) => {
        const due = new Date(dueDate);
        const today = new Date();
        if (today > due) {
            const diffTime = Math.abs(today.getTime() - due.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays * 0.50; // $0.50 per day
        }
        return 0;
    };

    if (!user) return null;

    const handleVaultItemClick = (label: string) => {
        if (label === 'E-Books') {
            onNavigateToSearch();
            toast("Redirecting to Archival Assets...");
        } else if (label === 'Reservations') {
            window.scrollTo({ top: 400, behavior: 'smooth' });
            toast("Navigating to Active Shelves");
        } else {
            toast.success("Security Status: ARCHIVE_OPTIMAL", {
                description: "Your biometric and neural links are secure."
            });
        }
    };

    return (
        <div className="w-full max-w-7xl mx-auto pt-32 pb-24 px-4 md:px-0 bg-background/50">
            <div className="flex flex-col gap-12">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 animate-nova-in">
                    <div>
                        <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/5 text-primary text-xs font-black mb-6 gap-2 border border-primary/10">
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                            USER_ID: {user.id.slice(-8).toUpperCase()}
                        </div>
                        <h2 className="text-4xl md:text-7xl font-black tracking-tighter text-slate-900 leading-[0.9] mb-4">
                            Member <span className="shimmer-text italic">Command</span>
                        </h2>
                        <p className="text-slate-500 font-bold text-lg md:text-xl">
                            Welcome back, {user.firstName}. Monitor your archive activity and assets.
                        </p>
                    </div>

                    <div className="flex gap-4">
                        <div className="glass-panel px-8 py-6 flex flex-col items-end gap-1">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Total Liabilities</span>
                            <span className="text-4xl font-black text-red-500">${fines.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Profile & Quick Stats */}
                    <div className="lg:col-span-4 space-y-8 animate-nova-in" style={{ animationDelay: '100ms' }}>
                        <div className="glass-panel p-10 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors" />

                            <div className="flex flex-col items-center text-center gap-6 relative z-10">
                                <div className="relative">
                                    <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden shadow-2xl ring-4 ring-white">
                                        <img src={user.imageUrl} alt={user.fullName || "User"} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-green-500 border-4 border-white rounded-2xl flex items-center justify-center shadow-lg">
                                        <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-2xl font-black text-slate-900 leading-tight">{user.fullName}</h3>
                                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">Verified Scholar</p>
                                </div>

                                <Button
                                    className="w-full btn-nova group opacity-50 cursor-not-allowed"
                                    onClick={() => toast.info("Payment Terminal offline", { description: "Financial integrations are currently in development." })}
                                >
                                    <CreditCard className="mr-3 h-5 w-5" />
                                    Settle Fines
                                </Button>
                            </div>
                        </div>

                        <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden group">
                            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-primary/20 to-transparent" />
                            <h4 className="text-xl font-black mb-8 relative z-10 flex items-center gap-3">
                                <div className="w-2 h-8 bg-primary rounded-full" />
                                Vault Access
                            </h4>
                            <div className="space-y-6 relative z-10">
                                {[
                                    { label: 'E-Books', val: '10k+', icon: BookOpen },
                                    { label: 'Reservations', val: '5/5', icon: History },
                                    { label: 'Status', val: 'Active', icon: ShieldCheck }
                                ].map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="flex items-center justify-between group/item cursor-pointer hover:bg-white/5 p-2 -m-2 rounded-xl transition-all"
                                        onClick={() => handleVaultItemClick(item.label)}
                                    >
                                        <div className="flex items-center gap-4 text-slate-400 group-hover/item:text-white transition-colors">
                                            <item.icon className="h-5 w-5" />
                                            <span className="text-sm font-bold uppercase tracking-widest">{item.label}</span>
                                        </div>
                                        <span className="font-black text-primary">{item.val}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Main Activity */}
                    <div className="lg:col-span-8 space-y-8 animate-nova-in" style={{ animationDelay: '200ms' }}>
                        <div className="flex items-center justify-between">
                            <h3 className="text-2xl font-black text-slate-900 flex items-center gap-4">
                                Active <span className="text-primary italic">Shelves</span>
                                <span className="bg-slate-100 text-slate-400 py-1 px-3 rounded-xl text-[10px] font-black uppercase">{reservations.length} Records</span>
                            </h3>
                        </div>

                        <div className="grid gap-6">
                            {reservations.map((res) => (
                                <div key={res.id} className="card-3d p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 group">
                                    <div className="flex items-center gap-8">
                                        <div className={`w-20 h-20 rounded-3xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 ${res.status === 'overdue' ? 'bg-red-50 text-red-500 shadow-lg shadow-red-200/50' : 'bg-primary/5 text-primary shadow-lg shadow-primary/20'
                                            }`}>
                                            {res.status === 'overdue' ? <AlertCircle className="h-8 w-8" /> : <History className="h-8 w-8" />}
                                        </div>
                                        <div>
                                            <h4 className="text-2xl font-black text-slate-900 group-hover:text-primary transition-colors leading-tight mb-2">{res.bookTitle}</h4>
                                            <div className="flex flex-wrap gap-4">
                                                <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                    <Clock className="h-3.5 w-3.5" /> Due: {res.dueDate}
                                                </div>
                                                {res.status === 'overdue' && (
                                                    <div className="px-3 py-1 bg-red-100 text-red-600 rounded-lg text-[9px] font-black uppercase tracking-widest">
                                                        Late: ${calculateFine(res.dueDate).toFixed(2)}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className="h-14 px-8 rounded-2xl border-slate-200 font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-50 hover:border-primary/50 transition-all"
                                            >
                                                Detail View
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-md rounded-[2.5rem] border-none shadow-3xl">
                                            <DialogHeader>
                                                <DialogTitle className="text-3xl font-black tracking-tighter text-slate-900">{res.bookTitle}</DialogTitle>
                                                <DialogDescription className="font-bold text-slate-400 uppercase tracking-widest text-xs">
                                                    Archival metadata & tracking
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="py-10 space-y-6">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div className="p-6 bg-slate-50 rounded-3xl">
                                                        <span className="text-[10px] font-black text-slate-400 block mb-2 uppercase">Reserved</span>
                                                        <span className="font-black text-slate-900">{res.reservedDate}</span>
                                                    </div>
                                                    <div className="p-6 bg-slate-50 rounded-3xl">
                                                        <span className="text-[10px] font-black text-slate-400 block mb-2 uppercase">Maturity</span>
                                                        <span className="font-black text-slate-900">{res.dueDate}</span>
                                                    </div>
                                                </div>
                                                <div className="p-8 bg-primary/5 rounded-[2rem] border border-primary/10 flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                                                            <ShieldCheck className="h-6 w-6 text-primary" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-black text-slate-900">Digital twin available</p>
                                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Linked to vault</p>
                                                        </div>
                                                    </div>
                                                    <Button variant="ghost" className="rounded-xl h-12 px-4 hover:bg-primary/10 text-primary">
                                                        <ExternalLink className="h-5 w-5" />
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className="flex gap-4">
                                                <Button className="flex-1 btn-nova h-16 rounded-[1.5rem]" onClick={() => toast.success("Renewal sequence initiated")}>Extend Access</Button>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                </div>
                            ))}
                        </div>

                        {/* Expand Collection Action */}
                        <div className="glass-panel p-12 text-center border-dashed group cursor-pointer hover:border-primary/30 transition-colors"
                            onClick={onNavigateToSearch}>
                            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-primary/10 transition-colors">
                                <Search className="h-6 w-6 text-slate-400 group-hover:text-primary" />
                            </div>
                            <h3 className="text-xl font-black text-slate-900 mb-2">Expand Your Collection</h3>
                            <p className="text-slate-500 font-bold text-sm max-w-sm mx-auto uppercase tracking-widest leading-loose">
                                Ready for a new intellectual adventure? <span className="text-primary underline decoration-2 underline-offset-4">Browse Archives</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;

