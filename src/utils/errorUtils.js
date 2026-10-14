export function isNotFoundError(error) {
  return error?.status === 404 || error?.response?.status === 404;
}
