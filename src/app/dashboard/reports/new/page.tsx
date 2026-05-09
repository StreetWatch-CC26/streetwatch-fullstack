import { AddReportForm } from "@/components/add-report/AddReportForm";

export default function AddReportPage() {
  return (
    <div className="container max-w-4xl mx-auto px-4 py-6 md:py-8">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          Laporkan Kerusakan Jalan
        </h1>
        <p className="text-muted-foreground text-sm md:text-base">
          Bantu kami memperbaiki infrastruktur dengan melaporkan kerusakan jalan
          di sekitar Anda
        </p>
      </div>

      <AddReportForm />
    </div>
  );
}
