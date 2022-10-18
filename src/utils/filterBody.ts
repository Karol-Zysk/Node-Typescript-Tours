export const filterObj = (obj: any, ...allowedFields: string[]) => {
    const newObj: any = {};
    Object.keys(obj).forEach((el: any) => {
      if (allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
  };