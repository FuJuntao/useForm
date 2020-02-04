function getValue<T>(obj: any, arr: string[]): T | undefined {
  const item = arr[0];
  if (obj === undefined || obj === null) return obj;
  if (arr.length > 1) {
    return getValue(
      obj[item],
      arr.filter((_, index) => index !== 0),
    );
  }
  return obj[item];
}

function get<T>(obj: any, path: string) {
  const pathArray = path.split(/[,[\].]+?/);
  const value = getValue<T>(obj, pathArray);
  return value;
}

export default get;
