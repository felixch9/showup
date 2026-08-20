type CapWindow = {
  Capacitor?: { isNativePlatform?: () => boolean };
};

export function isNativeApp() {
  if (typeof window === "undefined") return false;
  const cap = (window as unknown as CapWindow).Capacitor;
  return Boolean(cap?.isNativePlatform?.());
}

export async function bootNative() {
  try {
    const core = await import("@capacitor/core");
    if (!core.Capacitor.isNativePlatform()) return;
    const { StatusBar, Style } = await import("@capacitor/status-bar");
    const { SplashScreen } = await import("@capacitor/splash-screen");
    const { App } = await import("@capacitor/app");
    await StatusBar.setBackgroundColor({ color: "#0c100b" }).catch(() => {});
    await StatusBar.setStyle({ style: Style.Dark }).catch(() => {});
    await SplashScreen.hide().catch(() => {});
    App.addListener("backButton", ({ canGoBack }) => {
      if (canGoBack) window.history.back();
    });
    await registerPush();
  } catch {
    /* web */
  }
}

export async function takeNativePhoto(): Promise<string | null> {
  try {
    const core = await import("@capacitor/core");
    if (!core.Capacitor.isNativePlatform()) return null;
    const { Camera, CameraResultType, CameraSource } = await import("@capacitor/camera");
    const img = await Camera.getPhoto({
      quality: 70,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt,
      allowEditing: false,
    });
    return img.dataUrl ?? null;
  } catch {
    return null;
  }
}

export async function nativePoint(): Promise<{ lat: number; lng: number } | null> {
  try {
    const core = await import("@capacitor/core");
    if (core.Capacitor.isNativePlatform()) {
      const { Geolocation } = await import("@capacitor/geolocation");
      const pos = await Geolocation.getCurrentPosition({ enableHighAccuracy: true, timeout: 8000 });
      return { lat: pos.coords.latitude, lng: pos.coords.longitude };
    }
  } catch {
    /* fall through to browser */
  }
  if (typeof navigator !== "undefined" && navigator.geolocation) {
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (p) => resolve({ lat: p.coords.latitude, lng: p.coords.longitude }),
        () => resolve(null),
        { timeout: 8000 },
      );
    });
  }
  return null;
}

export async function prefSet(key: string, value: string) {
  try {
    const { Preferences } = await import("@capacitor/preferences");
    await Preferences.set({ key, value });
  } catch {
    if (typeof localStorage !== "undefined") localStorage.setItem(`pref.${key}`, value);
  }
}

export async function prefGet(key: string) {
  try {
    const { Preferences } = await import("@capacitor/preferences");
    const { value } = await Preferences.get({ key });
    return value;
  } catch {
    if (typeof localStorage !== "undefined") return localStorage.getItem(`pref.${key}`);
    return null;
  }
}

async function registerPush() {
  try {
    const { PushNotifications } = await import("@capacitor/push-notifications");
    let perm = await PushNotifications.checkPermissions();
    if (perm.receive !== "granted") perm = await PushNotifications.requestPermissions();
    if (perm.receive !== "granted") return;
    await PushNotifications.register();
    PushNotifications.addListener("registration", (t) => {
      void prefSet("pushToken", t.value);
    });
  } catch {
    /* web or missing permission */
  }
}
