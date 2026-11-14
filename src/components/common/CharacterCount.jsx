import React from 'react';

export default function CharacterCount({ id, value = '', max, min }) {
  const length = String(value ?? '').length;
  return <div id={id} className="mt-1 flex flex-wrap items-center justify-end gap-x-3 gap-y-1 text-xs leading-5">
    {min && <span className="mr-auto text-vh-text-secondary">Minimum {min} characters</span>}
    <span className={`tabular-nums ${length >= max ? 'font-medium text-amber-800' : 'text-vh-text-secondary'}`}>
      {length >= max && <span>{length > max ? 'Over character limit' : 'Character limit reached'} · </span>}
      {length.toLocaleString('en-US')} / {max.toLocaleString('en-US')} characters
    </span>
  </div>;
}
