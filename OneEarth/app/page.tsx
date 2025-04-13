import ReportForm from "@/components/report-form"

export default function Home() {
  return (
    <div className="py-6 space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-emerald-800">One Earth</h1>
        <p className="text-gray-600">Our EARTH, Our Responsibility</p>
      </div>

      <ReportForm />
    </div>
  )
}
