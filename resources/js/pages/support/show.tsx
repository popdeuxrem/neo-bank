import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    ArrowLeft, 
    Send, 
    Paperclip, 
    MoreHorizontal, 
    CheckCircle, 
    Clock, 
    AlertCircle,
    User,
    Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import UserLayout from '@/layouts/user-layout';
import { Link } from '@inertiajs/react';
import { toast } from 'sonner';

interface Message {
    id: string;
    sender: 'user' | 'support';
    content: string;
    timestamp: string;
    read?: boolean;
    attachments?: { name: string; url: string }[];
}

const ticket = {
    id: 'TKT-001',
    subject: 'Cannot complete wire transfer',
    category: 'Payments',
    status: 'open',
    priority: 'high',
    created: '2026-03-12T10:30:00Z',
    lastReply: '2026-03-13T14:22:00Z',
};

const messages: Message[] = [
    {
        id: 'msg_1',
        sender: 'user',
        content: 'Hi, I\'ve been trying to complete a wire transfer to my business account at another bank but keep getting an error message. The amount is $5,000 and I\'ve verified all the account details multiple times.',
        timestamp: '2026-03-12T10:30:00Z',
        read: true,
    },
    {
        id: 'msg_2',
        sender: 'support',
        content: 'Hello! Thank you for reaching out. I\'m sorry to hear you\'re experiencing issues with your wire transfer. I\'d be happy to help you troubleshoot this.\n\nCould you please confirm a few details:\n1. What bank are you sending to?\n2. Are you receiving any specific error message?\n3. Is this the first time you\'re attempting this transfer?',
        timestamp: '2026-03-12T11:15:00Z',
        read: true,
    },
    {
        id: 'msg_3',
        sender: 'user',
        content: 'Thanks for the quick response!\n\n1. Chase Bank\n2. It says "Transfer failed. Please contact your bank"\n3. Yes, this is my first wire transfer',
        timestamp: '2026-03-12T11:45:00Z',
        read: true,
    },
    {
        id: 'msg_4',
        sender: 'support',
        content: 'Thank you for that information! I can see the issue now. It appears that wire transfers require additional verification for amounts over $3,000 for first-time recipients.\n\nI\'ve initiated a verification process on our end. Once verified, you should be able to complete the transfer. This typically takes 15-30 minutes during business hours.',
        timestamp: '2026-03-12T12:00:00Z',
        read: true,
    },
    {
        id: 'msg_5',
        sender: 'support',
        content: 'Great news! Your verification has been completed. You should now be able to complete your wire transfer. Please try again and let me know if you encounter any issues.',
        timestamp: '2026-03-13T14:22:00Z',
        read: false,
    },
];

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0 }
};

