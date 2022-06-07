import { Colors } from 'styles/common';

export default {
    background: { primary: Colors.WHITE, secondary: Colors.PINK_LIGHT, tertiary: Colors.WHITE },
    textColor: {
        primary: Colors.PURPLE,
        secondary: Colors.GREEN,
        tertiary: Colors.WHITE,
    },
    borderColor: {
        primary: Colors.PURPLE,
        secondary: Colors.GREEN,
        tertiary: Colors.PURPLE,
    },
    button: {
        background: {
            primary: Colors.GREEN,
            secondary: Colors.PURPLE,
            tertiary: Colors.WHITE,
        },
        textColor: {
            primary: Colors.WHITE,
            secondary: Colors.PURPLE,
        },
        borderColor: {
            primary: Colors.WHITE,
            secondary: Colors.PURPLE,
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
            primary: Colors.PURPLE,
            secondary: Colors.PURPLE,
            focus: {
                primary: Colors.GREEN,
            },
        },
    },
};
