"use client";

import * as React from "react";
import { ArrowClockwise } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { StatusDot } from "@/components/ui/badge";

/**
 * Botão de nova tentativa da página offline.
 * Acompanha os eventos `online`/`offline` para mostrar o estado real da
 * conexão em vez de deixar a pessoa adivinhando.
 */
export function RetryButton() {
  const [online, setOnline] = React.useState(true);

  React.useEffect(() => {
    const atualizar = () => setOnline(navigator.onLine);
    atualizar();

    window.addEventListener("online", atualizar);
    window.addEventListener("offline", atualizar);
    return () => {
      window.removeEventListener("online", atualizar);
      window.removeEventListener("offline", atualizar);
    };
  }, []);

  return (
    <div className="mt-10 flex flex-wrap items-center gap-4">
      <Button size="lg" onClick={() => window.location.reload()}>
        <ArrowClockwise weight="bold" />
        Tentar novamente
      </Button>

      <StatusDot
        tone={online ? "good" : "critical"}
        label={online ? "Conexão restabelecida" : "Ainda sem conexão"}
        pulse={!online}
      />
    </div>
  );
}
