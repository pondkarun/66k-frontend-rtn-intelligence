import axios from 'axios'

export enum ETinternalUploadPublic {
  DOCS = 'docs',
  IMG = 'img',
}

type TinternalUploadPublicProps = {
  country_id: string
  ticpid_id: string
  dir?: ETinternalUploadPublic
  formData: any
}

type TpickOnlyInternalProps = Pick<
  TinternalUploadPublicProps,
  'country_id' | 'ticpid_id' | 'dir'
>

type TremoveInternalUploadPublicProps = TpickOnlyInternalProps & {
  file_name: string
}

/** change to Host form env */
// const HOSTMAINUPLOADAPI = 'http://127.0.0.1:9000'
const HOSTMAINUPLOADAPI = process.env.NEXT_PUBLIC_UPLOAD

export const internalUploadPublicService = async ({
  country_id,
  ticpid_id,
  formData,
  dir,
}: TinternalUploadPublicProps) => {
  await axios.post(
    `${HOSTMAINUPLOADAPI}/internal/upload/${country_id}/${ticpid_id}?dir=${dir || ''}`,
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
    `${HOSTMAINUPLOADAPI}/internal/public/${payload.country_id}/${payload.ticpid_id}/remove?file_name=${payload.file_name}&dir=${payload.dir || ''}`,
  )
  return 'OK'
}

export const getInternalFilePublicService = async (
  country_id: string,
  ticpid_id: string,
  dir?: ETinternalUploadPublic,
) => {
  const response = await axios.get<{ data: string[] }>(
    `${HOSTMAINUPLOADAPI}/internal/public/${country_id}/${ticpid_id}?dir=${dir || ''}`,
  )
  return response.data
}
