import Report from '@/components/page/report'
import { memo, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { TfieldInternationdata } from '@/interface/international_relations_datas.interface';
import { getByInternationalDatasService } from '@/services/internationalRelationsDatas';

const ReportPage = () => {
  const [items, setitems] = useState<TfieldInternationdata[]>([])
  const router = useRouter();

  useEffect(() => {
    const { items }: any = router.query;
    if (items) {
      const uuidStrings = items.split(',');
      const uuidArray = uuidStrings.map((uuid_str: string) => uuid_str);
      getData(uuidArray)
    }
  }, [router.query.items])

  const getData = async (id: string[]) => {
    try {
      const promise_all: any[] = [];
      id.forEach(data => {
        promise_all.push(getByInternationalDatasService(data));
      });
      const values = await Promise.all(promise_all);
      const res: any = [];
      values.forEach(data => {
        res.push(data.data)
      });
      setitems(res)
    } catch (error) {
      console.log('error :>> ', error);
    }
  }


  return (
    <Report items={items} />
  )
}

export default memo(ReportPage)