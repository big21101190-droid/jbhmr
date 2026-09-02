import type { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import { LandingView } from '@/components/landing-view';
import { getLandingBySlug, listLandings } from '@/lib/landing-store';
import { getLandingMetadata } from '@/lib/seo';

export const dynamic='force-dynamic';
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const landing=await getLandingBySlug((await params).slug,true);if(!landing||landing.status!=='PUBLISHED')return{title:'페이지를 찾을 수 없습니다',robots:{index:false,follow:false}};return getLandingMetadata(landing)}
export default async function DeliveryPage({params}:{params:Promise<{slug:string}>}){const landing=await getLandingBySlug((await params).slug,true);if(!landing)notFound();if(landing.status==='ARCHIVED'){if(landing.redirectTo)permanentRedirect(landing.redirectTo);notFound()}if(landing.status!=='PUBLISHED')notFound();const all=await listLandings({publishedOnly:true});const related=all.filter(item=>item.id!==landing.id&&(item.regionId===landing.regionId||item.serviceId===landing.serviceId)).slice(0,6);return <LandingView landing={landing} related={related}/>}
