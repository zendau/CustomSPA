export default function (value: unknown) {
  if (
    typeof value === "number" ||
    typeof value === "string" ||
    typeof value === "boolean" ||
    typeof value === "bigint" ||
    typeof value === "undefined" ||
    typeof value === "symbol" ||
    value === null
  )
    return true;

  return false;
}
