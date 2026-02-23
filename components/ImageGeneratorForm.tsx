import React, { useState } from "react";
import {
  ArtisticStyle,
  AspectRatio,
  AspectRatioValue,
  ExportFormat,
  GenerationParams,
  ModelTierInfo,
  ModelTier,
} from "../types";

interface ImageGeneratorFormProps {
  onGenerate: (params: GenerationParams) => void;
  isLoading: boolean;
  artisticStyles: ReadonlyArray<ArtisticStyle>;
  aspectRatios: ReadonlyArray<AspectRatio>;
  exportFormats: ReadonlyArray<ExportFormat>;
  modelTiers: ReadonlyArray<ModelTierInfo>;
  isProUnlocked: boolean;
  isApiKeySet: boolean;
}

const AspectRatioIcon: React.FC<{
  ratio: AspectRatioValue;
  active: boolean;
}> = ({ ratio, active }) => {
  const dimensions: Record<AspectRatioValue, { w: number; h: number }> = {
    "1:1": { w: 10, h: 10 },
    "4:3": { w: 12, h: 9 },
    "3:4": { w: 9, h: 12 },
    "16:9": { w: 14, h: 8 },
    "9:16": { w: 8, h: 14 },
  };
  const { w, h } = dimensions[ratio];
  const stroke = active ? "stroke-accent-400" : "stroke-current";

  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className="shrink-0"
    >
      <rect
        x={(16 - w) / 2}
        y={(16 - h) / 2}
        width={w}
        height={h}
        rx="1.5"
        className={`${stroke} fill-none`}
        strokeWidth="1.5"
      />
    </svg>
  );
};

const LockIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 16 16"
    fill="currentColor"
    className="w-3 h-3"
  >
    <path
      fillRule="evenodd"
      d="M8 1a3.5 3.5 0 00-3.5 3.5V7A1.5 1.5 0 003 8.5v4A1.5 1.5 0 004.5 14h7a1.5 1.5 0 001.5-1.5v-4A1.5 1.5 0 0011.5 7V4.5A3.5 3.5 0 008 1zm2 6V4.5a2 2 0 10-4 0V7h4z"
      clipRule="evenodd"
    />
  </svg>
);

