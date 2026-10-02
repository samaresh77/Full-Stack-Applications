interface HeaderProps {
  title: string
  subtitle: string
}

function Header({ title, subtitle }: HeaderProps) {
  return (
    <header>
      <h1>{title}</h1>
      <h3>{subtitle}</h3>
    </header>
  )
}

export default Header