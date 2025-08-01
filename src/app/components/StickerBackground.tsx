import Image from 'next/image'

const stickers = [
  // Primeira fila (top)
  {
    src: "/gato_sticker.png",
    alt: "Gato de Botas",
    className: "absolute top-20 left-[20%] w-28 opacity-40 animate-float-bigger pointer-events-none",
  },
  {
    src: "/tigresa_sticker.png",
    alt: "Tigresa",
    className: "absolute top-20 right-[20%] w-28 opacity-40 animate-float-bigger pointer-events-none",
  },

  // Segunda fila (meio)
  {
    src: "/shrek_sticker.png",
    alt: "Shrek",
    className: "absolute top-[40%] left-0 w-36 opacity-40 animate-float-bigger pointer-events-none",
  },
  {
    src: "/po_sticker.png",
    alt: "Po",
    className: "absolute top-[40%] right-[20%] w-36 opacity-40 animate-float-bigger pointer-events-none",
  },
  {
    src: "/recruta_sticker.png",
    alt: "Recruta",
    className: "absolute top-[40%] left-[30%] w-24 opacity-40 animate-float-bigger pointer-events-none",
  },

  // Terceira fila (bottom)
  {
    src: "/burro_sticker.png",
    alt: "Burro",
    className: "absolute bottom-0 right-[10%] w-36 opacity-40 animate-float-bigger pointer-events-none",
  },
  {
    src: "/gloria_sticker.png",
    alt: "Gloria",
    className: "absolute bottom-0 left-[10%] w-28 opacity-40 animate-float-bigger pointer-events-none",
  },
  {
    src: "/alex_sticker.png",
    alt: "Alex",
    className: "absolute bottom-[10%] right-[20%] w-28 opacity-40 animate-float-bigger pointer-events-none",
  },
  {
    src: "/bee_sticker.png",
    alt: "Abelha",
    className: "absolute bottom-[10%] left-[22%] w-28 opacity-40 animate-float-bigger pointer-events-none",
  },
  {
    src: "/julien_sticker.png",
    alt: "Rei Julien",
    className: "absolute bottom-[30%] right-[5%] w-24 opacity-40 animate-float-bigger pointer-events-none",
  },

  // Quarta fila (canto inferior)
  {
    src: "/.png",
    alt: "",
    className: "absolute bottom-[20%] left-[5%] w-32 opacity-40 animate-float-bigger pointer-events-none",
  },
  {
    src: "/.png",
    alt: "",
    className: "absolute bottom-[20%] right-[5%] w-32 opacity-40 animate-float-bigger pointer-events-none",
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