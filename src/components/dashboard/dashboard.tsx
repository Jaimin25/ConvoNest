import NavigationSidebar from "../navigation/sidebar";

export default function Dashboard({ children }: { children: React.ReactNode }) {
    return (
        <div className="h-full w-full flex">
            <NavigationSidebar />
            {children}
        </div>
    );
}
