export function extractQueryParams(query) {
  return query
    .substr(1) // Remove o "?" do início
    .split("&") // Separa por "&" -> ["name=João", "email=test"]
    .reduce((queryParams, param) => {
      const [key, value] = param.split("="); // Separa key e value
      queryParams[key] = value;
      return queryParams;
    }, {});
}
