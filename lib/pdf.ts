import { toPng } from "html-to-image";
import { jsPDF } from "jspdf";

interface ExportOptions {
  /** Nome do arquivo, sem a extensão. */
  nome: string;
  /** Escala de renderização — 2 dá nitidez suficiente sem estourar a memória. */
  escala?: number;
}

/**
 * Exporta um nó do DOM para PDF A4 retrato, no próprio navegador.
 * Conteúdos altos são fatiados em páginas sucessivas; nada é enviado
 * a servidores.
 */
export async function exportarNoParaPdf(
  no: HTMLElement,
  { nome, escala = 2 }: ExportOptions,
) {
  const fundo = getComputedStyle(document.documentElement)
    .getPropertyValue("--surface")
    .trim();

  const dataUrl = await toPng(no, {
    pixelRatio: escala,
    cacheBust: true,
    backgroundColor: fundo || "#ffffff",
  });

  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const larguraPagina = pdf.internal.pageSize.getWidth();
  const alturaPagina = pdf.internal.pageSize.getHeight();
  const margem = 10;
  const larguraUtil = larguraPagina - margem * 2;

  const imagem = new Image();
  imagem.src = dataUrl;
  await new Promise<void>((resolve, reject) => {
    imagem.onload = () => resolve();
    imagem.onerror = () => reject(new Error("Falha ao renderizar a imagem"));
  });

  const alturaTotal = (imagem.height * larguraUtil) / imagem.width;
  const alturaUtil = alturaPagina - margem * 2;

  let restante = alturaTotal;
  let deslocamento = 0;

  while (restante > 0) {
    pdf.addImage(
      dataUrl,
      "PNG",
      margem,
      margem - deslocamento,
      larguraUtil,
      alturaTotal,
    );
    restante -= alturaUtil;
    deslocamento += alturaUtil;
    if (restante > 0) pdf.addPage();
  }

  pdf.save(`${nome}.pdf`);
}