export default function SupportShow() {
    const [reply, setReply] = useState('');
    const [sending, setSending] = useState(false);
    const [localMessages, setLocalMessages] = useState<Message[]>(messages);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [localMessages]);

    const handleSend = async () => {
        if (!reply.trim()) return;
        
        setSending(true);
        
        const newMessage: Message = {
            id: `msg_${Date.now()}`,
            sender: 'user',
            content: reply,
            timestamp: new Date().toISOString(),
            read: false,
        };

        await new Promise(resolve => setTimeout(resolve, 500));
        
        setLocalMessages(prev => [...prev, newMessage]);
        setReply('');
        setSending(false);
        
        toast.success('Reply sent');

        setTimeout(() => {
            const autoReply: Message = {
                id: `msg_${Date.now()}`,
                sender: 'support',
                content: 'Thank you for your update! I\'ll review this and get back to you shortly.',
                timestamp: new Date().toISOString(),
                read: false,
            };
            setLocalMessages(prev => [...prev, autoReply]);
        }, 2000);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'open':
                return <Badge className="bg-amber-500/20 text-amber-400"><Clock className="mr-1 h-3 w-3" /> Open</Badge>;
            case 'closed':
                return <Badge className="bg-emerald-500/20 text-emerald-400"><CheckCircle className="mr-1 h-3 w-3" /> Closed</Badge>;
            default:
                return <Badge>{status}</Badge>;
        }
    };

    const getPriorityBadge = (priority: string) => {
        switch (priority) {
            case 'high':
                return <Badge className="bg-rose-500/20 text-rose-400">High</Badge>;
            case 'medium':
                return <Badge className="bg-amber-500/20 text-amber-400">Medium</Badge>;
            default:
                return <Badge className="bg-zinc-500/20 text-zinc-400">Low</Badge>;
        }
    };

    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return (
        <UserLayout>
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/support">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <div className="flex-1">
                        <div className="flex items-center gap-3">
                            <h1 className="text-xl font-bold text-white">{ticket.subject}</h1>
                            {getStatusBadge(ticket.status)}
                            {getPriorityBadge(ticket.priority)}
                        </div>
                        <p className="text-sm text-zinc-400">
                            {ticket.id} • Created {new Date(ticket.created).toLocaleDateString()}
                        </p>
                    </div>
                    <Button variant="outline" className="border-white/10">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </div>

                <div className="grid gap-6 lg:grid-cols-4">
                    <div className="lg:col-span-3">
                        <div className="rounded-2xl border border-white/10 bg-zinc-900/50 backdrop-blur-xl">
                            <div className="flex h-[500px] flex-col">
                                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                    {localMessages.map((message, index) => (
                                        <motion.div
                                            key={message.id}
                                            initial="hidden"
                                            animate="visible"
                                            variants={fadeUp}
                                            transition={{ delay: index * 0.05 }}
                                            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                                        >
                                            <div className={`max-w-[80%] ${message.sender === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
                                                <div className={`flex items-end gap-2 ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                                                    <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                                                        message.sender === 'user' 
                                                            ? 'bg-indigo-500/20 text-indigo-400' 
                                                            : 'bg-zinc-700 text-zinc-300'
                                                    }`}>
                                                        <User className="h-4 w-4" />
                                                    </div>
                                                    <div className={`rounded-2xl px-4 py-3 ${
                                                        message.sender === 'user'
                                                            ? 'bg-indigo-500 text-white'
                                                            : 'bg-zinc-800 text-zinc-100'
                                                    }`}>
                                                        <p className="whitespace-pre-line text-sm">{message.content}</p>
                                                    </div>
                                                </div>
                                                <div className={`mt-1 flex items-center gap-2 text-xs text-zinc-500 ${message.sender === 'user' ? 'justify-end' : ''}`}>
                                                    <span>{formatTime(message.timestamp)}</span>
                                                    {message.sender === 'user' && message.read && (
                                                        <Check className="h-3 w-3 text-emerald-400" />
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                    <div ref={messagesEndRef} />
                                </div>

                                <div className="border-t border-white/10 p-4">
                                    <div className="flex items-end gap-3">
                                        <div className="flex-1">
                                            <textarea
                                                value={reply}
                                                onChange={(e) => setReply(e.target.value)}
                                                placeholder="Type your reply..."
                                                className="min-h-[80px] w-full resize-none rounded-xl border border-white/10 bg-zinc-800 px-4 py-3 text-white placeholder-zinc-500 focus:border-indigo-500 focus:outline-none"
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' && !e.shiftKey) {
                                                        e.preventDefault();
                                                        handleSend();
                                                    }
                                                }}
                                            />
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="ghost" size="icon" className="text-zinc-400">
                                                <Paperclip className="h-5 w-5" />
                                            </Button>
                                            <Button 
                                                className="bg-indigo-500 hover:bg-indigo-600"
                                                onClick={handleSend}
                                                disabled={!reply.trim() || sending}
                                            >
                                                <Send className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="rounded-2xl border border-white/10 bg-zinc-900/50 p-6 backdrop-blur-xl">
                            <h3 className="mb-4 font-semibold text-white">Ticket Details</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs text-zinc-500">Category</label>
                                    <p className="text-sm text-white">{ticket.category}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-zinc-500">Status</label>
                                    <div className="mt-1">{getStatusBadge(ticket.status)}</div>
                                </div>
                                <div>
                                    <label className="text-xs text-zinc-500">Priority</label>
                                    <div className="mt-1">{getPriorityBadge(ticket.priority)}</div>
                                </div>
                                <div>
                                    <label className="text-xs text-zinc-500">Created</label>
                                    <p className="text-sm text-white">
                                        {new Date(ticket.created).toLocaleDateString('en-US', {
                                            month: 'long',
                                            day: 'numeric',
                                            year: 'numeric',
                                            hour: 'numeric',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-xs text-zinc-500">Last Reply</label>
                                    <p className="text-sm text-white">{formatTime(ticket.lastReply)}</p>
                                </div>
                            </div>
                        </div>

                        {ticket.status === 'open' && (
                            <Button variant="outline" className="w-full border-white/10 text-rose-400 hover:bg-rose-500/10">
                                Close Ticket
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
