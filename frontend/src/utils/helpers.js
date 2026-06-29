export const formatPrice = (price) =>
  new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR' }).format(price);

export const getErrorMessage = (error) =>
  error.response?.data?.message || error.message || 'Something went wrong';
