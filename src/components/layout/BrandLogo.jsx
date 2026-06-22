const ICON_SRC = '/icon.png'

export default function BrandLogo({ showText = true, onClick, iconClassName = '', textClassName = '', className = '' }) {
  const Wrapper = onClick ? 'button' : 'div'

  return (
    <Wrapper
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={`flex items-center gap-2.5 ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      <img src={ICON_SRC} alt="MiniOS Web" className={`shrink-0 object-contain ${iconClassName}`} />
      {showText && (
        <span className={`font-bold text-black dark:text-white whitespace-nowrap ${textClassName}`}>
          MiniOS Web
        </span>
      )}
    </Wrapper>
  )
}
