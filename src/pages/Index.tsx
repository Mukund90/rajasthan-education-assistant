import { useState } from "react";
import { NavCategory } from "@/lib/types";
import { AppLayout } from "@/components/layout/AppLayout";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { CollegeList } from "@/components/colleges/CollegeList";
import { CollegeRecommender } from "@/components/colleges/CollegeRecommender";
import { ScholarshipList } from "@/components/scholarships/ScholarshipList";
import { AdmissionsInfo } from "@/components/admissions/AdmissionsInfo";
import { CollegePredictor } from "@/components/predictor/CollegePredictor";
import { ContactForm } from "@/components/contact/ContactForm";
import { useAuth } from "@/hooks/useAuth";
import StudentLogin from "./StudentLogin";

const Index = () => {
  const [activeTab, setActiveTab] = useState<NavCategory>("chat");
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) {
    return <StudentLogin />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case "chat":
        return <ChatInterface />;
      case "colleges":
        return <CollegeList />;
      case "admissions":
        return <AdmissionsInfo />;
      case "scholarships":
        return <ScholarshipList />;
      case "recommend":
        return <CollegeRecommender />;
      case "predictor":
        return <CollegePredictor />;
      case "contact":
        return <ContactForm />;
      default:
        return <ChatInterface />;
    }
  };

  return (
    <AppLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </AppLayout>
  );
};

export default Index;
