import { Getcookies } from '@/actions/cookie';
import UserHeader from '@/components/userheader';
import { USER_GET } from '@/app/api/route';



export default async function PerfilLayout({
  children,
}: {children: React.ReactNode}) {

  const token = await Getcookies('token');
  const user = await USER_GET(token.value);


  return (
    <>
      <UserHeader user={user} />
      {children}
    </>
  );
}
