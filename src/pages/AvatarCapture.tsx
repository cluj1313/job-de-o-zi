import { useRef, useState } from 'react';
import { Camera, ImagePlus, RotateCcw, Check } from 'lucide-react';

interface Props {
  onSave: (dataUrl: string) => void;
  onCancel: () => void;
}

export function AvatarCapture({ onSave, onCancel }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  return (
    <div className="fixed inset-0 z-[60] bg-earth/60 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm p-5 shadow-xl">
        <h2 className="text-lg font-bold text-earth mb-3">Avatar</h2>
        <p className="text-xs text-gray-500 mb-4">
          Fă o poză sau încarcă din galerie. (Video avatar — TODO)
        </p>

        {preview ? (
          <div className="flex flex-col items-center gap-4">
            <img
              src={preview}
              alt="Preview"
              className="w-40 h-40 rounded-full object-cover border-4 border-terracotta"
            />
            <div className="flex gap-2 w-full">
              <button
                type="button"
                onClick={() => setPreview(null)}
                className="flex-1 h-11 rounded-xl border border-gray-200 flex items-center justify-center gap-2 text-sm font-medium"
              >
                <RotateCcw size={16} />
                Refă
              </button>
              <button
                type="button"
                onClick={() => onSave(preview)}
                className="flex-1 h-11 rounded-xl bg-terracotta text-white flex items-center justify-center gap-2 text-sm font-medium"
              >
                <Check size={16} />
                Salvează
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => cameraRef.current?.click()}
              className="h-28 rounded-xl border-2 border-dashed border-terracotta/40 flex flex-col items-center justify-center gap-2 text-terracotta"
            >
              <Camera size={28} />
              <span className="text-sm font-medium">Cameră</span>
            </button>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="h-28 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-2 text-gray-600"
            >
              <ImagePlus size={28} />
              <span className="text-sm font-medium">Galerie</span>
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={onCancel}
          className="mt-4 w-full text-sm text-gray-500 py-2"
        >
          Anulează
        </button>

        <input
          ref={cameraRef}
          type="file"
          accept="image/*"
          capture="user"
          className="hidden"
          onChange={onFile}
        />
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onFile}
        />
      </div>
    </div>
  );
}
