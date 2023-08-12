import { CSSObject, Preset, RuleContext } from '@unocss/core'
import type { Theme } from '@unocss/preset-mini'

interface DuxTheme extends Theme {
  colors: {
    [key: string]: { [key: string]: string } | string
    brand: {
      DEFAULT: string
      1: string
      2: string
      3: string
      4: string
      5: string
      6: string
      7: string
      8: string
      9: string
      10: string
      hover: string
      focus: string
      active: string
      disabled: string
      light: string
      'light-hover': string
    }
    warning: {
      DEFAULT: string
      1: string
      2: string
      3: string
      4: string
      5: string
      6: string
      7: string
      8: string
      9: string
      10: string
      hover: string
      focus: string
      active: string
      disabled: string
      light: string
      'light-hover': string
    }
    success: {
      DEFAULT: string
      1: string
      2: string
      3: string
      4: string
      5: string
      6: string
      7: string
      8: string
      9: string
      10: string
      hover: string
      focus: string
      active: string
      disabled: string
      light: string
      'light-hover': string
    }
    error: {
      DEFAULT: string
      1: string
      2: string
      3: string
      4: string
      5: string
      6: string
      7: string
      8: string
      9: string
      10: string
      hover: string
      focus: string
      active: string
      disabled: string
      light: string
      'light-hover': string
    }
    gray: {
      DEFAULT: string
      1: string
      2: string
      3: string
      4: string
      5: string
      6: string
      7: string
      8: string
      9: string
      10: string
      11: string
      12: string
      13: string
      14: string
    }
  }
}

