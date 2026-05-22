import { AddReportForm } from "@/components/add-report/AddReportForm";

export default function AddReportPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:py-8">
      <div className="flex flex-col items-center sm:items-start mb-6 md:mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
          Laporkan Kerusakan Jalan
        </h1>

        <p className="text-muted-foreground text-sm md:text-base text-center sm:text-left ">
          Bantu kami memperbaiki infrastruktur dengan melaporkan kerusakan jalan
          di sekitar Anda
        </p>
      </div>

      <div className="w-full px-5 sm:px-0">
        <AddReportForm />
      </div>
    </div>
  );
}
