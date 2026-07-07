import type { ChangeEventHandler, CSSProperties, HTMLAttributes, KeyboardEvent } from 'react';
import { Icon } from '@/components/atoms/Icon';

/* PhotoUpload — dashed drop target for the optional "snap a photo of the tire"
   triage field. Shows a thumbnail preview once a file is chosen. */
type PhotoUploadProps = {
  fileName?: string;
  previewUrl?: string;
  onPick?: ChangeEventHandler<HTMLInputElement>;
  style?: CSSProperties;
} & Omit<HTMLAttributes<HTMLLabelElement>, 'onChange'>;

export function PhotoUpload({ fileName, previewUrl, onPick, style, ...rest }: PhotoUploadProps) {
  const hasFile = Boolean(fileName || previewUrl);

  function handleKeyDown(e: KeyboardEvent<HTMLLabelElement>) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      // Trigger the hidden file input via the label's implicit association
      (e.currentTarget.querySelector('input[type="file"]') as HTMLInputElement | null)?.click();
    }
  }

  return (
    <label
      tabIndex={0}
      role="button"
      aria-label={hasFile ? `Photo attached: ${fileName ?? 'image'}. Press Enter to change` : 'Upload a photo of the tire. Press Enter to browse files'}
      onKeyDown={handleKeyDown}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        minHeight: 72,
        padding: 12,
        background: 'var(--bg-input)',
        border: `2px dashed ${hasFile ? 'var(--signal-green)' : 'var(--border-strong)'}`,
        borderRadius: 'var(--radius-md)',
        cursor: 'pointer',
        transition: 'border-color var(--dur-fast) var(--ease-out)',
        outline: 'none',
        boxShadow: undefined,
        ...style,
      }}
      onFocus={(e) => {
        e.currentTarget.style.boxShadow = 'var(--focus-ring)';
      }}
      onBlur={(e) => {
        e.currentTarget.style.boxShadow = 'none';
      }}
      {...rest}
    >
      <span
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 48,
          height: 48,
          flex: 'none',
          borderRadius: 'var(--radius-sm)',
          overflow: 'hidden',
          background: hasFile ? 'transparent' : 'var(--graphite-700)',
          color: hasFile ? 'var(--signal-green)' : 'var(--steel-300)',
        }}
      >
        {previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- ephemeral client-side object URL preview, not an optimizable asset
          <img src={previewUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <Icon name={hasFile ? 'check-circle' : 'camera'} size={24} />
        )}
      </span>
      <span style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0 }}>
        <span
          style={{
            fontFamily: 'var(--font-condensed)',
            fontWeight: 700,
            fontSize: 15,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            color: 'var(--off-white)',
          }}
        >
          {hasFile ? 'Photo attached' : 'Snap a photo of the tire'}
        </span>
        <span
          style={{
            fontSize: 13,
            color: 'var(--steel-300)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {hasFile ? fileName : 'Helps us triage before we roll — optional'}
        </span>
      </span>
      <input type="file" accept="image/*" capture="environment" onChange={onPick} style={{ display: 'none' }} />
    </label>
  );
}
