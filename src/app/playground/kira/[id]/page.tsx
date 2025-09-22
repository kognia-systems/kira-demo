"use client";

import Image from "next/image";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import ReasoningView from "@/components/reasoning-view";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { InteractiveAvatarSDK } from "@/components/interactive-avatar-sdk";
import { useEffect, useRef, useState } from "react";
import {
  AvatarQuality,
  ElevenLabsModel,
  StartAvatarRequest,
  STTProvider,
  VoiceChatTransport,
  VoiceEmotion,
} from "@heygen/streaming-avatar";
import { MessageHistory } from "@/components/message-history";
import { SettingsForm } from "@/components/settings-form";
import { HeyGenConfigModel } from "@/app/api/interfaces/heygen-config-model";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Channel } from "@/app/api/interfaces/channel";
import { toast } from "sonner";
import { useParams } from "next/navigation";

// Base de datos mock de transacciones para KIRA
const transactionDatabase = [
  {
    id: "txn_05",
    fecha_hora: "2025-08-24T14:00:00+02:00",
    monto: 120,
    concepto: "Compra de ropa",
    comercio: "Zara",
    ciudad: "Madrid",
    pais: "España",
    moneda: "EUR",
    metodo_pago: "Tarjeta de Crédito",
  },
  {
    id: "txn_04",
    fecha_hora: "2025-08-24T12:30:00+02:00",
    monto: 76,
    concepto: "Compra en línea",
    comercio: "Amazon ES",
    ciudad: "Madrid",
    pais: "España",
    moneda: "EUR",
    metodo_pago: "Tarjeta de Crédito",
  },
  {
    id: "txn_03",
    fecha_hora: "2025-08-24T11:15:00+02:00",
    monto: 7,
    concepto: "Café y desayuno",
    comercio: "Cafetería La Buena Taza",
    ciudad: "Madrid",
    pais: "España",
    moneda: "EUR",
    metodo_pago: "Tarjeta de Débito",
  },
  {
    id: "txn_02",
    fecha_hora: "2025-08-23T18:45:00+02:00",
    monto: 45,
    concepto: "Supermercado",
    comercio: "Mercadona",
    ciudad: "Madrid",
    pais: "España",
    moneda: "EUR",
    metodo_pago: "Tarjeta de Débito",
  },
  {
    id: "txn_01",
    fecha_hora: "2025-08-23T15:20:00+02:00",
    monto: 15,
    concepto: "Transporte",
    comercio: "Metro de Madrid",
    ciudad: "Madrid",
    pais: "España",
    moneda: "EUR",
    metodo_pago: "Abono Transporte",
  },
];

const DEFAULT_CONFIG: StartAvatarRequest = {
  quality: AvatarQuality.Low,
  avatarName: "f1d6ee4cac7742adaf63c0c18940b27c",
  knowledgeBase: `
Eres Kira, un agente de atención al cliente (Alan CX), empático y resolutivo. 
Estás atendiendo a un cliente que podría estar reportando un cargo fraudulento. 
Tu objetivo es:
- Saludar cordialmente y preguntar el nombre del cliente antes de continuar.
- Preguntar el motivo de su llamada o contacto.
- Escuchar activamente.
- Confirmar la transacción.
- Consultar fuentes internas (geolocalización, políticas antifraude, CRM, logs de notificación).
- Explicar con claridad y sin tecnicismos excesivos.
- Ejecutar acciones para revertir el cargo y reforzar la seguridad de la cuenta.
- Mantener siempre un tono calmado, profesional y empático.

Guía de conversación:
1. **Saludo inicial + solicitud de nombre + motivo de contacto**
   - Saluda de forma amable.
   - Pregunta cómo se llama el cliente.
   - Después de que diga su nombre, pregúntale de forma abierta el motivo de su llamada o mensaje.
   - Usa su nombre en el resto de la conversación para mantener cercanía. 
3. **Confirmación de fraude + explicación técnica simple**  
   - Revisa la geolocalización de los últimos accesos y explica la coincidencia de IP.  
   - Reconoce la molestia del cliente y valida su frustración.  
   - Explica por qué el sistema no bloqueó la transacción.

4. **Propuesta de refuerzo preventivo**  
   - Ofrece configurar límites y verificaciones adicionales en compras mayores a 50 €.
   - Explica los cambios de seguridad aplicados.

5. **Acción inmediata**  
   - Lanza el workflow de reversión preventiva del cargo.  
   - Bloquea la tarjeta y emite una nueva digital y física.  
   - Informa sobre tiempos de entrega.

6. **Mejora de notificaciones**  
   - Verifica por qué no se recibió la alerta inicial.  
   - Cambia el canal primario a WhatsApp para alertas en tiempo real.

7. **Cierre con refuerzo de seguridad**  
   - Activa biometría y restricciones de compras fuera de la ciudad.  
   - Informa sobre alertas de actividad inusual.  
   - Cierra agradeciendo la confianza y asegurando seguimiento.

Tono: cercano, seguro, claro y enfocado en la solución.

Formato de Respuesta:
- Siempre responde en texto narrativo natural, como si hablaras con el cliente.
- No uses listas, viñetas, numeración ni formato técnico.
- Las transacciones deben describirse en frases completas, ejemplo: 
  "El 24 de agosto de 2025 a las 14:00 se realizó una compra de ropa en Zara, en Madrid, por un monto de 120 euros, pagados con tarjeta de crédito."

**Base de Datos de Transacciones:**
  - A continuación se presenta una base de datos interna de transacciones.
  - PARA CUALQUIER PREGUNTA SOBRE MOVIMIENTOS O TRANSACCIONES, USA ÚNICA Y EXCLUSIVAMENTE LOS DATOS DE ESTA LISTA. No inventes información.
  - Si te piden ordenar, hazlo por 'fecha_hora'. La más reciente es la primera.
  - Los montos son números enteros.

  **Datos:**
  ${JSON.stringify(transactionDatabase, null, 2)}
`,
  voice: {
    rate: 1,
    voiceId: "8bae2bae6b184add9a2b72d0f3a563c6",
    emotion: VoiceEmotion.EXCITED,
    model: ElevenLabsModel.eleven_flash_v2_5,
  },
  language: "es",
  voiceChatTransport: VoiceChatTransport.WEBSOCKET,
  sttSettings: {
    provider: STTProvider.DEEPGRAM,
  },
};

