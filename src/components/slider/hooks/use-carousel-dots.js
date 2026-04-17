import { useState, useEffect, useCallback } from "react";
export function useCarouselDots(emblaApi) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);
  const onDotButtonClick = useCallback(index => {
    if (!emblaApi) return;
    emblaApi.scrollTo(index);
  }, [emblaApi]);
  const onInit = useCallback(emblaApi => {
    setScrollSnaps(emblaApi.scrollSnapList());
  }, []);
  const onSelect = useCallback(emblaApi => {
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, []);
  useEffect(() => {
    if (!emblaApi) return;
    onInit(emblaApi);
    onSelect(emblaApi);
    emblaApi.on("reInit", onInit).on("reInit", onSelect).on("select", onSelect);
  }, [emblaApi, onInit, onSelect]);
  return {
    scrollSnaps,
    selectedIndex,
    onDotButtonClick
  };
}