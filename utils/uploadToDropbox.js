const { Dropbox } = require('dropbox');
const fetch = require('node-fetch'); // Required for Dropbox SDK

const DROPBOX_ACCESS_TOKEN = 'sl.u.AF1V6TMXAgz3T9eAWvjqZyYNee4gvV6EG-4-iasQOw7Ne_Lw1TCRvBonx6-xrgz0DC7QesVNTMpKKjpcdOMFEPnm0TT8Ndd0rYkUqFQRaezL7AAu0_usygNwZG7965WGoGW04n7B6c0NlxbwDLGI1V--meVYXFquHP-8q5E_kIEtkdiIT-eqvkInHkepA7AgpYVJHqky0upIGY8N58uYUSxoEeBj9FkHDApry-CSnIcS0O9p8tehvzUvsahtoFMuyPwHW3uvp9mMLhHdi97wmmEEIJI01De2p1dE6vMNHVUkQ9ef6qSUnp7EAaI8EqJKr-nz3fZMZI3S87V8_wysVK7_YLfLSif_QitOEHd6u9prTrOpARAWYchItr7Gf_6lWM7T1cmdV6x7E6Rr4vwELmlmfshlBjg6RAHwqNvymDQN3Eep99IC78bMRyTey521UgKbMvBbMQvzLaflnZm3cgEgvjnqoLrRDX6YRENzmJeUeG3338VrD2uGX5ZfqSWTDWatJu6VPe_c5Cdig0RBi8DLClJvlUiXeuyUcLXqN_xiu9-OHr_Y_gK8948P_yFQWJtPJbVMpyM_gAg09Z_PWaJ4l-S0q8v1NXFnHukbVoQLi9dw5l8WW9VsZUoSC_1nAhljA3QDkYCbgQFMC2I5RLomTdKtPCyuNw1JqKdRdb2dYmoBxTnQSyL5wEjFcENqq6J7Z19xOUmt35a2MTM91JjQ5enz9tW1BBnwfjq7x-X4pN5tO5PVwPUchcMNbV6vDlsIFNG3je9YKYJ_3nEYu1RPWkDzxc--r45JJQ-t4S9_DGSuxE9Jxoo5AWUdyAQ2HHtqTi2GJZX1lqYFTsetSmMH7MsfhApgkPPkzmYZV8djYSHzHy9VB2SmbDD1jfLb_yyTQiEChoEmM_-njAXNIjGSy9EuC5ix8Mvea14t5fQXQNHOeQONZfyeTNnM_h8kpIDVeQpie_aX-SDgtoVdHPojl5ddxG4xEgzVS_fa4W3n1VS9BWNr67B6iWnYkLK-zPIIGWRDSNRHcQ0XLun6Z_r6pI3T66BrsiTVKa9kkiUePU2VaBfl-yEPz1-hHDWgRcQQ7tWZ9Cmy26jiKuPQLJsdCf0jdlnUYkNIH8NKs1VKsjx7VZDAMJBeST5tp261vmA1jHJnacg3Whcd5H8-FS9Bnqu_LX4dtxszxNjkCAUg2Gm-L-B-gz2NnyeUX_9VrFpKHF120xiPgk0etlMTSuuvnPmUCSLv4qDrrQiyQo5Ik4iqyj--lsRDHwKjJ_1OGkJ7NgqfY_2lgW9DJTcLEAhuarWaV1fyG2shmMzDQJTBG8XIvt57fCny4WK_rrhNVZOarhsM8QJ54gh8QFZRnw4_hWooFO0MIa1nb99RzJbfumABBkNTcn0G9oCgcOrL8ZQkZg21sMzWK4vzxnDF6CJLOD1ScCVNx2F8yAVRFnDMcrv9cGsPdfCHHJjHGJQGbP0'; // Replace with your generated access token

async function uploadPdfToDropbox(fileBuffer, fileName) {
  const dbx = new Dropbox({ accessToken: DROPBOX_ACCESS_TOKEN, fetch });
  // Upload the file
  const uploadRes = await dbx.filesUpload({
    path: '/' + fileName,
    contents: fileBuffer,
    mode: 'add',
    autorename: true,
    mute: false,
  });
  // Create a shared link
  const sharedLinkRes = await dbx.sharingCreateSharedLinkWithSettings({
    path: uploadRes.result.path_display,
    settings: { requested_visibility: { '.tag': 'public' } }
  });
  // Convert to direct link
  const directLink = sharedLinkRes.result.url.replace('?dl=0', '?raw=1');
  return directLink;
}

module.exports = uploadPdfToDropbox; 