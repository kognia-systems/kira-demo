"use client";

import { Vortex } from "@/components/ui/vortex";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TvMinimalPlay } from "lucide-react";

export default function HomePage() {
  return (
    <div className="w-full mx-auto rounded-md  h-screen overflow-hidden">
      <Vortex
        backgroundColor="black"
        className="flex items-center flex-col justify-center px-2 md:px-10 py-4 w-full h-full"
      >
        <Image
          src="/beyond/beyond-dark.png"
          alt="Kognia Systems Logo"
          width={300}
          height={200}
          className="mx-auto mb-4"
        ></Image>
        <h2 className="text-white text-3xl md:text-5xl font-bold font-bebas text-center">
          Kira - Interactive Avatar
        </h2>
        <p className="text-white font-roboto text-sm md:text-lg max-w-xl mt-3 text-center">
          IA en Acción, de promesa a realidad.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-6">
          <Link
            href={"/dashboard"}
          >
            <Button variant="outline" size="lg">
              <TvMinimalPlay/>Demo
            </Button>
          </Link>
        </div>
      </Vortex>
    </div>
  );
}
