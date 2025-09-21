"use client";

import { Play, Square, Settings2, FlaskConical } from "lucide-react";
import Link from "next/link";
import { Card } from "./ui/card";
import { Button } from "./ui/button";

interface AvatarCardProps {
  id: string;
  name: string;
  description: string;
  isRunning: boolean;
  onStart: () => void;
  onStop: () => void;
}

export function AvatarCard({
  id,
  name,
  description,
  isRunning,
  onStart,
  onStop,
}: AvatarCardProps) {
  return (
    <li className="flex flex-col gap-3">
      <Card className="p-4">
        <div>
          <h3 className="font-semibold text-ai-primary">{name}</h3>
          <p className="text-sm text-slate-400">{description}</p>
        </div>

        <div className="flex gap-2">
          {isRunning ? (
            <Button variant="destructive" size="sm" onClick={onStop}>
              <Square /> Stop
            </Button>
          ) : (
            <Button
              className="bg-green-500 hover:bg-green-700 text-white"
              size="sm"
              onClick={onStart}
              >
              <Play /> Run
            </Button>
          )}

          <Link href={`/dashboard/kira/${id}`}>
            <Button 
            className="bg-blue-500 hover:bg-blue-700 text-white"
            variant="secondary" size="sm">
              <Settings2 /> Configuración
            </Button>
          </Link>
          <Link href={`/playground/kira/${id}`}>
            <Button variant="secondary" size="sm">
              <FlaskConical /> Playground
            </Button>
          </Link>
        </div>
      </Card>
    </li>
  );
}
