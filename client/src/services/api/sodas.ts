import { ApiCore } from "./utilities/core";

const url = 'api/sodas';
const plural = 'sodas';
const single = 'soda';

// plural and single may be used for message logic if needed in the ApiCore class.

const apiSodas = new ApiCore({
//   getAll: true,
//   getSingle: true,
//   post: true,
//   put: false,
//   patch: true,
//   delete: false,
//   url: url,  
//   plural: plural,
//   single: single
});

//apiSodas.massUpdate = () => {
  // Add custom api call logic here
//}

export { apiSodas };