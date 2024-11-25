export function toSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function fromSlug(slug: string): string {
  const exceptions = [
    "and",
    "or",
    "the",
    "in",
    "on",
    "at",
    "to",
    "for",
    "of",
    "with",
  ];

  return slug
    .split("-") // Pisahkan string berdasarkan dash
    .map((word, index) =>
      // Kata pertama selalu capitalize, kata lainnya sesuai aturan pengecualian
      index === 0 || !exceptions.includes(word)
        ? word.charAt(0).toUpperCase() + word.slice(1)
        : word
    )
    .join(" "); // Gabungkan kembali dengan spasi
}
