interface HeaderProps {
  title: string
}

function Header({ title }: HeaderProps) {
  return (
    <header>
      <h1>{title}</h1>
      <p>Manage your tasks efficiently</p>
    </header>
  )
}

export default Header