"use client";


// CUSTOM ICON COMPONENTS
import appIcons from "icons";


// ==============================================================


// ==============================================================

export default function IconComponent({
  icon,
  ...props
}) {
  if (!icon) return null;
  const Icon = appIcons[icon];
  return Icon ? <Icon {...props} /> : null;
}