export function Subheader({ children }: { children: React.ReactNode }) {
  return (
    <div className="menu-subheader h-itemHeight bg-black text-subheader flex justify-between items-center p-menuPadding">
      {children}
    </div>
  );
}
