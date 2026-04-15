import { useAuthStore } from '@/stores/authStore';

const HomePage = () => {
    const user = useAuthStore(s => s.user);

    return (
        <div className="max-w-3xl">
            <div className="mb-8">
                <p className="text-sm text-gray-500 mt-1">
                    Welcome user:
                </p>
                <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
                    {user?.firstName} {user?.lastName}
                </h1>
            </div>
        </div>
    );
};

export default HomePage;
