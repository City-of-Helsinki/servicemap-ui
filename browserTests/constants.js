import { Selector } from "testcafe"


export const TitleBarTitleSelector = () => Selector('h3[class*="TitleText"]');

export const SearchBarBackButton = () => Selector('#SearchBar .SMBackButton')
