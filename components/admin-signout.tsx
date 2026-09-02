'use client';
import { logout } from '@netlify/identity';
export function AdminSignout(){return <button onClick={async()=>{await logout();window.location.href='/admin/login'}} className="text-sm font-bold text-white/65 hover:text-white">로그아웃</button>}
