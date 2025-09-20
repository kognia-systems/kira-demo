"use client";

import Image from "next/image";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { BackgroundGradient } from "@/components/ui/background-gradient";

export default function PlaygroundPage() {
  return (
    <div className="h-screen flex bg-dark-blue">
      <div className="flex-shrink-0 h-full">
        {/* Marco del teléfono - Fondo oscuro */}
        <div
          className="h-full bg-card rounded-[50px] mx-4 my-4 p-3"
          style={{
            aspectRatio: "9/16",
            maxHeight: "calc(100vh - 2rem)",
          }}
        >
          {/* Pantalla del teléfono - Aquí irá el video */}
          <div className="h-full bg-black rounded-[40px] overflow-hidden relative">
            {/* Avatar video */}

            {/* Notch o cámara frontal simulada */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-8 bg-dark rounded-2xl z-20"></div>
          </div>
        </div>
      </div>

      {/* Contenedor derecho - Resto de la pantalla */}
      <div className="flex-1 h-full p-6">
        {/* Panel de controles */}
        <div className="h-full flex flex-col">
          <div className="flex flex-row justify-between">
            <h1 className="text-3xl font-bold mb-3 text-white">
              Kira - Avatar Interactivo
            </h1>
            <div className="p-2 mb-3">
              <Image
                src="/beyond/beyond-dark.png"
                width={130}
                height={30}
                alt="HeyGen Logo"
              />
            </div>
          </div>
          {/* Área de contenido del panel derecho - CAMBIO AQUÍ: agregué min-h-0 */}
          <Card className="flex flex-1 min-h-0 p-2">
            <CardContent className="p-0">
              <Tabs defaultValue="reasoning" className="w-full p-2">
                <TabsList>
                  <TabsTrigger value="reasoning">Reasoning</TabsTrigger>
                  <TabsTrigger value="chat">History Chat</TabsTrigger>
                  <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
                </TabsList>
                <Separator className="mt-2" />
                <TabsContent value="reasoning">Reasoning Content.</TabsContent>
                <TabsContent value="chat">History Chat.</TabsContent>
                <TabsContent value="sentiment">Sentiment Score.</TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
