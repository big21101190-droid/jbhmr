import type { Metadata } from 'next';
import { AdminLogin } from '@/components/admin-login';
export const metadata:Metadata={title:'관리자 로그인',robots:{index:false,follow:false}};
export default function AdminLoginPage(){return <AdminLogin/>}
