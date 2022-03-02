import { Colors } from 'styles/common';

export default {
    background: { primary: Colors.PURPLE_GRADIENT, secondary: Colors.PINK_GRADIENT, tertiary: Colors.PURPLE },
    textColor: {
        primary: Colors.WHITE,
        secondary: Colors.GREEN,
        tertiary: Colors.PURPLE,
    },
    borderColor: {
        primary: Colors.WHITE,
        secondary: Colors.GREEN,
        tertiary: Colors.PURPLE,
    },
    button: {
        background: {
            primary: Colors.GREEN,
            secondary: Colors.WHITE,
        },
        textColor: {
            primary: Colors.PURPLE,
        },
        borderColor: {
            primary: Colors.PURPLE,
        },
    },
    input: {
        background: {
            primary: Colors.WHITE,
            selection: {
                primary: Colors.PINK_LIGHT,
            },
        },
        textColor: {
            primary: Colors.PURPLE_DARK,
        },
        borderColor: {
            primary: Colors.WHITE,
            secondary: Colors.PURPLE,
            focus: {
                primary: Colors.PINK,
            },
        },
    },
};
