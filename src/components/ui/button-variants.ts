import { cva } from 'class-variance-authority'

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold transition-[background-color,color,box-shadow,transform] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-deep focus-visible:ring-offset-2 focus-visible:ring-offset-paper disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-ink text-paper hover:bg-ink/90 shadow-[0_1px_2px_rgb(43_18_32/0.2)]',
        accent: 'bg-paper text-primary-deep hover:bg-tint shadow-[0_1px_2px_rgb(43_18_32/0.12)]',
        outline: 'border border-ink/15 bg-transparent text-ink hover:border-ink/30 hover:bg-ink/[0.04]',
        ghost: 'bg-transparent text-ink hover:bg-ink/[0.05]',
        link: 'rounded-none px-0 text-primary-deep underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-11 px-5 text-[15px]',
        sm: 'h-9 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
        icon: 'size-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)
