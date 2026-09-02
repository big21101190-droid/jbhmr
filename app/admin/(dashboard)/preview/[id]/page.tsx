import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LandingView } from '@/components/landing-view';
import { getLandingById } from '@/lib/landing-store';
export const metadata:Metadata={title:'랜딩 미리보기',robots:{index:false,follow:false}};
export default async function PreviewPage({params}:{params:Promise<{id:string}>}){const landing=await getLandingById((await params).id);if(!landing)notFound();return <LandingView landing={landing} preview/>}
