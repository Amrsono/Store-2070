import { AdminDashboard } from '@/components/AdminDashboard';
import { Navbar } from '@/components/Navbar';

export default function AdminPage() {
    return (
        <main className="bg-obsidian min-h-screen">
            <Navbar />
            <AdminDashboard />
        </main>
    );
}
