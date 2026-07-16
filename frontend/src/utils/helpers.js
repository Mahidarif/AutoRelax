export const formatPrice = (price) =>
  `Rs. ${new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(price || 0)}`;

export const getErrorMessage = (error) =>
  error.response?.data?.message || error.message || 'Something went wrong';
