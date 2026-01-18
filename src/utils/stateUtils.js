// State management utilities for nested form state

// Get value from nested state at a specific path
export function getNestedValue(state, path) {
  const keys = path.split('.');
  let current = state;

  for (const key of keys) {
    if (current === null || current === undefined) {
      return undefined;
    }
    current = current[key];
  }

  return current;
}

// Update nested state at a specific path
export function updateNestedState(prevState, path, value) {
  const newState = JSON.parse(JSON.stringify(prevState));
  const keys = path.split('.');
  let current = newState;

  for (let i = 0; i < keys.length - 1; i++) {
    if (!current[keys[i]]) {
      current[keys[i]] = {};
    }
    current = current[keys[i]];
  }

  current[keys[keys.length - 1]] = value;
  return newState;
}

// Collect all nested object paths for expand/collapse initialization
export function collectNestedPaths(obj, prefix = '') {
  const paths = new Set();
  
  function traverse(obj, prefix = '') {
    for (const key in obj) {
      const currentKey = prefix ? `${prefix}.${key}` : key;
      if (obj && typeof obj === 'object' && !Array.isArray(obj) && 
          obj[key] !== null && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
        paths.add(currentKey);
        traverse(obj[key], currentKey);
      }
    }
  }
  
  if (obj) traverse(obj, prefix);
  return paths;
}

// Convert value based on field type
export function convertValueByType(value, fieldType) {
  if (fieldType === 'number') {
    const numValue = value === '' ? 0 : parseFloat(value);
    return isNaN(numValue) ? 0 : numValue;
  } else if (fieldType === 'boolean') {
    return value === true || value === 'true';
  }
  return value;
}