export default function PlaygroundPage() {
  const params = useParams();
  const avatarId = params.id as string;

  const [heygenConfigId, setHeygenConfigId] = useState("8gdjlezBB59RW4yqGqwI");
  const [isLoading, setLoading] = useState(false);

  const [config, setConfig] = useState<StartAvatarRequest>(DEFAULT_CONFIG);
  const [heygenConfig, setHeygenConfig] = useState<HeyGenConfigModel>();

  // Load Avatar
  async function fetchChannelByAvatarId(id: string): Promise<Channel> {
    try {
      const channelRef = collection(db, "channels");
      const docSnap = await getDocs(
        query(channelRef, where("agentId", "==", avatarId))
      );

      if (!docSnap.empty) {
        const channel = docSnap.docs[0].data() as Channel;
        return channel;
      } else {
        throw new Error("Configuración no encontrada");
      }
    } catch (error) {
      console.error("Error obteniendo el channel: ", error);
      throw error;
    }
  }

  async function fetchHeygenConfigById(id: string): Promise<HeyGenConfigModel> {
    try {
      const docRef = doc(db, "heygen-configs", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return docSnap.data() as HeyGenConfigModel;
      } else {
        throw new Error("Documento no encontrado");
      }
    } catch (error) {
      console.error("Error obteniendo config: ", error);
      throw error;
    }
  }

  const onUpdate = async (e: React.FormEvent, config: HeyGenConfigModel) => {
    e.preventDefault();
    setLoading(true);
    
    try {
 
      // 1. documento en heygen-configs
      const heygenRef = doc(db, "heygen-configs", heygenConfigId);

      console.log(heygenConfigId);
      console.log(config);
      

      await updateDoc(heygenRef, {
        avatarId: config.avatarId,
        knowledgeBase: config.knowledgeBase,
        voiceId: config.voiceId,
        voiceEmotion: config.voiceEmotion,
        elevenlabsModel: config.elevenlabsModel,
      });
      
      setConfig({
        quality: AvatarQuality.High,
        avatarName: config.avatarId,
        useSilencePrompt: true,
        knowledgeBase: config.knowledgeBase,
        voice: {
          voiceId: config.voiceId,
          rate: 1,
          emotion: config.voiceEmotion,
          model: config.elevenlabsModel,
        },
        language: "es",
        voiceChatTransport: VoiceChatTransport.WEBSOCKET,
        sttSettings: {
          provider: STTProvider.DEEPGRAM,
        },
      });
      
      toast.success("Configuración guardada!", {
        description: "La configuración se guardó correctamente!",
        className: "bg-green-500 text-white",
      });
    } catch (err) {
      console.log(err);
      toast.error("Error", {
        description: "La configuración no se pudo guardar",
        className: "bg-red-500 text-white",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function loadData() {
      try {
        const channel = await fetchChannelByAvatarId(avatarId);
        setHeygenConfigId(channel.configId);

        const conf = await fetchHeygenConfigById(channel.configId);
        setHeygenConfig(conf);

        setConfig({
          quality: AvatarQuality.Low,
          avatarName: conf.avatarId,
          knowledgeBase: `${conf.knowledgeBase} ${JSON.stringify(
            transactionDatabase,
            null,
            2
          )}`,
          voice: {
            rate: 1,
            voiceId: conf.voiceId,
            emotion: conf.voiceEmotion,
            model: conf.elevenlabsModel,
          },
          language: "es",
          voiceChatTransport: conf.voiceChatTransport,
          sttSettings: {
            provider: conf.sttProvider,
          },
        });
        toast.success("Informacion cargada");
      } catch (err) {
        toast.error("No se pudo cargar la informacion");
      }
    }
    if(avatarId) loadData();
  }, []);

  return (
    <div className="h-screen flex bg-dark-blue">
      <div className="flex-shrink-0 h-full">
        {/* Marco del teléfono */}
        <div
          className="h-full bg-card rounded-[50px] mx-4 my-4 p-3"
          style={{
            aspectRatio: "9/16",
            maxHeight: "calc(100vh - 2rem)",
          }}
        >
          {/* Pantalla del teléfono */}
          <div className="h-full bg-black rounded-[40px] overflow-hidden relative">
            {/* Avatar */}
            <InteractiveAvatarSDK config={config} />

            {/* Notch o cámara frontal simulada */}
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-40 h-8 bg-card rounded-2xl z-20 flex items-center justify-end">
              <div className="w-4 h-4 mr-2 bg-black rounded-full"></div>
            </div>
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
                    <TabsTrigger value="settings">Settings</TabsTrigger>
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
                    <div className="h-full w-full border rounded-lg p-4 bg-black/10">
                      <MessageHistory />
                    </div>
                  </TabsContent>

                  <TabsContent
                    value="settings"
                    className="h-full w-full m-0 p-0"
                    style={{ height: "100%" }}
                  >
                    <div className="h-full w-full border rounded-lg p-4 bg-muted dark:bg-card">
                      <SettingsForm
                        config={heygenConfig!}
                        onConfigChange={onUpdate}
                        isLoading={isLoading}
                      />
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
