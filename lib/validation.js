/**
 * Validate email format
 * @param {string} email - Email address to validate
 * @returns {boolean} True if valid email format
 */
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} Validation result with valid flag and error message
 */
export function validatePassword(password) {
  if (!password || password.length < 8) {
    return { valid: false, error: 'Password must be at least 8 characters' };
  }
  return { valid: true };
}

/**
 * Validate user registration data
 * @param {Object} data - Registration data
 * @returns {Object} Validation result
 */
export function validateRegister(data) {
  const { name, email, password, role } = data;

  if (!name || name.trim().length === 0) {
    return { valid: false, error: 'Name is required' };
  }

  if (!email || !isValidEmail(email)) {
    return { valid: false, error: 'Valid email is required' };
  }

  const passwordValidation = validatePassword(password);
  if (!passwordValidation.valid) {
    return passwordValidation;
  }

  const validRoles = ['admin', 'author', 'reader'];
  if (role && !validRoles.includes(role)) {
    return { valid: false, error: 'Invalid role' };
  }

  return { valid: true };
}

/**
 * Validate user login data
 * @param {Object} data - Login data
 * @returns {Object} Validation result
 */
export function validateLogin(data) {
  const { email, password } = data;

  if (!email || !isValidEmail(email)) {
    return { valid: false, error: 'Valid email is required' };
  }

  if (!password || password.length === 0) {
    return { valid: false, error: 'Password is required' };
  }

  return { valid: true };
}

/**
 * Generate a URL-friendly slug from text
 * @param {string} text - Text to convert to slug
 * @returns {string} URL-friendly slug
 */
export function generateSlug(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    + '-' + Date.now().toString(36);
}

/**
 * Sanitize HTML content to prevent XSS
 * @param {string} content - HTML content to sanitize
 * @returns {string} Sanitized content
 */
export function sanitizeContent(content) {
  if (!content) return '';
  
  // Basic sanitization - remove script tags and event handlers
  return content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/g, '')
    .replace(/on\w+='[^']*'/g, '');
}

/**
 * Validate post data
 * @param {Object} data - Post data
 * @returns {Object} Validation result
 */
export function validatePost(data) {
  const { title, content, status } = data;

  if (!title || title.trim().length === 0) {
    return { valid: false, error: 'Title is required' };
  }

  if (title.length > 200) {
    return { valid: false, error: 'Title must be less than 200 characters' };
  }

  if (!content || content.trim().length === 0) {
    return { valid: false, error: 'Content is required' };
  }

  const validStatuses = ['draft', 'published'];
  if (status && !validStatuses.includes(status)) {
    return { valid: false, error: 'Invalid post status' };
  }

  return { valid: true };
}

/**
 * Validate comment data
 * @param {Object} data - Comment data
 * @returns {Object} Validation result
 */
export function validateComment(data) {
  const { content, post_id } = data;

  if (!content || content.trim().length === 0) {
    return { valid: false, error: 'Comment content is required' };
  }

  if (content.length > 1000) {
    return { valid: false, error: 'Comment must be less than 1000 characters' };
  }

  if (!post_id) {
    return { valid: false, error: 'Post ID is required' };
  }

  return { valid: true };
}