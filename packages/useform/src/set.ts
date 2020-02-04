function setValue(obj: any, arr: string[], value: any) {
  const item = arr[0];
  if (arr.length > 1) {
    obj[item] = obj[item] ?? {};
    setValue(
      obj[item],
      arr.filter((_, index) => index !== 0),
      value,
    );
  } else {
    obj[item] = value;
  }
}

function set<T>(obj: any, path: string, value: any) {
  const newObj = { ...obj };
  const pathArray = path.split(/[,[\].]+?/);
  setValue(newObj, pathArray, value);
  return newObj as T;
}

export default set;
