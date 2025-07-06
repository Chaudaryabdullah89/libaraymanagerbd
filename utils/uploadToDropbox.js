const { Dropbox } = require('dropbox');
const fetch = require('node-fetch'); // Required for Dropbox SDK

const DROPBOX_ACCESS_TOKEN = 'sl.u.AF1PsWhPgBU15Bb461LLtIuT-k4PsI9N70TT3GGY75iy7WbEEFSYN1dkXaFyEiMmmdS4ZKN0yRv3BlRX-v0_0Vk45z-JnInegddKw14Tjsd3WMcu02OUg4OkdMMxMDPU2w2y35fJthxTSODdVIHXoSb7Tc6zc2aa0J4KD-2fQ4JZABuvGMY2dY7dmIoYGMUQiDzyzXrXC1qDsvZC12zOlMd9Udq-LrXa4CpvT4HqXHt9d2EDH1y8rHz62LI9ghxjecL-EtIOu5jGlXBUy7MNBIu10L8U4qacZY0vnnIWr0GfIcEjUsaZ7ZnZ5W5P1w5AljEvNf5pwCgyvFN_UpDdiaH6UZnT0oPu-8cPYXVwv5jyWzkB6kIvLt1yP12PJLfBlvTyynPeYDlGnnlnOKSQW0ji7EDyN_0LdvoUde2OAvsvq5wr0_uAQvAnUIS-Ni5Wyv-Hs5YiDrmJuNS7vnr9JI5KNhEKGv74J63LlDITqJ2AA4GpOczyJ6D86zQMCL-6TMH2qPb7F1Dw7k_bIu19XQoTLotkLuZjIwxpPaDkOUAGjUyzm3kNY98RnY-VkAWJ1PVyVGdAavf69rQU75u6sv2b4Ec010OkzneG4iG2dZysVQ-iIxSns7BqrEhgUcpQ_mUFK_8eDVcjmf33lOX5L3nsc9Jza2y0aBjoItBIm4Yqx80Qsssqk0nCV0g_t_JmOcDxyMwJx_wex8NPv56Watp5gsJVDuS3UURSf1WRjVIwRckMSZC_58t9ZVdFkvqt3K_CKza5sNIX3sKN2dfcuDZoG2nrqWpnFAOPVFaOEN98iAkSMUWri-AhU7eMFHDRPUkwFMGUF8Z0lq6tPs2foFuxwHUxohflutr08sbd90MDPYrtQAZgkHEelKQ86BrJQYnMBpi0vlXsetRNZKc7xcqzZu1e48hovu7aaB8UugbcONYRmX4CvkLxueMGVtuKl-7qVIBMQHms61C5_xO1klOtMZdH3ztASrasaVmJXvg1ZYuFhPDs6U5oMITZPt5750DM2R-mT5_eAtxqrmJEjcV78L4uIVfLPrMW9-u2rNVfS2TA14CLMyCAbOqsam5_s_FtFUpdfJ8-ibPyTrkcYWf0z_Knt-mYIoWRWoqjo5dHSJfY_68LpCknO__zC9fmtvG8KA7Le-UmpSAeius_YBSc4l2pvkDVe-0-TAwwoBxg9r-N09N6CHYGYusEnhmZ9KC52CuT_SAZ1ZcNcqgmeUFTixgodDER2zG76-ZgKdHSF5847A-pDtI3uByTEP1xxfIPuANJ24SbtidFLqbEa6bnbnwfaIU_mI-gK1DxIOmHCAQU6BTZNZSg_YmsW50idfjgKUgl-YEaY885wjtLy0mmjXBUXL2p1yma_9CzKDzwa2ekO6IblMdd2SkRja8V3ns-4TdjGSvaQkbtngDCNcePK_NVMOc3xB7nn3ws0_iK_Tb8r3nusBwIJefuddlZcdo'
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