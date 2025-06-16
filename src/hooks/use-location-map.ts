import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import { Protocol } from "pmtiles";
import { layers, namedFlavor } from "@protomaps/basemaps";
import { env } from "@app/env";
import { useGeolocation } from "@app/hooks/use-geolocation";

interface UseLocationMapProps {
  initialLocation?: { lat: number; lng: number };
  onLocationChange: (location: { lat: number; lng: number }) => void;
  selectedArea?: string;
  managedCountries: Record<string, Record<string, [number, number, number, number]>>;
  country?: string; // New prop: selected country code
}

export function useLocationMap({
  initialLocation,
  onLocationChange,
  selectedArea,
  managedCountries,
  country,
}: UseLocationMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markerRef = useRef<maplibregl.Marker | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<
    { lat: number; lng: number } | undefined
  >(initialLocation);

  const {
    latitude,
    longitude,
    isLoading: geolocationLoading,
    getLocation,
  } = useGeolocation();

  useEffect(() => {
    getLocation();
  }, [getLocation]);

  useEffect(() => {
    // Register the pmtiles protocol once per mount
    const pmtilesProtocol = new Protocol();
    maplibregl.addProtocol("pmtiles", pmtilesProtocol.tile);

    // Cleanup function to remove the protocol on unmount
    return () => {
      // It's good practice to check if removeProtocol exists,
      // though it's standard in maplibre-gl
      if (maplibregl.removeProtocol) {
        maplibregl.removeProtocol("pmtiles");
      }
    };
  }, []); // Empty dependency array ensures this runs only once on mount and unmount

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    const defaultCenter =
      initialLocation ??
      (latitude !== null && longitude !== null
        ? { lat: latitude, lng: longitude }
        : undefined) ??
      (() => {
        // Prioritize selectedArea if available
        if (selectedArea && managedCountries) {
          for (const cCode in managedCountries) {
            const countryAreas = managedCountries[cCode];
            if (countryAreas?.[selectedArea]) {
              const [minLng, minLat, maxLng, maxLat] = countryAreas[selectedArea];
              return { lat: (minLat + maxLat) / 2, lng: (minLng + maxLng) / 2 };
            }
          }
        }
        // Fallback to country's first area if no specific selectedArea
        if (country && managedCountries && managedCountries[country]) {
          const countryRegions = managedCountries[country];
          const firstRegionName = Object.keys(countryRegions)[0];
          if (firstRegionName && countryRegions[firstRegionName]) {
            const [minLng, minLat, maxLng, maxLat] = countryRegions[firstRegionName];
            return { lat: (minLat + maxLat) / 2, lng: (minLng + maxLng) / 2 };
          }
        }
        // Fallback to first country, first area if nothing else
        if (managedCountries && Object.keys(managedCountries).length > 0) {
            const firstCountryCode = Object.keys(managedCountries)[0];
            if (firstCountryCode && managedCountries[firstCountryCode]) {
                const firstCountryAreas = managedCountries[firstCountryCode];
                const firstAreaName = Object.keys(firstCountryAreas)[0];
                if (firstAreaName && firstCountryAreas[firstAreaName]) {
                    const [minLng, minLat, maxLng, maxLat] = firstCountryAreas[firstAreaName];
                    return { lat: (minLat + maxLat) / 2, lng: (minLng + maxLng) / 2 };
                }
            }
        }
        return { lat: 0, lng: 0 }; // Absolute fallback
      })();

    let pmtilesUrl = `pmtiles://${env.NEXT_PUBLIC_MAPS_PMTILES_MINIO_BASE_URL}/vaam-eat/berlin.pmtiles`; // Default fallback
    if (selectedArea) {
      pmtilesUrl = `pmtiles://${env.NEXT_PUBLIC_MAPS_PMTILES_MINIO_BASE_URL}/vaam-eat/maps/${selectedArea}.pmtiles`;
    } else if (country && managedCountries && managedCountries[country]) {
      // If no specific area, but country is known, try to use the first area of that country for pmtiles
      const countryRegions = managedCountries[country];
      const firstRegionName = Object.keys(countryRegions)[0];
      if (firstRegionName) {
        pmtilesUrl = `pmtiles://${env.NEXT_PUBLIC_MAPS_PMTILES_MINIO_BASE_URL}/vaam-eat/maps/${firstRegionName}.pmtiles`;
      }
    }


    mapRef.current = new maplibregl.Map({
      container: mapContainerRef.current,
      style: {
        version: 8,
        glyphs:
          "https://protomaps.github.io/basemaps-assets/fonts/{fontstack}/{range}.pbf",
        sprite: "https://protomaps.github.io/basemaps-assets/sprites/v4/light",
        sources: {
          protomaps: {
            type: "vector",
            url: pmtilesUrl,
            attribution: '<a href="https://protomaps.com">Protomaps</a> © <a href="https://openstreetmap.org">OpenStreetMap</a>'
          },
        },
        layers: layers("protomaps", namedFlavor("light"), { lang: "en" }),
      },
      center: [defaultCenter.lng, defaultCenter.lat],
      zoom: 14,
      doubleClickZoom: false, // Disable default double-click zoom
    });

    mapRef.current.on("load", () => {
      let boundsToFit: maplibregl.LngLatBoundsLike | undefined = undefined;

      if (selectedArea && managedCountries) {
        for (const cCode in managedCountries) {
          if (managedCountries[cCode]?.[selectedArea]) {
            const [minLng, minLat, maxLng, maxLat] =
              managedCountries[cCode][selectedArea];
            boundsToFit = [
              [minLng, minLat],
              [maxLng, maxLat],
            ];
            break;
          }
        }
      } else if (country && managedCountries?.[country]) {
        const countryRegions = managedCountries[country];
        const firstRegionName = Object.keys(countryRegions)[0];
        if (firstRegionName && countryRegions[firstRegionName]) {
          const [minLng, minLat, maxLng, maxLat] =
            countryRegions[firstRegionName];
          boundsToFit = [
            [minLng, minLat],
            [maxLng, maxLat],
          ];
        }
      }

      if (boundsToFit && mapRef.current) {
        mapRef.current.fitBounds(boundsToFit, { padding: 20, zoom: 14 });
      }

      const initialMarkerLocation =
        initialLocation ??
        (latitude !== null && longitude !== null
          ? { lat: latitude, lng: longitude }
          : undefined);
      if (initialMarkerLocation && mapRef.current) {
        const marker = new maplibregl.Marker({ draggable: true })
          .setLngLat([initialMarkerLocation.lng, initialMarkerLocation.lat])
          .addTo(mapRef.current);

        marker.on("dragend", () => {
          const lngLat = marker.getLngLat();
          setSelectedLocation({ lat: lngLat.lat, lng: lngLat.lng });
          onLocationChange({ lat: lngLat.lat, lng: lngLat.lng });
        });
        markerRef.current = marker;
        setSelectedLocation({
          lat: initialMarkerLocation.lat,
          lng: initialMarkerLocation.lng,
        });
        onLocationChange({
          lat: initialMarkerLocation.lat,
          lng: initialMarkerLocation.lng,
        });
      }
    });

    if (mapRef.current) {
      // Double-click to reposition marker
      mapRef.current.on("dblclick", (e: maplibregl.MapMouseEvent) => {
        if (markerRef.current) {
          const lngLat = e.lngLat;
          markerRef.current.setLngLat([lngLat.lng, lngLat.lat]);
          setSelectedLocation({ lat: lngLat.lat, lng: lngLat.lng });
          onLocationChange({ lat: lngLat.lat, lng: lngLat.lng });
        }
      });
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.off("dblclick", () => {}); // Remove dblclick listener
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [
    initialLocation,
    latitude,
    longitude,
    selectedArea,
    managedCountries,
    onLocationChange,
    country,
  ]);

  useEffect(() => {
    if (
      !geolocationLoading &&
      latitude !== null &&
      longitude !== null &&
      !initialLocation &&
      mapRef.current &&
      !markerRef.current
    ) {
      const userLocation = { lat: latitude, lng: longitude };
      const marker = new maplibregl.Marker({ draggable: true })
        .setLngLat([userLocation.lng, userLocation.lat])
        .addTo(mapRef.current);

      marker.on("dragend", () => {
        const lngLat = marker.getLngLat();
        setSelectedLocation({ lat: lngLat.lat, lng: lngLat.lng });
        onLocationChange({ lat: lngLat.lat, lng: lngLat.lng });
      });
      markerRef.current = marker;
      setSelectedLocation({ lat: userLocation.lat, lng: userLocation.lng });
      onLocationChange({ lat: userLocation.lat, lng: userLocation.lng });
      mapRef.current.setCenter([userLocation.lng, userLocation.lat]);
    }
  }, [
    geolocationLoading,
    latitude,
    longitude,
    initialLocation,
    onLocationChange,
  ]);

  const handleAreaChange = (newArea: string) => {
    if (mapRef.current && managedCountries) {
      for (const countryCode in managedCountries) {
        const countryAreas = managedCountries[countryCode];
        if (countryAreas?.[newArea]) {
          const [minLng, minLat, maxLng, maxLat] = countryAreas[newArea];
          mapRef.current.setCenter([
            (minLng + maxLng) / 2,
            (minLat + maxLat) / 2,
          ]);
          mapRef.current.fitBounds(
            [
              [minLng, minLat],
              [maxLng, maxLat],
            ],
            { padding: 20 },
          );
          mapRef.current.setStyle({
            version: 8,
            glyphs:
              "https://protomaps.github.io/basemaps-assets/fonts/{fontstack}/{range}.pbf",
            sprite:
              "https://protomaps.github.io/basemaps-assets/sprites/v4/light",
            sources: {
              protomaps: {
                type: "vector",
                url: `pmtiles://${env.NEXT_PUBLIC_MAPS_PMTILES_MINIO_BASE_URL}/vaam-eat/maps/${newArea}.pmtiles`,
              },
            },
            layers: layers("protomaps", namedFlavor("light"), { lang: "en" }),
          });
          break;
        }
      }
    }
  };

  return { mapContainerRef, selectedLocation, handleAreaChange };
}