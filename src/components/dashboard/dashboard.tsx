import NavigationSidebar from '../navigation/sidebar';

export default function Dashboard({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full w-full">
      <NavigationSidebar />
      {children}
    </div>
  );
}
