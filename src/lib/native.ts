export function isNativeApp() {
  if (typeof window === "undefined") return false;
  const cap = (window as unknown as { Capacitor?: { isNativePlatform?: () => boolean } }).Capacitor;
  return Boolean(cap?.isNativePlatform?.());
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
    });
    return img.dataUrl ?? null;
  } catch {
    return null;
  }
}

export async function nativePoint(): Promise<{ lat: number; lng: number } | null> {
  try {
    const core = await import("@capacitor/core");
    if (!core.Capacitor.isNativePlatform()) return null;
    const { Geolocation } = await import("@capacitor/geolocation");
    const pos = await Geolocation.getCurrentPosition();
    return { lat: pos.coords.latitude, lng: pos.coords.longitude };
  } catch {
    return null;
  }
}
