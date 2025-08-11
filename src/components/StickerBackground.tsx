import Image from 'next/image'

const stickers = [
  // Primeira fila (top)
  {
    src: "/gato_sticker.png",
    alt: "Gato de Botas",
    className: "absolute top-16 left-[15%] w-16 sm:w-20 md:w-24 lg:w-28 opacity-30 sm:opacity-40 animate-float-bigger pointer-events-none sm:top-20 sm:left-[20%]",
  },
  {
    src: "/tigresa_sticker.png",
    alt: "Tigresa",
    className: "absolute top-16 right-[15%] w-16 sm:w-20 md:w-24 lg:w-28 opacity-30 sm:opacity-40 animate-float-bigger pointer-events-none sm:top-20 sm:right-[20%]",
  },

  // Segunda fila (meio)
  {
    src: "/shrek_sticker.png",
    alt: "Shrek",
    className: "absolute top-[35%] left-[-5%] w-20 sm:w-24 md:w-28 lg:w-36 opacity-30 sm:opacity-40 animate-float-bigger pointer-events-none sm:top-[40%] sm:left-0",
  },
  {
    src: "/po_sticker.png",
    alt: "Po",
    className: "absolute top-[35%] right-[15%] w-20 sm:w-24 md:w-28 lg:w-36 opacity-30 sm:opacity-40 animate-float-bigger pointer-events-none sm:top-[40%] sm:right-[20%]",
  },
  {
    src: "/recruta_sticker.png",
    alt: "Recruta",
    className: "hidden sm:block absolute top-[40%] left-[30%] w-20 md:w-22 lg:w-24 opacity-40 animate-float-bigger pointer-events-none",
  },

  // Terceira fila (bottom)
  {
    src: "/burro_sticker.png",
    alt: "Burro",
    className: "absolute bottom-2 right-[8%] w-20 sm:w-24 md:w-28 lg:w-36 opacity-30 sm:opacity-40 animate-float-bigger pointer-events-none sm:bottom-0 sm:right-[10%]",
  },
  {
    src: "/gloria_sticker.png",
    alt: "Gloria",
    className: "absolute bottom-2 left-[8%] w-16 sm:w-20 md:w-24 lg:w-28 opacity-30 sm:opacity-40 animate-float-bigger pointer-events-none sm:bottom-0 sm:left-[10%]",
  },
  {
    src: "/alex_sticker.png",
    alt: "Alex",
    className: "hidden sm:block absolute bottom-[10%] right-[20%] w-20 md:w-24 lg:w-28 opacity-40 animate-float-bigger pointer-events-none",
  },
  {
    src: "/bee_sticker.png",
    alt: "Abelha",
    className: "hidden md:block absolute bottom-[10%] left-[22%] w-20 lg:w-28 opacity-40 animate-float-bigger pointer-events-none",
  },
  {
    src: "/julien_sticker.png",
    alt: "Rei Julien",
    className: "absolute bottom-[25%] right-[2%] w-14 sm:w-16 md:w-20 lg:w-24 opacity-30 sm:opacity-40 animate-float-bigger pointer-events-none sm:bottom-[30%] sm:right-[5%]",
  },
];

export default function StickerBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {stickers.map((sticker, idx) => (
        <Image
          key={idx}
          src={sticker.src}
          alt={sticker.alt}
          className={sticker.className}
          width={144}
          height={144}
          priority={false}
        />
      ))}
    </div>
  );
}