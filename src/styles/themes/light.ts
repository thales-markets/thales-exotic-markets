import { Colors } from 'styles/common';

export default {
    background: { primary: Colors.WHITE, secondary: '#F9DEE6', tertiary: Colors.PINK },
    textColor: {
        primary: Colors.PURPLE,
        secondary: Colors.GREEN,
    },
    borderColor: {
        primary: Colors.PURPLE,
        secondary: Colors.GREEN,
        tertiary: Colors.PINK,
    },
    button: {
        background: {
            primary: Colors.GREEN,
            secondary: Colors.PURPLE,
        },
        textColor: {
            primary: Colors.WHITE,
        },
        borderColor: {
            primary: Colors.WHITE,
        },
    },
    input: {
        background: {
            primary: Colors.PURPLE,
            selection: {
                primary: Colors.PURPLE_DARK,
            },
        },
        textColor: {
            primary: Colors.WHITE,
        },
        borderColor: {
            primary: Colors.PURPLE,
            focus: {
                primary: Colors.PURPLE_DARK,
            },
        },
    },
};