export const ImageGeneratorForm: React.FC<ImageGeneratorFormProps> = ({
  onGenerate,
  isLoading,
  artisticStyles,
  aspectRatios,
  exportFormats,
  modelTiers,
  isProUnlocked,
  isApiKeySet,
}) => {
  const [prompt, setPrompt] = useState<string>("");
  const [selectedStyle, setSelectedStyle] = useState<string>(
    artisticStyles[0].value,
  );
  const [selectedAspectRatio, setSelectedAspectRatio] =
    useState<AspectRatioValue>(aspectRatios[0].value);
  const [selectedExportFormat, setSelectedExportFormat] = useState<string>(
    exportFormats[0].value,
  );
  const [selectedModelTier, setSelectedModelTier] = useState<ModelTier>("economy");

  const canSubmit = isApiKeySet;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    if (!prompt.trim()) return;
    onGenerate({
      prompt,
      style: selectedStyle,
      aspectRatio: selectedAspectRatio,
      exportFormat: selectedExportFormat as "image/png" | "image/jpeg",
      modelTier: selectedModelTier,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (canSubmit && prompt.trim() && !isLoading) {
        handleSubmit(e as unknown as React.FormEvent);
      }
    }
  };

  const formDisabled = isLoading;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-surface-100 border border-white/[0.06] rounded-2xl transition-all duration-200 focus-within:border-white/[0.12] focus-within:shadow-[0_0_0_1px_rgba(139,92,246,0.08)]">
        <textarea
          id="prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe the image you want to create..."
          rows={4}
          className="w-full px-4 pt-3.5 pb-2 bg-transparent text-[14px] leading-relaxed text-gray-200 placeholder-gray-600 focus:outline-none resize-none"
          disabled={formDisabled}
        />

        <div className="flex items-center justify-between px-3 pb-2.5">
          <div className="flex items-center gap-1 flex-wrap">
            {aspectRatios.map((ratio) => (
              <button
                key={ratio.value}
                type="button"
                onClick={() => setSelectedAspectRatio(ratio.value)}
                disabled={formDisabled}
                title={ratio.label}
                className={`p-1.5 rounded-md transition-all duration-150 ${
                  selectedAspectRatio === ratio.value
                    ? "text-accent-400 bg-accent-500/10"
                    : "text-gray-600 hover:text-gray-400 hover:bg-white/[0.04]"
                } disabled:opacity-30`}
              >
                <AspectRatioIcon
                  ratio={ratio.value}
                  active={selectedAspectRatio === ratio.value}
                />
              </button>
            ))}

            <div className="w-px h-4 bg-white/[0.06] mx-1" />

            <div className="flex items-center bg-surface-200/60 rounded-md p-0.5">
              {modelTiers.map((tier) => {
                const isLocked = tier.requiresProAccess && !isProUnlocked;
                const isActive = selectedModelTier === tier.value;
                return (
                  <button
                    key={tier.value}
                    type="button"
                    onClick={() => !isLocked && setSelectedModelTier(tier.value)}
                    disabled={formDisabled || isLocked}
                    title={isLocked ? `${tier.description} (access key required)` : tier.description}
                    className={`px-2 py-0.5 rounded text-[11px] font-medium tracking-wide transition-all duration-150 flex items-center gap-1 ${
                      isActive
                        ? "text-accent-400 bg-accent-500/10"
                        : isLocked
                          ? "text-gray-700 cursor-not-allowed"
                          : "text-gray-600 hover:text-gray-400"
                    }`}
                  >
                    {tier.label}
                    {isLocked && <LockIcon />}
                  </button>
                );
              })}
            </div>

            <div className="w-px h-4 bg-white/[0.06] mx-1" />

            <div className="flex items-center bg-surface-200/60 rounded-md p-0.5">
              {exportFormats.map((format) => (
                <button
                  key={format.value}
                  type="button"
                  onClick={() => setSelectedExportFormat(format.value)}
                  disabled={formDisabled}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium tracking-wide transition-all duration-150 ${
                    selectedExportFormat === format.value
                      ? "text-gray-200 bg-surface-300/80"
                      : "text-gray-600 hover:text-gray-400"
                  }`}
                >
                  {format.label}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={formDisabled || !canSubmit || !prompt.trim()}
            className="p-2 rounded-lg bg-accent-600 hover:bg-accent-500 text-white disabled:opacity-20 disabled:cursor-not-allowed transition-all duration-150 shrink-0 ml-2"
          >
            {isLoading ? (
              <svg
                className="animate-spin w-4 h-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-4 h-4"
              >
                <path d="M3.105 2.29a.75.75 0 00-.826.95l1.414 4.924A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.086l-1.414 4.926a.75.75 0 00.826.95 28.897 28.897 0 0015.293-7.155.75.75 0 000-1.114A28.897 28.897 0 003.105 2.289z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <div className="px-1">
        <div className="flex flex-wrap gap-1.5">
          {artisticStyles.map((style) => (
            <button
              key={style.value}
              type="button"
              onClick={() => setSelectedStyle(style.value)}
              disabled={formDisabled}
              className={`px-2.5 py-1 rounded-lg text-[12px] font-medium transition-all duration-150 ${
                selectedStyle === style.value
                  ? "text-accent-300 bg-accent-500/[0.12] border border-accent-500/25"
                  : "text-gray-500 bg-transparent border border-transparent hover:text-gray-400 hover:bg-white/[0.03]"
              } disabled:opacity-30`}
            >
              {style.label}
            </button>
          ))}
        </div>
      </div>
    </form>
  );
};
