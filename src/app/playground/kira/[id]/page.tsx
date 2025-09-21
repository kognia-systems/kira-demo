"use client";

import Image from "next/image";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { BackgroundGradient } from "@/components/ui/background-gradient";
import ReasoningView from "@/components/reasoning-view";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

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
            <h1 className="text-3xl font-bold font-bebas mb-3">
              Kira - Avatar Interactivo
            </h1>
            <div className="p-2 mb-3">
              <Image
                src="/beyond/beyond-dark.png"
                width={130}
                height={30}
                className="hidden dark:block"
                alt="HeyGen Logo"
              />
              <Image
                src="/beyond/beyond-light.png"
                width={130}
                height={30}
                className="dark:hidden"
                alt="HeyGen Logo"
              />
            </div>
          </div>
          {/* Área de contenido del panel derecho */}
          <Card className="flex-1 min-h-0 p-2 flex">
            <CardContent className="p-0 flex-1 flex flex-col min-h-0">
              <Tabs
                defaultValue="reasoning"
                className="flex-1 flex flex-col min-h-0"
              >
                <div className="flex-shrink-0">
                  <TabsList>
                    <TabsTrigger value="reasoning">
                      Reasoning Events
                    </TabsTrigger>
                    <TabsTrigger value="chat">History Chat</TabsTrigger>
                    <TabsTrigger value="sentiment">Settings</TabsTrigger>
                  </TabsList>
                  <Separator className="my-2" />
                </div>
                <div className="flex-1 min-h-0">
                  <TabsContent
                    value="reasoning"
                    className="h-full w-full m-0 p-0"
                    style={{ height: "100%" }}
                  >
                    <div className="h-full w-full border rounded-lg">
                      <ResizablePanelGroup direction="horizontal">
                        <ResizablePanel defaultSize={70}>
                          <ReasoningView />
                        </ResizablePanel>
                        <ResizableHandle withHandle />
                        <ResizablePanel defaultSize={30} minSize={30}>
                          <div className="bg-secondary h-full flex items-center justify-center">
                            Events Here
                          </div>
                        </ResizablePanel>
                      </ResizablePanelGroup>
                    </div>
                  </TabsContent>
                  <TabsContent
                    value="chat"
                    className="h-full w-full m-0 p-0"
                    style={{ height: "100%" }}
                  >
                    <div className="h-full w-full bg-amber-500 border rounded-lg">
                      {/* Tu contenido aquí */}
                    </div>
                  </TabsContent>
                  <TabsContent
                    value="sentiment"
                    className="h-full w-full m-0 p-0"
                    style={{ height: "100%" }}
                  >
                    <div className="h-full w-full bg-green-500 border rounded-lg">
                      Sentiment Score.
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
