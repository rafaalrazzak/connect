import ReportDetail from "./client-page";

export default async function ReportPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Pass the fetched data to the client component
  return <ReportDetail id={id} />;
}
