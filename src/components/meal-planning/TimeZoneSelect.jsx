import React from 'react';

const COMMON_TIME_ZONES = [
  ['Asia/Ho_Chi_Minh', 'Ho Chi Minh City, Vietnam'],
  ['Asia/Bangkok', 'Bangkok, Thailand'],
  ['Asia/Jakarta', 'Jakarta, Indonesia'],
  ['Asia/Kuala_Lumpur', 'Kuala Lumpur, Malaysia'],
  ['Asia/Singapore', 'Singapore'],
  ['Asia/Manila', 'Manila, Philippines'],
  ['Asia/Tokyo', 'Tokyo, Japan'],
  ['Asia/Seoul', 'Seoul, South Korea'],
  ['Asia/Kolkata', 'Kolkata, India'],
  ['Asia/Dubai', 'Dubai, United Arab Emirates'],
  ['Europe/London', 'London, United Kingdom'],
  ['Europe/Paris', 'Paris, France'],
  ['Europe/Berlin', 'Berlin, Germany'],
  ['America/New_York', 'New York, United States'],
  ['America/Toronto', 'Toronto, Canada'],
  ['America/Chicago', 'Chicago, United States'],
  ['America/Denver', 'Denver, United States'],
  ['America/Los_Angeles', 'Los Angeles, United States'],
  ['America/Vancouver', 'Vancouver, Canada'],
  ['Australia/Sydney', 'Sydney, Australia'],
  ['Pacific/Auckland', 'Auckland, New Zealand'],
  ['UTC', 'Coordinated Universal Time'],
];

function offsetLabel(timeZone) {
  try {
    const offset = new Intl.DateTimeFormat('en', {
      timeZone,
      timeZoneName: 'longOffset',
    }).formatToParts(new Date()).find(part => part.type === 'timeZoneName')?.value;
    return offset ? ` · ${offset.replace(/^GMT/, 'UTC')}` : '';
  } catch {
    return '';
  }
}

function zoneLabel(name, timeZone) {
  return `${name}${offsetLabel(timeZone)}`;
}

function getDeviceTimeZone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
  } catch {
    return 'UTC';
  }
}

export default function TimeZoneSelect({ id, value, onChange, className = 'wm-control', ...props }) {
  const deviceTimeZone = getDeviceTimeZone();
  const deviceKnownZone = COMMON_TIME_ZONES.find(([zone]) => zone === deviceTimeZone);
  const selectedKnownZone = COMMON_TIME_ZONES.find(([zone]) => zone === value);

  return (
    <select id={id} className={className} value={value} onChange={onChange} {...props}>
      <optgroup label="Your device">
        <option value={deviceTimeZone}>
          Use device timezone — {zoneLabel(deviceKnownZone?.[1] || deviceTimeZone, deviceTimeZone)}
        </option>
      </optgroup>
      <optgroup label="Common time zones">
        {COMMON_TIME_ZONES.filter(([zone]) => zone !== deviceTimeZone).map(([zone, name]) => (
          <option key={zone} value={zone}>{zoneLabel(name, zone)}</option>
        ))}
        {value && !selectedKnownZone && value !== deviceTimeZone && (
          <option value={value}>Saved timezone — {zoneLabel(value, value)}</option>
        )}
      </optgroup>
    </select>
  );
}
