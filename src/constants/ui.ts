import { ThemeInterface } from 'types/ui';
import neutralTheme from 'styles/themes/neutral';
import lightTheme from 'styles/themes/light';
import darkTheme from 'styles/themes/dark';

export enum Theme {
    NEUTRAL,
    LIGHT,
    DARK,
}

export const ThemeMap: Record<Theme, ThemeInterface> = {
    [Theme.NEUTRAL]: neutralTheme,
    [Theme.LIGHT]: lightTheme,
    [Theme.DARK]: darkTheme,
};
