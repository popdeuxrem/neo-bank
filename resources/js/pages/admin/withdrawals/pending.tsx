import { Head } from '@inertiajs/react'
import AdminLayout from '@/layouts/admin-layout'

interface Props {
    data?: any[]
}

export default function AdminWithdrawalsPending({ data = [] }: Props) {
    return (
        <AdminLayout>
            <Head title="Pending Withdrawals — Admin" />
            <div className="p-6 space-y-6">
                <h1 className="text-2xl font-semibold text-white">Pending Withdrawals</h1>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                    {(data ?? []).length === 0 ? (
                        <p className="text-zinc-400">No pending withdrawals</p>
                    ) : (
                        data.map((item: any) => <div key={item.id}>{item}</div>)
                    )}
                </div>
            </div>
        </AdminLayout>
    )
}
