const keyMap = {
    project: 'Organization Project',
    otherProject: 'Other Project',
    task: 'Organization Task',
    otherTask: 'Other Task',
    subtask: 'Organization Subtask',
    otherSubtask: 'Other Subtask',
    user: 'Organization User',
    roles: 'Organization Roles',
    comments: 'Organization Comments',
    upload: 'Organization Uploads',
    links: 'Organization Links',
    activity: 'Organization Activity'
  };
  
  // Invert keyMap for reverse mapping
  const reverseKeyMap = Object.fromEntries(
    Object.entries(keyMap).map(([k, v]) => [v, k])
  );
  
  // Transform for displaying (user-friendly keys)
 export function transformForDisplay(originalData) {
    const result = {};
    for (const key in originalData) {
      const displayKey = keyMap[key] || key;
      result[displayKey] = originalData[key];
    }
    return result;
  }
  
  // Transform for updating (back to original keys)
 export function transformForUpdate(displayData) {
    const result = {};
    for (const key in displayData) {
      const originalKey = reverseKeyMap[key] || key;
      result[originalKey] = displayData[key];
    }
    return result;
  }
  