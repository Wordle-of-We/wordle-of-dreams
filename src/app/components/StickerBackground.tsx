import Image from 'next/image'

const stickers = [
  // Primeira fila (top)
  {
    src: "/gato_sticker.png",
    alt: "Gato de Botas",
    className: "absolute top-4 left-[20%] w-28 opacity-40 animate-float-bigger pointer-events-none",
  },
  {
    src: "/tigresa_sticker.png",
    alt: "Tigresa",
    className: "absolute top-4 right-[20%] w-28 opacity-40 animate-float-bigger pointer-events-none",
  },

  // Segunda fila (meio)
  {
    src: "/shrek_sticker.png",
    alt: "Shrek",
    className: "absolute top-[40%] left-0 w-36 opacity-40 animate-float-bigger pointer-events-none",
  },
  {
    src: "/burro_sticker.png",
    alt: "Burro",
    className: "absolute top-[40%] right-0 w-36 opacity-40 animate-float-bigger pointer-events-none",
  },
  {
    src: "/recruta_sticker.png",
    alt: "Recruta",
    className: "absolute top-[40%] left-[50%] w-24 opacity-40 animate-float-bigger pointer-events-none",
  },

  // Terceira fila (bottom)
  {
    src: "/burro_sticker.png",
    alt: "Burro",
    className: "absolute bottom-0 right-[10%] w-36 opacity-40 animate-float-bigger pointer-events-none",
  },
  {
    src: "/gato_sticker.png",
    alt: "Gato de Botas",
    className: "absolute bottom-0 left-[45%] w-28 opacity-40 animate-float-bigger pointer-events-none",
  },
  {
    src: "/alex_sticker.png",
    alt: "Alex",
    className: "absolute bottom-[10%] right-[20%] w-28 opacity-40 animate-float-bigger pointer-events-none",
  },
  {
    src: "/tigresa_sticker.png",
    alt: "Tigresa",
    className: "absolute bottom-[10%] left-[20%] w-28 opacity-40 animate-float-bigger pointer-events-none",
  },
  {
    src: "/recruta_sticker.png",
    alt: "Recruta",
    className: "absolute bottom-[30%] right-[5%] w-24 opacity-40 animate-float-bigger pointer-events-none",
  },
];

export default function StickerBackground() {
  return (
    <>
      {stickers.map((sticker, idx) => (
        <Image
          key={idx}
          src={sticker.src}
          alt={sticker.alt}
          className={sticker.className}
          width={144}
          height={144}
        />
      ))}
    </>
  );
}