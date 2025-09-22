"use cliente";

import {
  AvatarQuality,
  ElevenLabsModel,
  StartAvatarRequest,
  STTProvider,
  VoiceChatTransport,
  VoiceEmotion,
} from "@heygen/streaming-avatar";
import { Button } from "./ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { useEffect, useMemo, useState } from "react";
import { doc, getDoc, writeBatch } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Channel } from "@/app/api/interfaces/channel";
import { HeyGenConfigModel } from "@/app/api/interfaces/heygen-config-model";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";

interface AvatarConfigProps {
  onConfigChange: (e: React.FormEvent, config: HeyGenConfigModel) => void;
  config: HeyGenConfigModel;
  isLoading: boolean;
}

export const SettingsForm: React.FC<AvatarConfigProps> = ({
  onConfigChange,
  config,
  isLoading,
}) => {
  const [avatarId, setAvatarId] = useState("f1d6ee4cac7742adaf63c0c18940b27c"); // Default Jeff
  const [voiceId, setVoiceId] = useState("8bae2bae6b184add9a2b72d0f3a563c6"); // Default Jeff
  const [knowledgeBase, setKnowledgeBase] = useState<string>("");
  const [voiceEmotion, setVoiceEmotion] = useState<VoiceEmotion>(
    VoiceEmotion.EXCITED
  );
  const [elevenLabsModel, setElevenLabsModel] = useState<ElevenLabsModel>(
    ElevenLabsModel.eleven_multilingual_v2
  );

  useEffect(() => {
    setAvatarId(config.avatarId);
    setVoiceId(config.voiceId);
    setKnowledgeBase(config.knowledgeBase);
    setVoiceEmotion(config.voiceEmotion);
    setElevenLabsModel(config.elevenlabsModel);
  }, []);

  return (
    <Card className="max-w-3xl mx-auto h-full">
      <form
        onSubmit={(e) => onConfigChange(e, config)}
        className="space-y-4 overflow-auto"
      >
        <CardHeader>
          <CardTitle>Configuración</CardTitle>
          <CardDescription>Ajustes del avatar</CardDescription>
          <CardAction>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-green-500 hover:bg-green-600 text-white"
              size="sm"
            >
              {isLoading ? "Guardando..." : "Guardar"}
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent className="h-full">
          <div className="px-4 space-y-4">
            {/* Avatar */}
            <div className="">
              <Input
                placeholder="Ingrese el avatar ID"
                value={avatarId}
                onChange={(e) => {
                  return setAvatarId(e.target.value);
                }}
                className="mb-0"
              />
            </div>

            {/* Avatar Voice */}
            <div className="space-y-4">
              <Input
                placeholder="Ingrese el ID de la voz"
                value={voiceId}
                onChange={(ev) => {
                  setVoiceId(ev.target.value);
                }}
              />

              {/* ElevenLabs Model - Full Width */}

              <Select
                value={elevenLabsModel}
                onValueChange={(value) => {
                  return setElevenLabsModel(value as ElevenLabsModel);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona un modelo" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(ElevenLabsModel).map((model) => (
                    <SelectItem key={model} value={model}>
                      {model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Voice Emotion */}

              <Select
                value={voiceEmotion}
                onValueChange={(value) =>
                  setVoiceEmotion(value as VoiceEmotion)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona un modelo" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(VoiceEmotion).map((model) => (
                    <SelectItem key={model} value={model}>
                      {model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Knowledge Base - Full Width */}
            <div className="mb-4 space-y-2">
              <Textarea
                className="h-[400px]"
                placeholder="Ingrese un knowledge base ID"
                value={knowledgeBase}
                onChange={(e) => setKnowledgeBase(e.target.value)}
              />
            </div>
          </div>

          {/* Avatar */}
        </CardContent>
      </form>
    </Card>
  );
};
