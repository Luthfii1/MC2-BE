// Helper function to check for required fields
export const checkRequiredField = (field: any, fieldName: string) => {
  if (!field) {
    throw new Error(`${fieldName} is missing`);
  }
};

// Helper function to check for duplicate values 
export const checkDuplicateValue = (field: any, fieldName: string, data: any[]) => {
  const duplicate = data.find((data) => data[fieldName] === field);
  if (duplicate) {
    throw new Error(`${fieldName} already exists`);
  }
};

