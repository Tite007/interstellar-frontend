import React from "react";
import Image from "next/image";

const ImageCollage = () => {
  return (
    <div className="container mt-10 mb-20 mx-auto px-4">
      {/* First Row */}
      <div className="w-ful h-56 md:h-64 lg:h-500 xl:h-96 relative">
        <Image
          src="/AtardeceresCerroVerde.jpg"
          alt="Full Width"
          fill
          className=" rounded-xl"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          style={{ objectFit: "cover" }}
        />
      </div>

      {/* Second Row */}
      <div className="flex flex-col md:flex-row w-full gap-4 mt-4">
        {/* First Column in Second Row */}
        <div className="w-full md:w-1/2 h-56 md:h-64 lg:h-80 xl:h-96 relative">
          <Image
            src="/ElSalvador.jpeg"
            alt="Horizontal"
            fill
            className="rounded-xl "
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{ objectFit: "cover" }}
          />
        </div>

        {/* Second Column in Second Row */}
        <div className="w-full md:w-1/2 flex flex-col gap-4">
          <div className="h-56 md:h-32 lg:h-40 xl:h-48 relative">
            <Image
              src="/SunsetConchagua.jpg"
              alt="Upper"
              fill
              className=" rounded-xl"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={{ objectFit: "cover" }}
            />
          </div>
          <div className="h-56 md:h-32 lg:h-40 xl:h-48 relative">
            <Image
              src="/ElsalavadorCoffee.jpeg"
              alt="Lower"
              fill
              className=" rounded-2xl"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              style={{ objectFit: "cover" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCollage;
