export function validateTask(formData) {
  const errors = {};

  if (!formData.title.trim()) {
    errors.title = "Title is required.";
  } else if (formData.title.trim().length < 3) {
    errors.title = "Title must be at least 3 characters.";
  }

  if (formData.description.length > 300) {
    errors.description = "Description must be less than 300 characters.";
  }

  if (formData.dueDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const due = new Date(formData.dueDate);

    if (due < today) {
      errors.dueDate = "Due date cannot be in the past.";
    }
  }

  return errors;
}
