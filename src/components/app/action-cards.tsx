import { CardIcon } from "@/components/ui/card-icon";
import { useReportDrawer } from "@/contexts/report-drawer-context";
import { FileEdit, MapPin, NotebookText } from "lucide-react";

export function ActionCards() {
  const { openDrawer } = useReportDrawer();

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-4">
        <CardIcon
          icon={<FileEdit className="w-5 h-5" />}
          label="Laporkan"
          description="Buat laporan baru"
          onClick={() => openDrawer()}
          iconContainerClassName="bg-primary/10 text-primary"
        />

        <CardIcon
          icon={<MapPin className="w-5 h-5" />}
          label="Peta"
          description="Lihat laporan di sekitar"
          asLink
          href="/map"
          iconContainerClassName="bg-primary/10 text-primary group-hover:bg-primary/15"
          className="group"
        />
      </div>
      <CardIcon
        icon={<NotebookText className="w-5 h-5" />}
        label="Laporan"
        description="Lihat laporan di sekitar"
        asLink
        href="/reports"
        iconContainerClassName="bg-primary/10 text-primary group-hover:bg-primary/15"
        className="group"
      />
    </div>
  );
}
