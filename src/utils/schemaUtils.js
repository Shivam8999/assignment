// Schema utility functions for creating typed JSON schema from JSON config

// Infer type from a value
export function inferType(value) {
  if (value === null || value === undefined) {
    return { type: 'string' }; // Default for null/undefined
  }

  if (Array.isArray(value)) {
    const itemType = value.length > 0 
      ? inferType(value[0]) 
      : { type: 'string' };
    return {
      type: 'array',
      itemType: itemType
    };
  }

  if (typeof value === 'object') {
    const properties = {};
    for (const key in value) {
      properties[key] = inferType(value[key]);
    }
    return {
      type: 'object',
      properties: properties
    };
  }

  // Primitive types
  return {
    type: typeof value,
    defaultValue: value
  };
}

// Create a typed JSON schema from JSON config
export function createTypedSchema(jsonData) {
  if (jsonData === null || jsonData === undefined) {
    return null;
  }

  if (Array.isArray(jsonData)) {
    // For arrays, infer type from first element, or default to string
    const itemType = jsonData.length > 0 
      ? inferType(jsonData[0]) 
      : { type: 'string' };
    return {
      type: 'array',
      itemType: itemType
    };
  }

  if (typeof jsonData === 'object') {
    // For objects, create a schema with properties
    const schema = {
      type: 'object',
      properties: {}
    };

    for (const key in jsonData) {
      schema.properties[key] = inferType(jsonData[key]);
    }

    return schema;
  }

  // Primitive types
  return inferType(jsonData);
}

// Get schema node at a specific path
export function getSchemaAtPath(schema, path) {
  if (!schema || !path) return null;
  const keys = path.split('.');
  let current = schema;

  for (const key of keys) {
    if (current && current.properties && current.properties[key]) {
      current = current.properties[key];
    } else {
      return null;
    }
  }

  return current;
}

