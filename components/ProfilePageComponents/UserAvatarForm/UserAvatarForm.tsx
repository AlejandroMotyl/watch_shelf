import Image from "next/image";
import css from "./UserAvatarForm.module.css";
import { useState } from "react";
import { useAuthStore } from "@/lib/store/authStore/authStore";
import { useMutation } from "@tanstack/react-query";
import { updateAvatar } from "@/lib/api/clientApi";

export default function UserAvatarForm() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [error, setError] = useState("");

  const { mutate: updateAvatarMutation, isPending } = useMutation({
    mutationFn: updateAvatar,
    onSuccess: (data) => {
      setUser(data.user);
    },
    onError: () => {
      setError("Failed to update avatar");
    },
  });

  if (!user) {
    return <div>Loading...</div>;
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    setError("");

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Only images");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Max file size 5MB");
      return;
    }

    setSelectedFile(file);

    const reader = new FileReader();

    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };

    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => setPreviewUrl("");

  const handleSaveChanges = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedFile) {
      return;
    }
    updateAvatarMutation(selectedFile);
  };

  return (
    <form className={css.avatarForm} onSubmit={handleSaveChanges}>
      <Image
        className={css.avatar}
        src={previewUrl || user.avatar_url || "/images/placeholder.jpeg"}
        alt="Profile picture"
        width={100}
        height={100}
      />

      <div className={css.avatarActions}>
        <label className={css.uploadButton}>
          Change picture
          <input
            className={css.fileInput}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
        </label>
        <button
          className={css.saveButton}
          type="submit"
          disabled={!selectedFile || isPending}
        >
          {isPending ? "Saving..." : "Save"}
        </button>

        <button
          className={css.removeButton}
          type="button"
          onClick={handleRemoveAvatar}
        >
          Remove
        </button>
      </div>

      {error && <p className={css.error}>{error}</p>}
    </form>
  );
}
