import { cva } from 'class-variance-authority'

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold transition-[background-color,color,box-shadow,transform] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-link focus-visible:ring-offset-2 focus-visible:ring-offset-page disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-body text-page hover:bg-body/90 shadow-[0_1px_2px_rgb(43_18_32/0.2)]',
        accent: 'bg-paper text-primary-deep hover:bg-tint shadow-[0_1px_2px_rgb(43_18_32/0.12)]',
        outline: 'border border-body/15 bg-transparent text-body hover:border-body/30 hover:bg-body/[0.04]',
        ghost: 'bg-transparent text-body hover:bg-body/[0.05]',
        link: 'rounded-none px-0 text-link underline-offset-4 hover:underline',
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
