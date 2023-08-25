import axios from 'axios'

interface internalUploadPublicProps {
  country_id: string
  ticpid_id: string
  dir?: string
  file: File
}

export const internalUploadPublic = async ({
  file,
  country_id,
  ticpid_id,
}: internalUploadPublicProps) => {
  const formData = new FormData()
  formData.append('file', file)

  //   await axios.post(
  //     `http://127.0.0.1:9000/internal/upload/${country_id}/${ticpid_id}`,
  //     formData,
  //     {
  //       headers: {
  //         'Content-Type':
  //           'multipart/form-data; boundary=<calculated when request is sent>',
  //       },
  //     },
  //   )
  fetch(`http://127.0.0.1:9000/internal/upload/${country_id}/${ticpid_id}`, {
    method: 'POST',
    body: formData,
  }).then((res) => res.json())
  return 'OK'
}
