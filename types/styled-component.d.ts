import { CustomTheme } from '../styles/styled-component-theme'

declare module 'styled-components' {
    interface DefaultTheme extends CustomTheme {}
    interface ThemeProps<T = DefaultTheme> {
        theme: T
    }
}
