import { darkPalette, lightPalette } from "./colorPalette";

export const themeSetter = (darkTheme : boolean) : void =>{
  const palette = darkTheme ? darkPalette : lightPalette
  palette.forEach(property=>{
    document.documentElement.style.setProperty(property.name, property.value);
  })
}