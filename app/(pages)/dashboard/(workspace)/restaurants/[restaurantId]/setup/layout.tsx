export default function SetupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="px-2 py-5 sm:px-6">{children}</div>
}
