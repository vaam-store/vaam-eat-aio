import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import { Protocol } from "pmtiles";
import { layers, namedFlavor } from "@protomaps/basemaps";
import { env } from "@app/env";
import { useGeolocation } from "@app/hooks/use-geolocation";

const pmtilesBaseUrl = env.NEXT_PUBLIC_MAPS_PMTILES_MINIO_BASE_URL;
const pmtilesBucket = env.NEXT_PUBLIC_MAPS_PMTILES_MINIO_BUCKET;

interface UseLocationMapProps {
  initialLocation?: { lat: number; lng: number };
  onLocationChange: (location: { lat: number; lng: number }) => void;
  selectedArea?: string;
  managedCountries: Record<
    string,
    Record<string, [number, number, number, number]>
  >;
  country?: string; // New prop: selected country code
  disabled?: boolean;
}

export function useLocationMap({
  initialLocation,
  onLocationChange,
  selectedArea,
  managedCountries,
  country,
  disabled = false,
}: UseLocationMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markerRef = useRef<maplibregl.Marker | null>(null);
  // Track location without redundant state
  // This eliminates unnecessary state synchronization with initialLocation
  const [currentLocation, setCurrentLocation] = useState<
    { lat: number; lng: number } | undefined
  >(initialLocation);

  // Only fit to bounds if there's no initialLocation provided
  // This ensures we respect the exact initialLocation when provided
  const [shouldFitToArea, setShouldFitToArea] = useState(!initialLocation);

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
              const [minLng, minLat, maxLng, maxLat] =
                countryAreas[selectedArea];
              return { lat: (minLat + maxLat) / 2, lng: (minLng + maxLng) / 2 };
            }
          }
        }
        // Fallback to country's first area if no specific selectedArea
        if (country && managedCountries && managedCountries[country]) {
          const countryRegions = managedCountries[country];
          const firstRegionName = Object.keys(countryRegions)[0];
          if (firstRegionName && countryRegions[firstRegionName]) {
            const [minLng, minLat, maxLng, maxLat] =
              countryRegions[firstRegionName];
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
              const [minLng, minLat, maxLng, maxLat] =
                firstCountryAreas[firstAreaName];
              return { lat: (minLat + maxLat) / 2, lng: (minLng + maxLng) / 2 };
            }
          }
        }
        return { lat: 0, lng: 0 }; // Absolute fallback
      })();

    let pmtilesUrl = `pmtiles://${pmtilesBaseUrl}/${pmtilesBucket}/berlin.pmtiles`; // Default fallback
    if (selectedArea) {
      pmtilesUrl = `pmtiles://${pmtilesBaseUrl}/${pmtilesBucket}/maps/${selectedArea}.pmtiles`;
    } else if (country && managedCountries && managedCountries[country]) {
      // If no specific area, but country is known, try to use the first area of that country for pmtiles
      const countryRegions = managedCountries[country];
      const firstRegionName = Object.keys(countryRegions)[0];
      if (firstRegionName) {
        pmtilesUrl = `pmtiles://${pmtilesBaseUrl}/${pmtilesBucket}/maps/${firstRegionName}.pmtiles`;
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
            //attribution: '<a href="https://protomaps.com">Protomaps</a> © <a href="https://openstreetmap.org">OpenStreetMap</a>',
          },
        },
        layers: layers("protomaps", namedFlavor("light"), { lang: "en" }),
      },
      center: [defaultCenter.lng, defaultCenter.lat],
      zoom: 14,
      doubleClickZoom: !disabled, // Disable default double-click zoom if map is disabled
      interactive: !disabled, // Disable map interactions if disabled
    });

    if (disabled && mapRef.current) {
      mapRef.current.dragPan.disable();
      mapRef.current.scrollZoom.disable();
      mapRef.current.boxZoom.disable();
      mapRef.current.dragRotate.disable();
      mapRef.current.keyboard.disable();
      mapRef.current.touchZoomRotate.disable();
    }

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

      // Decision point: Center on initialLocation OR fit to bounds
      if (initialLocation && mapRef.current) {
        // When initialLocation is provided, we prioritize centering on that exact point
        // and NEVER fit to bounds (as per requirements)
        mapRef.current.setCenter([initialLocation.lng, initialLocation.lat]);
        // No fitBounds call here - we respect the exact initialLocation
      } else if (shouldFitToArea && boundsToFit && mapRef.current) {
        // Only fit to bounds if no initialLocation and an area/country fit is needed
        mapRef.current.fitBounds(boundsToFit, { padding: 20, zoom: 14 });
      }

      // Determine marker location - prioritize initialLocation, then geolocation
      const markerLocation =
        initialLocation ??
        (latitude !== null && longitude !== null
          ? { lat: latitude, lng: longitude }
          : undefined);

      if (markerLocation && mapRef.current) {
        const marker = new maplibregl.Marker({ draggable: !disabled })
          .setLngLat([markerLocation.lng, markerLocation.lat])
          .addTo(mapRef.current);

        if (!disabled) {
          marker.on("dragend", () => {
            const lngLat = marker.getLngLat();
            const newLocation = { lat: lngLat.lat, lng: lngLat.lng };

            // Update location and notify parent component
            setCurrentLocation(newLocation);
            onLocationChange(newLocation);

            // User interaction means we should no longer fit to area bounds
            setShouldFitToArea(false);
          });
        }

        markerRef.current = marker;

        // Only update state and notify parent if this is not the initial render with initialLocation
        // This prevents redundant state updates and callbacks
        if (!initialLocation || markerLocation !== initialLocation) {
          setCurrentLocation(markerLocation);
          onLocationChange(markerLocation);
        }
      }
    });

    if (mapRef.current && !disabled) {
      // Double-click to reposition marker
      const dblClickHandler = (e: maplibregl.MapMouseEvent) => {
        e.preventDefault();
        if (markerRef.current) {
          const lngLat = e.lngLat;
          markerRef.current.setLngLat([lngLat.lng, lngLat.lat]);

          const newLocation = { lat: lngLat.lat, lng: lngLat.lng };
          setCurrentLocation(newLocation);
          onLocationChange(newLocation);

          // User interaction means we should no longer fit to area bounds
          setShouldFitToArea(false);
        }
      };
      mapRef.current.on("dblclick", dblClickHandler);

      // Cleanup function for this specific effect
      return () => {
        if (mapRef.current) {
          mapRef.current.off("dblclick", dblClickHandler);
        }
      };
    }
    // No explicit return needed if !mapRef.current || disabled

    // This return is for the main useEffect cleanup
    return () => {
      if (mapRef.current) {
        // mapRef.current.off("dblclick", () => {}); // This was too generic
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
    disabled, // Add disabled to dependency array
  ]);

  const handleAreaChange = (newArea: string) => {
    if (mapRef.current && managedCountries && !disabled) {
      for (const countryCode in managedCountries) {
        const countryAreas = managedCountries[countryCode];
        if (countryAreas?.[newArea]) {
          const [minLng, minLat, maxLng, maxLat] = countryAreas[newArea];

          // Decision point: Center vs. fitBounds
          // If initialLocation was provided, we only center the map
          // Otherwise, we may fit bounds if shouldFitToArea is true
          const centerLng = (minLng + maxLng) / 2;
          const centerLat = (minLat + maxLat) / 2;

          // Always center the map on the new area
          mapRef.current.setCenter([centerLng, centerLat]);

          // Only fit bounds if no initialLocation was provided and shouldFitToArea is true
          if (shouldFitToArea && !initialLocation) {
            mapRef.current.fitBounds(
              [
                [minLng, minLat],
                [maxLng, maxLat],
              ],
              { padding: 20 },
            );
          }
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

  const recenterMapToUserLocation = async () => {
    await getLocation(); // Ensure fresh coordinates
    if (latitude !== null && longitude !== null && mapRef.current) {
      // Set shouldFitToArea to false to prevent fitting to area bounds on next modal open
      setShouldFitToArea(false);

      const userCoords = { lat: latitude, lng: longitude };
      mapRef.current.flyTo({
        center: [userCoords.lng, userCoords.lat],
        zoom: 15,
      }); // Added zoom for better UX

      if (markerRef.current) {
        markerRef.current.setLngLat([userCoords.lng, userCoords.lat]);
      } else if (!disabled) {
        // Create marker if it doesn't exist and map is not disabled
        const marker = new maplibregl.Marker({ draggable: !disabled })
          .setLngLat([userCoords.lng, userCoords.lat])
          .addTo(mapRef.current);
        marker.on("dragend", () => {
          const lngLat = marker.getLngLat();
          const newLocation = { lat: lngLat.lat, lng: lngLat.lng };
          setCurrentLocation(newLocation);
          onLocationChange(newLocation);

          // User interaction means we should no longer fit to area bounds
          setShouldFitToArea(false);
        });
        markerRef.current = marker;
      }

      setCurrentLocation(userCoords);
      onLocationChange(userCoords);
    }
  };

  return {
    mapContainerRef,
    selectedLocation: currentLocation, // Keep the same API for consumers
    handleAreaChange,
    recenterMapToUserLocation,
  };
}
