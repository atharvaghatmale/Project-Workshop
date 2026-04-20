import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Simple CSV to JSON parser for educational purposes.
 * Converts CSV string to an array of objects.
 */
export function parseCSV(csv: string) {
  const lines = csv.trim().split("\n");
  if (lines.length < 2) return [];
  
  const headers = lines[0].split(",").map(h => h.trim());
  
  return lines.slice(1).map(line => {
    const values = line.split(",").map(v => v.trim());
    const obj: any = {};
    headers.forEach((header, i) => {
      const val = values[i];
      // Automagically parse numbers if possible
      if (val !== "" && !isNaN(Number(val))) {
        obj[header] = Number(val);
      } else {
        obj[header] = val;
      }
    });
    return obj;
  });
}
