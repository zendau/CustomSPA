export default function stringObjectFileds(
  script: Record<string, any>,
  path: string
) {
  const keys = path.split(".");

  return keys.reduce((prev, curr) => {
    const data = prev[curr];

    if (!data) {
      console.error(`unknown object key ${path}`);
    }

    return data;
  }, script) as any;
}
