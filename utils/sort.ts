export const fieldSorter = (fields: string[]) => (a: any, b: any) =>
  fields
    .map((o) => {
      let dir = 1;
      if (o.startsWith('-')) {
        dir = -1;
        o = o.substring(1);
      }
      return a[o] > b[o] ? dir : a[o] < b[o] ? -dir : 0;
    })
    .reduce((p, n) => (p ? p : n), 0);