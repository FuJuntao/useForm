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

function getNestedObject<T>(obj: any) {
  if (!obj) return obj;

  const nestedObject: any = {};
  Object.entries(obj).forEach(item => {
    const path = item[0].split(/[,[\].]+?/);
    setValue(nestedObject, path, item[1]);
  });
  return nestedObject as T;
}

export default getNestedObject;
