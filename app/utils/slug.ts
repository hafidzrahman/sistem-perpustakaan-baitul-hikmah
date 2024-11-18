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
  return slug
    .split("-") // Pisahkan string berdasarkan dash
    .map((word) =>
      // Capitalize setiap kata, kecuali kata-kata tertentu
      ["and", "or", "in", "on", "at", "to", "for", "of", "with"].includes(word)
        ? word
        : word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(" "); // Gabungkan kembali dengan spasi
}
