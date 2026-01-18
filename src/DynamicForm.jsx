import React, { useState, useEffect } from 'react';
import { createTypedSchema, getSchemaAtPath } from './utils/schemaUtils';
import { getNestedValue, updateNestedState, collectNestedPaths, convertValueByType } from './utils/stateUtils';

const DynamicForm = ({ formData, onSubmit }) => {
  // Step 1: Create typed schema from JSON config
  const [schema, setSchema] = useState(() => createTypedSchema(formData));
  
  // Step 2: Maintain nested form state (preserving structure, not flattened)
  const [formState, setFormState] = useState(() => {
    return formData ? JSON.parse(JSON.stringify(formData)) : {};
  });

  // Track expanded/collapsed state for nested objects
  const [expandedSections, setExpandedSections] = useState(() => {
    return formData ? collectNestedPaths(formData) : new Set();
  });

  // Read/Write mode toggle (false = write mode, true = read mode)
  const [isReadOnly, setIsReadOnly] = useState(false);

  // Update schema and state when formData changes
  useEffect(() => {
    if (!formData) return;
    
    const newSchema = createTypedSchema(formData);
    setSchema(newSchema);
    setFormState(JSON.parse(JSON.stringify(formData)));
    
    // Reset expanded sections
    setExpandedSections(collectNestedPaths(formData));
  }, [formData]);

  // Toggle expand/collapse for nested object
  const toggleExpand = (path) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(path)) {
        newSet.delete(path);
      } else {
        newSet.add(path);
      }
      return newSet;
    });
  };

  // Handle field value change
  const handleFieldChange = (path, value, fieldType) => {
    const convertedValue = convertValueByType(value, fieldType);
    setFormState(prev => updateNestedState(prev, path, convertedValue));
  };

  // Handle array item change
  const handleArrayItemChange = (path, index, newValue, itemType) => {
    const currentArray = getNestedValue(formState, path) || [];
    const updatedArray = [...currentArray];
    const convertedValue = convertValueByType(newValue, itemType);
    updatedArray[index] = convertedValue;
    setFormState(prev => updateNestedState(prev, path, updatedArray));
  };



  // Render field based on type
  const renderField = (path, fieldKey, fieldSchema, depth = 0, readOnly = false) => {
    if (!fieldSchema) return null;

    const currentValue = getNestedValue(formState, path);
    const isExpanded = expandedSections?.has(path);

    switch (fieldSchema.type) {
      case 'object':
        // Nested object field
        return (
          <div key={path} className={depth > 0 ? 'nested-form' : 'form-group'}>
            <div 
              className="nested-label" 
              onClick={() => toggleExpand(path)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  toggleExpand(path);
                }
              }}
            >
              <button
                type="button"
                className="toggle-btn"
                aria-label={isExpanded ? 'Collapse' : 'Expand'}
                tabIndex={-1}
              >
                <span>{isExpanded ? '−' : '+'}</span>
              </button>
              <span className="nested-label-text">{fieldKey}</span>
            </div>
            {isExpanded && (
              <div className="nested-content">
                {fieldSchema.properties && Object.keys(fieldSchema.properties).map((key) => {
                  const currentPath = path ? `${path}.${key}` : key;
                  return renderField(currentPath, key, fieldSchema.properties[key], depth + 1, readOnly);
                })}
              </div>
            )}
          </div>
        );

      case 'array':
        // Array field
        const arrayValue = currentValue || [];
        const arrayFieldSchema = getSchemaAtPath(schema, path);
        const itemSchema = arrayFieldSchema?.itemType || fieldSchema?.itemType || { type: 'string' };
        const itemType = itemSchema.type || 'string';
        const arrayReadOnly = readOnly;

        const handleAddItem = () => {
          let newValue;
          switch (itemType) {
            case 'number':
              newValue = 0;
              break;
            case 'boolean':
              newValue = false;
              break;
            default:
              newValue = '';
          }
          setFormState(prev => updateNestedState(prev, path, [...arrayValue, newValue]));
        };

        return (
          <div key={path} className="form-group array-group">
            <label htmlFor={path}>{fieldKey} (Array):</label>
            <div className="array-editor">
              {arrayValue.map((item, index) => (
                <div key={index} className="array-item">
                  {itemType === 'boolean' ? (
                    <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={item === true || item === 'true'}
                      onChange={(e) => handleArrayItemChange(path, index, e.target.checked, itemType)}
                      disabled={arrayReadOnly}
                      className="checkbox-input"
                    />
                      <span>Item {index + 1}</span>
                    </label>
                  ) : (
                    <input
                      type={itemType === 'number' ? 'number' : 'text'}
                      value={item}
                      onChange={(e) => handleArrayItemChange(path, index, e.target.value, itemType)}
                      readOnly={arrayReadOnly}
                      className="array-input"
                      placeholder={`Item ${index + 1}`}
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      const updatedArray = arrayValue.filter((_, i) => i !== index);
                      setFormState(prev => updateNestedState(prev, path, updatedArray));
                    }}
                    disabled={arrayReadOnly}
                    className="array-remove-btn"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddItem}
                disabled={arrayReadOnly}
                className="array-add-btn"
              >
                + Add Item
              </button>
            </div>
          </div>
        );

      case 'boolean':
        // Boolean field (checkbox)
        const boolValue = currentValue !== undefined 
          ? currentValue 
          : (fieldSchema.defaultValue ?? false);
        return (
          <div key={path} className="form-group checkbox-group">
            <label htmlFor={path} className="checkbox-label">
              <input
                type="checkbox"
                id={path}
                checked={boolValue === true || boolValue === 'true'}
                onChange={(e) => handleFieldChange(path, e.target.checked, 'boolean')}
                disabled={readOnly}
                className="checkbox-input"
              />
              <span>{fieldKey}:</span>
            </label>
          </div>
        );

      case 'number':
        // Number field
        const numValue = currentValue !== undefined 
          ? currentValue 
          : (fieldSchema.defaultValue ?? 0);
        return (
          <div key={path} className="form-group">
            <label htmlFor={path}>{fieldKey}:</label>
            <input
              type="number"
              id={path}
              value={numValue}
              onChange={(e) => handleFieldChange(path, e.target.value, 'number')}
              readOnly={readOnly}
            />
          </div>
        );

      case 'string':
      default:
        // String field (default)
        const strValue = currentValue !== undefined 
          ? currentValue 
          : (fieldSchema.defaultValue ?? '');
        return (
          <div key={path} className="form-group">
            <label htmlFor={path}>{fieldKey}:</label>
            <input
              type="text"
              id={path}
              value={strValue}
              onChange={(e) => handleFieldChange(path, e.target.value, 'string')}
              readOnly={readOnly}
            />
          </div>
        );
    }
  };

  // Render form from schema
  const renderFormFromSchema = (schemaNode, path = '', depth = 0) => {
    if (!schemaNode) {
      return <div>No schema available</div>;
    }

    if (schemaNode.type !== 'object' || !schemaNode.properties) {
      return <div>Invalid schema structure</div>;
    }

    const propertyKeys = Object.keys(schemaNode.properties);
    
    if (propertyKeys.length === 0) {
      return <div>No fields to display</div>;
    }

    return (
      <>
        {propertyKeys.map((key) => {
          const currentPath = path ? `${path}.${key}` : key;
          const fieldSchema = schemaNode.properties[key];
          return renderField(currentPath, key, fieldSchema, depth, isReadOnly);
        })}
      </>
    );
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Preserve original structure and submit
    onSubmit(formState);
  };

  if (!schema || !formData) {
    return <div className="form-container">No form data available</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <div className="mode-toggle-section">
        <label className="mode-toggle-label">
          <input
            type="checkbox"
            checked={isReadOnly}
            onChange={(e) => setIsReadOnly(e.target.checked)}
            className="mode-toggle-checkbox"
          />
          <span>Read-Only Mode</span>
        </label>
      </div>
      {renderFormFromSchema(schema)}
      <div className="submit-section">
        <button type="submit" disabled={isReadOnly}>Submit Form</button>
      </div>
    </form>
  );
};

export default DynamicForm;
