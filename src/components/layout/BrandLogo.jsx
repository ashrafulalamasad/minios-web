const ICON_SRC = '/icon.png'

export default function BrandLogo({ size = 'md', showText = true, onClick, className = '' }) {
  const sizes = {
    sm: { img: 'h-8 w-8', text: 'text-lg' },
    md: { img: 'h-10 w-10', text: 'text-xl' },
    lg: { img: 'h-14 w-14', text: 'text-2xl' },
  }
  const s = sizes[size] || sizes.md

  const Wrapper = onClick ? 'button' : 'div'

  return (
    <Wrapper
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={`flex items-center gap-2.5 ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      <img
        src={ICON_SRC}
        alt="MiniOS Simulator"
        className={`${s.img} shrink-0 object-contain`}
      />
      {showText && (
        <span className={`font-bold text-slate-800 dark:text-white whitespace-nowrap ${s.text}`}>
          MiniOS Simulator
        </span>
      )}
    </Wrapper>
  )
}
