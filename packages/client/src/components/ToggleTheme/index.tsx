import { useTheme } from "next-themes";
import React, {useEffect, useState} from 'react'
import { HiOutlineSun, HiOutlineMoon } from "react-icons/hi";
export default function ToggleTheme() {
const {systemTheme, theme, setTheme} = useTheme()
const [mounted, setMounted] =useState(false)
useEffect( () => {
  setMounted(true)
}, [])
const renderThemeChanger = () => {
  if (!mounted) return null;
  const currentTheme = theme === 'system' ? systemTheme : theme;
  if(currentTheme === 'dark') {
    return (
      <span role="button" className="toggle-theme" onClick={() => setTheme('light')} ><HiOutlineSun className="mr-2" />Light Theme</span>
    )
  }
  else {
    return(
      <span role="button" className="toggle-theme" onClick={() => setTheme('dark')}><HiOutlineMoon className="mr-2" />Dark Theme</span>
    )
  }
}
 return(
 renderThemeChanger()
 )
}