// components/EmblaCarouselProducts.js
import React from 'react'
import {
  PrevButton,
  NextButton,
  usePrevNextButtons,
} from '@/src/components/Products/EmblaCarouselArrowButtons'
import {
  SelectedSnapDisplay,
  useSelectedSnapDisplay,
} from '@/src/components/Products/EmblaCarouselSelectedSnapDisplay'
import useEmblaCarousel from 'embla-carousel-react'
import SimilarProductsCard from './SimilarProductsCard'

const EmblaCarouselProducts = ({ products = [], options }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(options)
  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi)
  const { selectedSnap, snapCount } = useSelectedSnapDisplay(emblaApi)

  return (
    <section className="embla-product">
      <div className="embla-product__viewport" ref={emblaRef}>
        <div className="embla-product__container">
          {products.length > 0 ? (
            products.map((product, index) => (
              <div className="embla-product__slide" key={index}>
                {/* No Link wrapping the whole card */}
                <SimilarProductsCard product={product} />
              </div>
            ))
          ) : (
            <p>No products available</p>
          )}
        </div>
      </div>
      <div className="embla-product__controls">
        <div className="embla-product__buttons">
          <PrevButton onClick={onPrevButtonClick} disabled={prevBtnDisabled} />
          <NextButton onClick={onNextButtonClick} disabled={nextBtnDisabled} />
        </div>
        <SelectedSnapDisplay
          selectedSnap={selectedSnap}
          snapCount={snapCount}
        />
      </div>
    </section>
  )
}

export default EmblaCarouselProducts
