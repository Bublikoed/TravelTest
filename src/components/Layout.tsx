import Navigation from "./Navigation";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="App">
      <Navigation />
      <main>{children}</main>
    </div>
  );
}
