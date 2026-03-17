import { Head } from '@inertiajs/react'
import AdminLayout from '@/layouts/admin-layout'
interface Props { message?: string }
export default function AdminKycShow({ message }: Props) {
    return (
        <AdminLayout><Head title="KYC Document — Admin" /><div className="p-6 space-y-6"><h1 className="text-2xl font-semibold text-white">KYC Document</h1><div className="bg-white/5 border border-white/10 rounded-2xl p-6"><p className="text-zinc-400">{message || 'KYC document details'}</p></div></div></AdminLayout>
    )
}
