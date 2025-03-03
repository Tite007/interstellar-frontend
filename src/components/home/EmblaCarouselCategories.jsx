// components/Categories/EmblaCarouselCategories.js
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
import Link from 'next/link'
import { Card, CardHeader, CardBody } from '@heroui/card'
import Image from 'next/image'
import './EmblaCarouselCategories.css'

const EmblaCarouselCategories = ({ categories = [], options }) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(options)
  const {
    prevBtnDisabled,
    nextBtnDisabled,
    onPrevButtonClick,
    onNextButtonClick,
  } = usePrevNextButtons(emblaApi)
  const { selectedSnap, snapCount } = useSelectedSnapDisplay(emblaApi)

  return (
    <section className="embla-category">
      <div className="embla-category__viewport" ref={emblaRef}>
        <div className="embla-category__container">
          {categories.length > 0 ? (
            categories.map((category) => (
              <div className="embla-category__slide" key={category._id}>
                <Link
                  href={`/categories/${category.name.toLowerCase()}`}
                  className="block h-full"
                >
                  <Card
                    shadow="none"
                    className="h-full w-full sm:w-40 md:w-56 lg:w-64 xl:w-72 2xl:w-80 py-2 sm:py-4 border hover:shadow-lg transition-shadow duration-300 flex flex-col justify-center items-center"
                  >
                    <CardHeader className="pb-0 pt-1 sm:pt-2 px-2 sm:px-4 flex justify-center items-center">
                      <h4 className="font-bold text-large text-center  sm:text-large">
                        {category.name}
                      </h4>
                    </CardHeader>
                    <CardBody className="overflow-visible py-1 sm:py-2 flex justify-center items-center">
                      <Image
                        alt={`${category.name} category image`}
                        className="object-cover rounded-xl"
                        src={category.image || '/placeholder-image.jpg'}
                        width={80} // Reduced base width for mobile
                        height={40} // Reduced base height for mobile
                        sizes="(max-width: 640px) 80px, (max-width: 768px) 120px, (max-width: 1024px) 150px, (max-width: 1280px) 180px, 200px" // Adjusted responsive image sizes
                      />
                    </CardBody>
                  </Card>
                </Link>
              </div>
            ))
          ) : (
            <p>No categories available</p>
          )}
        </div>
      </div>
      <div className="embla-category__controls">
        <div className="embla-category__buttons">
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

export default EmblaCarouselCategories
