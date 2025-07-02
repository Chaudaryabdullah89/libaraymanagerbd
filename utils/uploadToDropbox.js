const { Dropbox } = require('dropbox');
const fetch = require('node-fetch'); // Required for Dropbox SDK

const DROPBOX_ACCESS_TOKEN = 'sl.u.AF1CiKkV2iKlUY7voBiQK5lN85oVpxUT74cQ67Lw5KiNAC7B35YRU621OWQXtBbytvQrdPC7jCHrNlbZYzfWAOtKB_2Fz8XnwN6PgvVaguqIfEUcfmq0OzGUosGVNzj9FRFNOkhcjFuE9M8RadVDy87ZZz2HPFykJYUyjqizye18cmaIWbbqOe6WWzQmXy2OAWbUYyov2Mjb1t_syMqnSeqZTpkxXc3RVdxLYDRJ4dpuaOgsWc8Mxob7n_6GPY3KS5wriox6PiscmKztOjpwH4WKBfmMfystUrbRG5dRJ0ywT4qdEMBxGDZLkL-7XHD7Yc191-DIFM4n3MEyhAcO0XGUlUMrHnu49B_7EdWi8Kwl_q4n8ShxoYoe_nOL_sicxTovIw9hEQMjsByUmfUVhFYHUiVvwtmtJQyB5ZhVBZBMWVRt2JEc0jdYL8pvNxY1hWULhq7mJJzC0WcL9IuQIl8uU2agFYfoD_ZMRKSq9AJpO3VebGjaPuRmHkOOc5TcKdCqXS_Ug2W2o3td5WAk3WbMBF8R0Ikg1z2wfQMz4rhVjnutpL6FHpKpWc5sylDU_hj7u0-MFXNjmeI-m-NF3pxyx7wHFlO67xAfRPExDmR-mQsbn4KD4j6rZ-dsV2dcS5U9qcaevs4MLQiJGTieCwMVujSaYfKPbIc5m46eyAvBb4MzHtMulTIF_AUFnwjxNloPeRXmjTHk-sY5UEEv0zDKR3I_4yJGzuaDRxCp6ngs97DGLdqbRiqs23w_ze4PQuifDuzApmrU8e0iWQlQdMLiaI0UVD2HIp7ss8TFG86D2_hm7j8wmks2-wZjm4HJ48yIRoe2bVMYbM4CXt889-CxMHAKRQlwNTu6XZN7gWLokFaWfBfJG8XvzRHhZtNW2swpdkwHCosdeNLt7S1x1LLWpLrqIrgzkhsTI2bVrS9ngRhJYxfpDuYJ7AxFj6Mn15bmfR_Q3z92e2PLD7zpid-W-ntYDgEqUuuRv5pgx9cjFGxS3Sk73Ir0TWLpIlS7dfype_rqpE_DHCOIIzpfAzKQYIDYawZOgeHsRxoFHaSfb5rGmLCVJhf14pxM1JZn1S4ixOXDeat42qH6lztLtS7J5sSDlve_DvHcP87T7X5ZlEwr8FkSOopykfV1lZcdRO8M8X5dC6zX_LL5HUNUrIYgBssD774Yon-BJ3IuED2TnH4nUS9z07dSJKAx0lmicdmn5VB6WgPS5bsw4hmh8YOFS5Ulqk_DHAnSvkmXTiYERuCQ4NL7n37pXNkxFyt3QbPmIxLw3cvcGxxNAMvXbhfD2KxLFpeCgyaG9dVP-Al6HAxjaXMhFDE7yIdb5g8i9Cri6a-L03x5KCZu8Uh4VFietqkuIYK-hwHmNEUf7qHiiQxkjs3T9RknmkP6lfmV1oV_vS_OeGveqGXV_fLPdpyyE5JSjxRZXMLZdAUczNPHd4cssLbpKVQlxYJsvZhxVf8'; // Replace with your generated access token

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