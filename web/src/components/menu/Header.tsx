export function Header({
  banner,
  children,
}: {
  banner?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="menu-header flex items-center justify-center text-center h-headerHeight"
      style={{
        background: `url('assets/banners/${
          (banner && `${banner}.png`) || 'default.png'
        }')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}>
      <div className="menu-header-text text-center text-header max-w-max truncate p-3">
        {!banner && children}
      </div>
    </div>
  );
}
