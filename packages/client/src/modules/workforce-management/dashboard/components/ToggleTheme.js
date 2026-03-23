import { useTheme } from "next-themes";
import React, {useEffect, useState} from 'react'
export default function index() {
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
      <span role="button" className="toggle-theme" onClick={() => setTheme('light')} >Light Theme</span>
    )
  }
  else {
    return(
      <span role="button" className="toggle-theme" onClick={() => setTheme('dark')}>Dark Theme</span>
    )
  }
}  
 return(
 renderThemeChanger()
 )
}