export const presetDux = (): Preset<DuxTheme> => {
  return {
    name: 'dux-theme',

    theme: {
      colors: {
        brand: {
          DEFAULT: 'var(--td-brand-color-7)',
          1: 'var(--td-brand-color-1)',
          2: 'var(--td-brand-color-2)',
          3: 'var(--td-brand-color-3)',
          4: 'var(--td-brand-color-4)',
          5: 'var(--td-brand-color-5)',
          6: 'var(--td-brand-color-6)',
          7: 'var(--td-brand-color-7)',
          8: 'var(--td-brand-color-8)',
          9: 'var(--td-brand-color-9)',
          10: 'var(--td-brand-color-10)',
          hover: 'var(--td-brand-color-6)',
          focus: 'var(--td-brand-color-2)',
          active: 'var(--td-brand-color-8)',
          disabled: 'var(--td-brand-color-3)',
          light: 'var(--td-brand-color-1)',
          'light-hover': 'var(--td-brand-color-2)',
        },
        warning: {
          DEFAULT: 'var(--td-warning-color-5)',
          1: 'var(--td-warning-color-1)',
          2: 'var(--td-warning-color-2)',
          3: 'var(--td-warning-color-3)',
          4: 'var(--td-warning-color-4)',
          5: 'var(--td-warning-color-5)',
          6: 'var(--td-warning-color-6)',
          7: 'var(--td-warning-color-7)',
          8: 'var(--td-warning-color-8)',
          9: 'var(--td-warning-color-9)',
          10: 'var(--td-warning-color-10)',
          hover: 'var(--td-warning-color-4)',
          focus: 'var(--td-warning-color-2)',
          active: 'var(--td-warning-color-6)',
          disabled: 'var(--td-warning-color-3)',
          light: 'var(--td-warning-color-1)',
          'light-hover': 'var(--td-warning-color-2)',
        },
        success: {
          DEFAULT: 'var(--td-success-color-5)',
          1: 'var(--td-warning-color-1)',
          2: 'var(--td-warning-color-2)',
          3: 'var(--td-warning-color-3)',
          4: 'var(--td-warning-color-4)',
          5: 'var(--td-warning-color-5)',
          6: 'var(--td-warning-color-6)',
          7: 'var(--td-warning-color-7)',
          8: 'var(--td-warning-color-8)',
          9: 'var(--td-warning-color-9)',
          10: 'var(--td-warning-color-10)',
          hover: 'var(--td-warning-color-4)',
          focus: 'var(--td-warning-color-2)',
          active: 'var(--td-warning-color-6)',
          disabled: 'var(--td-warning-color-3)',
          light: 'var(--td-warning-color-1)',
          'light-hover': 'var(--td-warning-color-2)',
        },
        error: {
          DEFAULT: 'var(--td-error-color-6)',
          1: 'var(--td-error-color-1)',
          2: 'var(--td-error-color-2)',
          3: 'var(--td-error-color-3)',
          4: 'var(--td-error-color-4)',
          5: 'var(--td-error-color-5)',
          6: 'var(--td-error-color-6)',
          7: 'var(--td-error-color-7)',
          8: 'var(--td-error-color-8)',
          9: 'var(--td-error-color-9)',
          10: 'var(--td-error-color-10)',
          hover: 'var(--td-error-color-5)',
          focus: 'var(--td-error-color-2)',
          active: 'var(--td-error-color-7)',
          disabled: 'var(--td-error-color-3)',
          light: 'var(--td-error-color-1)',
          'light-hover': 'var(--td-error-color-2)',
        },
        gray: {
          DEFAULT: 'var(--td-gray-color-7)',
          1: 'var(--td-gray-color-1)',
          2: 'var(--td-gray-color-2)',
          3: 'var(--td-gray-color-3)',
          4: 'var(--td-gray-color-4)',
          5: 'var(--td-gray-color-5)',
          6: 'var(--td-gray-color-6)',
          7: 'var(--td-gray-color-7)',
          8: 'var(--td-gray-color-8)',
          9: 'var(--td-gray-color-9)',
          10: 'var(--td-gray-color-10)',
          11: 'var(--td-gray-color-11)',
          12: 'var(--td-gray-color-12)',
          13: 'var(--td-gray-color-13)',
          14: 'var(--td-gray-color-14)',
        },
      },
      boxShadow: {
        md: 'var(--td-shadow-1)',
        lg: 'var(--td-shadow-2)',
        xl: 'var(--td-shadow-3)',
      },
      dropShadow: {
        DEFAULT: 'var(--td-shadow-1)',
        md: 'var(--td-shadow-2)',
        lg: 'var(--td-shadow-3)',
      },
    },
    rules: [
      [
        /^text-(.*)$/,
        ([, c], { theme }: RuleContext<DuxTheme>) => {
          const rules: Record<string, string> = {
            'white-1': 'var(--td-font-white-1)',
            'white-2': 'var(--td-font-white-2)',
            'white-3': 'var(--td-font-white-3)',
            'white-4': 'var(--td-font-white-4)',
            'gray-1': 'var(--td-font-gray-1)',
            'gray-2': 'var(--td-font-gray-2)',
            'gray-3': 'var(--td-font-gray-3)',
            'gray-4': 'var(--td-font-gray-4)',
            primary: 'var(--td-text-color-primary)',
            secondary: 'var(--td-text-color-secondary)',
            placeholder: 'var(--td-text-color-placeholder)',
            disabled: 'var(--td-text-color-disabled)',
            anti: 'var(--td-text-color-anti)',
          }
          return refultCSS('color', c, rules, theme)
        },
      ],
      [
        /^bg-(.*)$/,
        ([, c], { theme }: RuleContext<DuxTheme>) => {
          const rules: Record<string, string> = {
            page: 'var(--td-bg-color-page)',
            container: 'var(--td-bg-color-container)',
            'container-hover': 'var(--td-bg-color-container-hover)',
            'container-active': 'var(--td-bg-color-container-active)',
            'container-select': 'var(--td-bg-color-container-select)',
            secondarycontainer: 'var(--td-bg-color-secondarycontainer)',
            'secondarycontainer-hover': 'var(--td-bg-color-secondarycontainer-hover)',
            'secondarycontainer-active': 'var(--td-bg-color-secondarycontainer-active)',
            'secondarycontainer-select': 'var(--td-bg-color-secondarycontainer-select)',
            component: 'var(--td-bg-color-component)',
            'component-hover': 'var(--td-bg-color-component-hover)',
            'component-active': 'var(--td-bg-color-component-active)',
            'component-select': 'var(--td-bg-color-component-select)',
            'component-disabled': 'var(--td-bg-color-component-disabled)',
            secondarycomponent: 'var(--td-bg-color-secondarycomponent)',
            'secondarycomponent-hover': 'var(--td-bg-color-secondarycomponent-hover)',
            'secondarycomponent-active': 'var(--td-bg-color-secondarycomponent-active)',
            'secondarycomponent-select': 'var(--td-bg-color-secondarycomponent-select)',
            'mask-active': 'var(--td-mask-active)',
            'mask-disabled': 'var(--td-mask-disabled)',
          }
          return refultCSS('background-color', c, rules, theme)
        },
      ],
      [
        /^border-(.*)$/,
        ([, c], { theme }: RuleContext<DuxTheme>) => {
          const rules: Record<string, string> = {
            component: 'var(--td-component-border)',
          }
          return refultCSS('border-color', c, rules, theme)
        },
      ],
    ],
  }
}

const refultCSS = (name: string, value: string, rules: Record<string, string>, theme: DuxTheme) => {
  if (rules[value]) return { [name]: rules[value] } as CSSObject
  if (theme.colors[value]) {
    return {
      [name]:
        typeof theme.colors[value] === 'string'
          ? theme.colors[value]
          : (theme.colors[value] as Record<string, string>).DEFAULT,
    } as CSSObject
  }
  return
}
