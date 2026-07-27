import { CriterioScreen } from "../../../../../components/cierre/CriterioScreen";

export default async function CriterioPage({ params }: { params: Promise<{ fileId: string }> }) {
  const { fileId } = await params;
  return <CriterioScreen fileId={fileId} />;
}
