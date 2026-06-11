import { useTheme } from '../lib/theme'
import { IMoon, ISun } from './icons'

interface ThemeToggleProps {
  /** `corner` = pinned icon button in the header corner (desktop);
   *  `menu` = quiet labelled row inside the mobile burger panel. */
  variant?: 'corner' | 'menu'
}

export function ThemeToggle({ variant = 'corner' }: ThemeToggleProps) {
  const { theme, toggle } = useTheme()
  const isDark = theme === 'dark'
  const action = isDark ? 'Switch to light mode' : 'Switch to dark mode'
  const Icon = isDark ? ISun : IMoon

  if (variant === 'menu') {
    return (
      <button
        type="button"
        className="nav-mobile-theme"
        onClick={toggle}
        aria-label={action}
        title={action}
        data-track="theme_toggle"
        data-track-kind="ui"
      >
        <Icon size={16} />
      </button>
    )
  }

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggle}
      aria-label={action}
      title={action}
      data-track="theme_toggle"
      data-track-kind="ui"
    >
      <span className="theme-toggle-icon" aria-hidden="true">
        <Icon size={isDark ? 17 : 16} />
      </span>
    </button>
  )
}
