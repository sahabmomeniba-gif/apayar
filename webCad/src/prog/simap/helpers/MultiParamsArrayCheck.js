export function multipleExist(arr, values) {
  return values.every(value => {
      return arr.indexOf(value) !== -1;
    });
  }