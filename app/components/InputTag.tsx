import { Genre, genreType, writerType } from "@/lib";
import { ChangeEvent, KeyboardEvent, useEffect, useState } from "react";

interface TagInputProps {
  value: string | string[];
  onChange: (value: string | string[]) => void;
  suggestions: writerType[] | genreType[];
  placeholder: string;
  labelText: string;
  type: "author" | "genre";
}

const bg = [
  "bg-jewel-purple",
  "bg-jewel-red",
  "bg-jewel-green",
  "bg-jewel-yellow",
  "bg-jewel-blue",
] as const;

const border = [
  "border-pastel-purple",
  "border-pastel-red",
  "border-pastel-green",
  "border-pastel-yellow",
  "border-pastel-blue",
] as const;

const TagInput: React.FC<TagInputProps> = ({
  value,
  onChange,
  suggestions,
  placeholder,
  labelText,
  type,
}) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<
    (writerType | genreType)[]
  >([]);

  useEffect(() => {
    if (type === "author") {
      const tagArray = (value as string)
        .split(",")
        .filter((tag) => tag.trim() !== "");
      setTags(tagArray);
    } else {
      setTags(value as string[]);
    }
  }, [value, type]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setInputValue(input);

    const filtered = suggestions.filter((suggestion) =>
      suggestion.nama.toLowerCase().includes(input.toLowerCase())
    );
    setFilteredSuggestions(filtered);
    setShowSuggestions(input.length > 0);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "," || e.key === "Enter") {
      e.preventDefault();
      addTag(inputValue);
    }
  };

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && type === "author") {
      const newTags = [...tags, trimmedTag];
      setTags(newTags);
      onChange(newTags.join(","));
      setInputValue("");
      setShowSuggestions(false);
    } else if (trimmedTag && type === "genre") {
      const newTags = [...tags, trimmedTag];
      setTags(newTags);
      onChange(newTags);
      setInputValue("");
      setShowSuggestions(false);
    }
  };

  const removeTag = (indexToRemove: number) => {
    const newTags = tags.filter((_, index) => index !== indexToRemove);
    setTags(newTags);
    if (type === "author") {
      onChange(newTags.join(","));
    } else {
      onChange(newTags);
    }
  };

  const handleSuggestionClick = (suggestion: writerType | genreType) => {
    addTag(suggestion.nama);
    setShowSuggestions(false);
  };

  return (
    <div className="flex flex-col gap-1 relative">
      <label className="font-source-serif text-lg font-bold">{labelText}</label>
      <div className="relative">
        <div className="flex flex-wrap gap-2 p-2 border border-black rounded-md min-h-[42px]">
          {tags.map((tag, index) => (
            <div
              key={index}
              className={`${bg[index % bg.length]} ${
                border[index % border.length]
              } 
                flex items-center gap-2 px-3 py-1.5 rounded-full text-white-custom`}
            >
              <span className="text-[10px]">{tag}</span>
              <button
                type="button"
                onClick={() => removeTag(index)}
                className="text-white hover:text-red-200"
              >
                ✕
              </button>
            </div>
          ))}
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="flex-grow min-w-[120px] outline-none font-source-sans text-sm"
          />
        </div>

        {showSuggestions && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
            {filteredSuggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion.nama}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
