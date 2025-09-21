"use client";

import { AvatarCard } from "@/components/avatar-card";
import { db } from "@/lib/firebase";
import { Agent } from "@/lib/interfaces";
import {
  doc,
  collection,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

function runAgent(id: string) {
  const ref = doc(db, "agents-kira", id);
  updateDoc(ref, {
    is_running: true,
  });
}

function stopAgent(id: string) {
  const ref = doc(db, "agents-kira", id);
  updateDoc(ref, {
    is_running: false,
  });
}

export default function KiraPage() {
  const [agents, setAgents] = useState<Agent[]>([]);

  useEffect(() => {
    const q = query(collection(db, "agents-kira"), orderBy("name", "asc"));
    const unsub = onSnapshot(q, (snapshot) => {
      console.log(snapshot.docs);

      setAgents(snapshot.docs.map((doc) => doc.data() as Agent));
    });
    return () => unsub();
  }, []);

  return (
    <div className="">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bebas">Agentes - Kira</h1>
        <Link href="/config/kira/new" aria-label="Crear Agente">
          <Button variant="outline" size={"sm"}>
            <Plus />
            Crear Agente
          </Button>
        </Link>
      </div>

      <ul className="grid gap-3">
        {agents.length === 0 && (
          <div>
            <Skeleton className="h-28 w-full rounded-xl mb-3" />
            <Skeleton className="h-28 w-full rounded-xl mb-3" />
          </div>
        )}

        {agents.map((agent) => (
          <AvatarCard
            key={agent.id}
            id={agent.id}
            name={agent.name}
            description={agent.description}
            isRunning={agent.is_running}
            onStart={() => runAgent(agent.id)}
            onStop={() => stopAgent(agent.id)}
          />
        ))}
      </ul>
    </div>
  );
}
