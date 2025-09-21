"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, CircleArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

export default function ChannelProvidersPage() {
  const params = useParams();
  const kiraId = params.id;

  const router = useRouter();

  return (
    <div>
      {/* Header */}
      <div className="flex flex-row items-center gap-2 p-2 border-b mb-2">
        <Button
          variant="ghost"
          size="icon"
          className="size-8"
          onClick={() => {
            router.back();
          }}
        >
          <ChevronLeftIcon />
        </Button>
        <h1>Proveedores</h1>
      </div>

      {/* Providers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-2">
        {/* Heygen Provider Card */}
        <div className="rounded-2xl border border-ai-muted/30 bg-card shadow-sm hover:shadow-md transition-shadow p-6 flex flex-col">
          <div className="flex items-center gap-4">
            <Image
              src="/heygen-logo.png"
              width={40}
              height={40}
              alt="HeyGen Logo"
            />
            <div>
              <h2 className="text-xl font-semibold">HeyGen</h2>
              <p className="text-slate-500 text-sm">Interactive Avatar</p>
            </div>
          </div>
          <p className="text-white text-sm my-4 flex-grow">
            Crea avatares interactivos personalizados con la plataforma de
            Heygen.
          </p>
          <Link
            href={`/dashboard/kira/${kiraId}/channels/providers/heygen`}
            className="mt-auto w-full flex items-center justify-center gap-1 px-3 py-2 rounded-lg bg-blue-500/20 text-white hover:bg-blue-500/30 transition"
          >
            {/* <Gear size={18} weight="fill" /> */}
            Configurar
          </Link>
        </div>
        {/* Akool Provider Card */}
        {/* Tavus */}
        {/* Hedra Provider Card */}
      </div>
    </div>
  );
}
