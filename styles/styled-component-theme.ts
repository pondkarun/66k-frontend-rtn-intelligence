// Media queries breakpoints

const xsMin = 480

const smMin = 576

const mdMin = 768

const lgMin = 992

const xlMin = 1200

const xxlMin = 1600


const xsMax = xsMin - 1
const smMax = smMin - 1
const mdMax = mdMin - 1
const lgMax = lgMin - 1
const xlMax = xlMin - 1
const xxlMax = xxlMin - 1

// interface SwitchProps {
//     default: unknown
// }

export const theme = {
    // switch: <T extends SwitchProps>(key?: string, conditions?: T) => {
    //     if (!conditions) return ''
    //     if (!key) return conditions.default
    //     return (conditions as any)[key] || conditions.default
    // },
    breakpoints: {
        xs: {
            value: xsMin,
            up: `@media screen and (min-width : ${xsMin}px)`,
            down: `@media screen and (max-width : ${xsMax}px)`,
        },
        sm: {
            value: smMin,
            up: `@media screen and (min-width : ${smMin}px)`,
            down: `@media screen and (max-width : ${smMax}px)`,
        },
        md: {
            value: mdMin,
            up: `@media screen and (min-width : ${mdMin}px)`,
            down: `@media screen and (max-width : ${mdMax}px)`,
        },
        lg: {
            value: lgMin,
            up: `@media screen and (min-width : ${lgMin}px)`,
            down: `@media screen and (max-width : ${lgMax}px)`,
        },
        xl: {
            value: xlMin,
            up: `@media screen and (min-width : ${xlMin}px)`,
            down: `@media screen and (max-width : ${xlMax}px)`,
        },
        xxl: {
            value: xxlMin,
            up: `@media screen and (min-width : ${xxlMin}px)`,
            down: `@media screen and (max-width : ${xxlMax}px)`,
        },
    },
    prefers_color_scheme: '@media (prefers-color-scheme: dark)',
}

export type CustomTheme = typeof theme
