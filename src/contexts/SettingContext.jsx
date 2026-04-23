"use client";

import { createContext, useCallback, useEffect, useMemo, useState } from "react";

import { apiGet } from "utils/api";


// ============================================================


// ============================================================


const initialSettings = {
  direction: "ltr",
  site_name: "Alphabeta",
  theme: "default",
  primary_color: "#1976d2",
  enable_whatsapp: "true"
};

function normalizeSettings(value) {
  if (!value || typeof value !== "object") {
    return initialSettings;
  }

  const source = value;

  return {
    direction: source.direction === "rtl" ? "rtl" : "ltr",
    site_name: String(source.site_name || initialSettings.site_name),
    theme: String(source.theme || initialSettings.theme),
    primary_color: String(source.primary_color || initialSettings.primary_color),
    enable_whatsapp: String(source.enable_whatsapp ?? initialSettings.enable_whatsapp)
  };
}

export const SettingsContext = createContext({
  settings: initialSettings,
  loading: true,
  updateSettings: arg => {},
  refreshSettings: async () => ({})
});
export default function SettingsProvider({
  children
}) {
  const [settings, setSettings] = useState(initialSettings);
  const [loading, setLoading] = useState(true);

  const updateSettings = useCallback(updatedSetting => {
    setSettings(prev => ({
      ...prev,
      ...updatedSetting
    }));
  }, []);

  const refreshSettings = useCallback(async () => {
    const remoteSettings = await apiGet("/settings");
    const normalized = normalizeSettings(remoteSettings);
    setSettings(prev => ({
      ...prev,
      ...normalized
    }));
    return normalized;
  }, []);

  useEffect(() => {
    refreshSettings().catch(() => null).finally(() => {
      setLoading(false);
    });
  }, [refreshSettings]);

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    if (settings.site_name) {
      document.title = settings.site_name;
    }
  }, [settings.site_name]);

  const contextValue = useMemo(() => ({
    settings,
    loading,
    updateSettings,
    refreshSettings
  }), [settings, loading, updateSettings, refreshSettings]);

  return <SettingsContext value={contextValue}>{children}</SettingsContext>;
}