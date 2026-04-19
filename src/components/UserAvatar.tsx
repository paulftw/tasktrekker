function hueFromName(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) {
    h = (h * 31 + name.charCodeAt(i)) % 360;
  }
  return h;
}

function initialsFromName(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0])
    .join("")
    .toUpperCase();
}

export function UserAvatar({
  user,
  size = 22,
}: {
  user: { name: string } | null | undefined;
  size?: number;
}) {
  if (!user) {
    return (
      <div
        className="rounded-full border border-dashed border-text-muted text-text-muted flex items-center justify-center shrink-0"
        style={{ width: size, height: size, fontSize: size * 0.5 }}
        aria-label="Unassigned"
      >
        ?
      </div>
    );
  }
  const h = hueFromName(user.name);
  return (
    <div
      className="rounded-full text-white flex items-center justify-center shrink-0 font-semibold"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.42,
        backgroundColor: `oklch(0.62 0.14 ${h})`,
      }}
      aria-label={user.name}
      title={user.name}
    >
      {initialsFromName(user.name)}
    </div>
  );
}
