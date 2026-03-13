import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    return (
        <>
            <div className="flex aspect-square size-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#8B5CF6] to-[#6D28D9]">
                <AppLogoIcon className="size-6 fill-current text-white" />
            </div>
            <div className="ml-2 grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate text-base font-bold tracking-tighter text-[var(--color-text-primary)]">
                    Magnetiq
                </span>
            </div>
        </>
    );
}
