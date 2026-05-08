import Navbar from "@/components/Navbar";
import Chatbot from "@/components/Chatbot";
import CompareWidget from "@/components/CompareWidget";
import RecommendationModal from "@/components/RecommendationModal";
import Footer from "@/components/Footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f8f6f1] flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <CompareWidget />
      <RecommendationModal />
      <Chatbot />
    </div>
  );
}

