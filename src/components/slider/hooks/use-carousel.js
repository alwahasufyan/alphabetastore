import useEmblaCarousel from "embla-carousel-react";
import { useCarouselDots } from "./use-carousel-dots";
import { useCarouselArrows } from "./use-carousel-arrows";
export function useCarousel(options, plugins) {
  const [ref, api] = useEmblaCarousel(options, plugins);
  const arrows = useCarouselArrows(api);
  const dots = useCarouselDots(api);
  return {
    api,
    ref,
    dots,
    arrows,
    plugins: plugins?.map(plugin => plugin.name),
    options: {
      ...options,
      ...api?.internalEngine().options
    }
  };
}