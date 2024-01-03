import NavigationSidebar from '../navigation/sidebar';

export default function Dashboard({ children }: { children: React.ReactNode }) {
  return (
    <div className="dashboard flex h-full w-full flex-col sm:flex-row">
      <NavigationSidebar />
      {children}
    </div>
  );
}
