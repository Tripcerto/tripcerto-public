export function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="footer">
      <div className="shell">
        <span>&copy; {year} Tripcerto Ltd</span>
      </div>
    </footer>
  )
}
