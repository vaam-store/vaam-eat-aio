import localforage from 'localforage';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface MapCacheState {
  enabled: boolean;
  country: string | null;
  region: string | null;
  downloadStatus: 'idle' | 'downloading' | 'success' | 'error';
  progress: number;
  fileInfo: { url: string; size: number; lastUpdated: number } | null;
}

interface MapCacheActions {
  toggleEnabled: (enabled?: boolean) => void;
  setCountry: (country: string | null) => void;
  setRegion: (region: string | null) => void;
  triggerDownload: () => void;
  setProgress: (progress: number) => void;
  setDownloadStatus: (status: MapCacheState['downloadStatus']) => void;
  clearCache: () => void;
}

const useMapCacheStore = create<MapCacheState & MapCacheActions>()(
  persist(
    (set) => ({
      enabled: false,
      country: null,
      region: null,
      downloadStatus: 'idle',
      progress: 0,
      fileInfo: null,
      toggleEnabled: (enabled) =>
        set((state) => ({ enabled: enabled ?? !state.enabled })),
      setCountry: (country) => set({ country }),
      setRegion: (region) => set({ region }),
      triggerDownload: () => {
        // Stub for triggering download
        console.log('Download triggered');
      },
      setProgress: (progress) => set({ progress }),
      setDownloadStatus: (downloadStatus) => set({ downloadStatus }),
      clearCache: () => {
        // Logic to clear cache will be implemented here
        console.log('Cache cleared');
      },
    }),
    {
      name: 'map-cache-storage',
      storage: {
        getItem: async (name: string): Promise<any> => {
          return await localforage.getItem(name);
        },
        setItem: async (name: string, value: any) => {
          await localforage.setItem(name, value);
        },
        removeItem: async (name: string) => {
          await localforage.removeItem(name);
        },
      },
      version: 1,
    },
  ),
);

export default useMapCacheStore;
