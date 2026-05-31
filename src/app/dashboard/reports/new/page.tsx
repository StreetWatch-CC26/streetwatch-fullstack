import { AddReportForm } from "@/components/add-report/AddReportForm";

export default function AddReportPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:py-8">
      <div className="flex flex-col items-center sm:items-start mb-5 sm:mb-7">
        <h1 className="text-2xl sm:text-4xl font-bold text-foreground mb-2">
          Laporkan Kerusakan Jalan
        </h1>

        <p className="sr-only sm:not-sr-only text-muted-foreground text-sm md:text-base text-center sm:text-left ">
          Bantu kami memperbaiki infrastruktur dengan melaporkan kerusakan jalan
          di sekitar Anda
        </p>
      </div>

      <div className="w-full">
        <AddReportForm />
      </div>
    </div>
  );
}
