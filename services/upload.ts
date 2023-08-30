import axios from 'axios'

type TinternalUploadPublicProps = {
  country_id: string
  ticpid_id: string
  dir?: string
  formData: any
}

type TpickOnlyInternalProps = Pick<
  TinternalUploadPublicProps,
  'country_id' | 'ticpid_id'
>

type TremoveInternalUploadPublicProps = TpickOnlyInternalProps & {
  file_name: string
}

/** change to Host form env */
const HOSTMAINUPLOADAPI = 'http://127.0.0.1:9000'

export const internalUploadPublicService = async ({
  country_id,
  ticpid_id,
  formData,
}: TinternalUploadPublicProps) => {
  await axios.post(
    `${HOSTMAINUPLOADAPI}/internal/upload/${country_id}/${ticpid_id}`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  )
  return 'OK'
}

export const removeInternalUploadPublicService = async (
  payload: TremoveInternalUploadPublicProps,
) => {
  await axios.delete(
    `${HOSTMAINUPLOADAPI}/internal/public/${payload.country_id}/${payload.ticpid_id}/remove${payload.file_name}`,
  )
  return 'OK'
}
