import { notFound } from 'next/navigation';
import { LandingEditor } from '@/components/landing-editor';
import { getLandingById } from '@/lib/landing-store';
export default async function EditLandingPage({params}:{params:Promise<{id:string}>}){const landing=await getLandingById((await params).id);if(!landing)notFound();return <LandingEditor initial={landing}/>}
